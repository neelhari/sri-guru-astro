const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'site_data.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'guruastro2026';

// Cloudinary Credentials
const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_API_SECRET;

// Supabase Credentials
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;

// Verify authentic Supabase Auth user token
async function verifyAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_SECRET,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const user = await res.json();
      return !!(user && user.id);
    }
  } catch (e) {
    console.warn('Supabase token verification network error:', e.message);
  }
  return false;
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.mp4': 'video/mp4'
};

// Helper: Upload image directly to Cloudinary
function uploadToCloudinary(base64Data, filename) {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `folder=gurudatta_astro&timestamp=${timestamp}${CLOUDINARY_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const postData = JSON.stringify({
      file: base64Data,
      api_key: CLOUDINARY_KEY,
      timestamp: timestamp,
      folder: 'gurudatta_astro',
      signature: signature
    });

    const req = https.request({
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode === 200 && parsed.secure_url) {
            resolve(parsed.secure_url);
          } else {
            console.warn('Cloudinary upload warning:', parsed);
            reject(new Error(parsed.error ? parsed.error.message : 'Cloudinary upload failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Helper: Fetch all 4 tables directly from Supabase Postgres
async function fetchTablesFromSupabase() {
  const headers = {
    'apikey': SUPABASE_SECRET,
    'Authorization': `Bearer ${SUPABASE_SECRET}`
  };

  const [bRes, sRes, pRes, setRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/banners?select=*&order=display_order.asc`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/services?select=*&order=display_order.asc`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=display_order.asc`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, { headers })
  ]);

  if (!bRes.ok || !sRes.ok || !pRes.ok || !setRes.ok) {
    throw new Error('Supabase tables fetch failed');
  }

  const banners = await bRes.json();
  const services = await sRes.json();
  const products = await pRes.json();
  const settings = await setRes.json();

  const businessRow = settings.find(s => s.key === 'business');
  const business = businessRow ? businessRow.value : {};

  // Map database format to frontend schema
  const formattedServices = services.map(s => ({
    id: s.id,
    title: s.title,
    shortDesc: s.short_desc,
    headline: s.headline,
    explanation: s.explanation,
    img: s.image_url || (Array.isArray(s.images) && s.images[0]) || 'service_general.jpg',
    images: Array.isArray(s.images) ? s.images : [s.image_url],
    pageUrl: s.page_url,
    waMessage: s.wa_message
  }));

  const formattedProducts = products.map(p => ({
    id: p.id,
    title: p.title,
    shortDesc: p.short_desc,
    specs: p.specs,
    img: p.image_url || (Array.isArray(p.images) && p.images[0]) || 'product_rudraksha.jpg',
    images: Array.isArray(p.images) ? p.images : [p.image_url],
    pageUrl: p.page_url,
    waMessage: p.wa_message
  }));

  const formattedBanners = banners.map(b => ({
    id: b.id,
    title: b.title,
    buttonText: b.button_text,
    img: b.image_url,
    waMessage: b.wa_message
  }));

  return {
    business,
    banners: formattedBanners,
    services: formattedServices,
    products: formattedProducts
  };
}

// Helper: Save site data to Supabase Tables directly
async function saveTablesToSupabase(data) {
  const headers = {
    'apikey': SUPABASE_SECRET,
    'Authorization': `Bearer ${SUPABASE_SECRET}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  };

  const promises = [];

  // 1. Save Settings
  if (data.business) {
    promises.push(
      fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify([{ key: 'business', value: data.business, updated_at: new Date().toISOString() }])
      })
    );
  }

  // 2. Save Banners
  if (Array.isArray(data.banners) && data.banners.length > 0) {
    const bannerRows = data.banners.map((b, idx) => ({
      id: b.id || `banner-${idx + 1}`,
      title: b.title,
      button_text: b.buttonText || 'Book Consultation',
      image_url: b.img || 'astrologer_portrait.jpg',
      wa_message: b.waMessage || '',
      display_order: idx + 1,
      is_active: true,
      updated_at: new Date().toISOString()
    }));
    promises.push(
      fetch(`${SUPABASE_URL}/rest/v1/banners`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bannerRows)
      })
    );
  }

  // 3. Save Services
  if (Array.isArray(data.services) && data.services.length > 0) {
    const serviceRows = data.services.map((s, idx) => ({
      id: s.id || `service-${idx + 1}`,
      title: s.title,
      short_desc: s.shortDesc || '',
      headline: s.headline || '',
      explanation: s.explanation || '',
      images: JSON.stringify(s.images || [s.img]),
      image_url: s.img || '',
      page_url: s.pageUrl || '',
      wa_message: s.waMessage || '',
      display_order: idx + 1,
      is_active: true,
      updated_at: new Date().toISOString()
    }));
    promises.push(
      fetch(`${SUPABASE_URL}/rest/v1/services`, {
        method: 'POST',
        headers,
        body: JSON.stringify(serviceRows)
      })
    );
  }

  // 4. Save Products
  if (Array.isArray(data.products) && data.products.length > 0) {
    const productRows = data.products.map((p, idx) => ({
      id: p.id || `product-${idx + 1}`,
      title: p.title,
      short_desc: p.shortDesc || '',
      specs: p.specs || '',
      images: JSON.stringify(p.images || [p.img]),
      image_url: p.img || '',
      page_url: p.pageUrl || '',
      wa_message: p.waMessage || '',
      display_order: idx + 1,
      is_active: true,
      updated_at: new Date().toISOString()
    }));
    promises.push(
      fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productRows)
      })
    );
  }

  const results = await Promise.all(promises);
  return results.every(r => r.ok);
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Admin Login (Exclusively via Supabase Cloud Auth)
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email and password are required' }));
          return;
        }

        // Send to Supabase Auth Cloud
        const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SECRET,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const authData = await authRes.json();
        if (authRes.ok && authData.access_token) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            token: authData.access_token,
            user: { id: authData.user?.id, email: authData.user?.email || email },
            message: 'Logged in successfully via Supabase Auth'
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: authData.error_description || authData.msg || 'Invalid email or password'
          }));
        }
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Supabase authentication service error: ' + e.message }));
      }
    });
    return;
  }

  // API: Verify Admin Token via Supabase Cloud
  if (req.url === '/api/auth/verify' && req.method === 'GET') {
    verifyAuth(req).then(isAuthed => {
      if (isAuthed) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ authenticated: true }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ authenticated: false }));
      }
    });
    return;
  }

  // API: Get site data (Supabase Postgres Tables with local mirror fallback)
  if (req.url === '/api/data' && req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    fetchTablesFromSupabase()
      .then(data => {
        // Also update local file cache
        try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8'); } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
        console.warn('Supabase DB fetch fallback to local:', err.message);
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read data' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });
    return;
  }

  // API: Save site data (Requires Valid Supabase Auth Token)
  if (req.url === '/api/data' && req.method === 'POST') {
    verifyAuth(req).then(isAuthed => {
      if (!isAuthed) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Valid Supabase admin login required' }));
        return;
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const formattedJson = JSON.stringify(parsed, null, 2);

          // 1. Write to local file mirror
          fs.writeFileSync(DATA_FILE, formattedJson, 'utf8');

          // 2. Write directly to Supabase Postgres Tables
          const dbSynced = await saveTablesToSupabase(parsed);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: dbSynced ? 'Data saved to Supabase database!' : 'Data saved locally',
            dbSynced
          }));
        } catch (e) {
          console.error('Error saving data:', e);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Save error: ' + e.message }));
        }
      });
    });
    return;
  }

  // API: Upload image (Requires Valid Supabase Auth Token)
  if (req.url === '/api/upload' && req.method === 'POST') {
    verifyAuth(req).then(isAuthed => {
      if (!isAuthed) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Valid Supabase admin login required' }));
        return;
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { filename, base64 } = JSON.parse(body);
          if (!filename || !base64) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing filename or base64' }));
            return;
          }

          // Upload to Cloudinary
          try {
            const cloudinaryUrl = await uploadToCloudinary(base64, filename);
            console.log(`✓ Image "${filename}" successfully uploaded to Cloudinary:`, cloudinaryUrl);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              provider: 'cloudinary',
              filename: cloudinaryUrl,
              url: cloudinaryUrl
            }));
            return;
          } catch (cloudErr) {
            console.warn('Cloudinary upload error:', cloudErr.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cloudinary upload failed: ' + cloudErr.message }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to parse image payload' }));
        }
      });
    });
    return;
  }

  // API: Submit Consultation Booking Lead (Public)
  if (req.url === '/api/bookings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name, phone, email, service, message } = JSON.parse(body);
        if (!name || !phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name and Phone number are required' }));
          return;
        }

        const bookingItem = {
          name,
          phone,
          email: email || '',
          service: service || 'General Prediction',
          message: message || '',
          status: 'New',
          created_at: new Date().toISOString()
        };

        // 1. Try saving to Supabase consultation_bookings table
        let supaSaved = false;
        try {
          const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/consultation_bookings`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SECRET,
              'Authorization': `Bearer ${SUPABASE_SECRET}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(bookingItem)
          });
          if (supaRes.ok) supaSaved = true;
        } catch (errSupa) {
          console.warn('Supabase booking table save warning:', errSupa.message);
        }

        // 2. Also record in local bookings mirror file so lead is never lost
        const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
        try {
          let list = [];
          if (fs.existsSync(BOOKINGS_FILE)) {
            list = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8') || '[]');
          }
          list.unshift({ ...bookingItem, id: 'bk-' + Date.now() });
          fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2), 'utf8');
        } catch (e) {}

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Booking submitted successfully!',
          supaSaved
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process booking' }));
      }
    });
    return;
  }

  // API: Get All Consultation Bookings (Admin Only)
  if (req.url === '/api/bookings' && req.method === 'GET') {
    verifyAuth(req).then(async isAuthed => {
      if (!isAuthed) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Admin login required' }));
        return;
      }

      // Try fetching from Supabase table
      try {
        const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/consultation_bookings?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_SECRET,
            'Authorization': `Bearer ${SUPABASE_SECRET}`
          }
        });
        if (supaRes.ok) {
          const bookings = await supaRes.json();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(bookings));
          return;
        }
      } catch (e) {}

      // Fallback to local bookings file
      const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
      fs.readFile(BOOKINGS_FILE, 'utf8', (err, data) => {
        const list = (!err && data) ? JSON.parse(data) : [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(list));
      });
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Shri Gurudatta Astroved Server running at http://localhost:${PORT}`);
    console.log(`Supabase Tables Direct Sync: ENABLED`);
    console.log(`Cloudinary Cloud: ${CLOUDINARY_CLOUD}`);
  });
}

module.exports = server;
