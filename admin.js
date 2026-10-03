/**
 * Shri Gurudatta Astroved - Admin Panel Logic
 * Manages Services, Products, Contact Details, and Multi-Image Uploads
 */

let siteData = null;
let currentServiceImages = [];
let currentProductImages = [];

// Admin Session & Token Management
function getAdminToken() {
  return localStorage.getItem("guru_admin_token") || sessionStorage.getItem("guru_admin_token") || "";
}

function setAdminToken(token, remember) {
  if (remember) {
    localStorage.setItem("guru_admin_token", token);
  } else {
    sessionStorage.setItem("guru_admin_token", token);
  }
}

function clearAdminToken() {
  localStorage.removeItem("guru_admin_token");
  sessionStorage.removeItem("guru_admin_token");
}

async function verifyAdminAuth() {
  const token = getAdminToken();
  const overlay = document.getElementById("adminLoginOverlay");

  if (!token) {
    if (overlay) overlay.classList.remove("hidden");
    return false;
  }

  try {
    const res = await fetch("/api/auth/verify", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      if (overlay) overlay.classList.add("hidden");
      return true;
    }
  } catch (e) {
    console.warn("Auth check network error:", e);
  }

  if (overlay) overlay.classList.remove("hidden");
  return false;
}

document.addEventListener("DOMContentLoaded", async () => {
  setupLoginEvents();
  const isAuthed = await verifyAdminAuth();
  await loadAdminData();
  setupTabs();
  renderAdminServices();
  renderAdminProducts();
  renderAdminBanners();
  loadAndRenderBookings();
  populateSettings();
  bindAdminEvents();
});

function setupLoginEvents() {
  const btnLogin = document.getElementById("btnLoginSubmit");
  const emailInput = document.getElementById("adminEmailInput");
  const pwdInput = document.getElementById("adminPasswordInput");
  const rememberCheckbox = document.getElementById("rememberMeCheckbox");
  const errorMsg = document.getElementById("loginErrorMessage");
  const btnLogout = document.getElementById("btnAdminLogout");
  const overlay = document.getElementById("adminLoginOverlay");

  async function handleLogin() {
    const email = emailInput ? emailInput.value.trim() : "";
    const password = pwdInput ? pwdInput.value.trim() : "";

    if (!password) {
      errorMsg.textContent = "Please enter your password.";
      errorMsg.style.display = "block";
      return;
    }

    errorMsg.style.display = "none";
    btnLogin.disabled = true;
    btnLogin.textContent = "Logging in...";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token, rememberCheckbox ? rememberCheckbox.checked : true);
        if (pwdInput) pwdInput.value = "";
        overlay.classList.add("hidden");
        showToast("Welcome to Shri Gurudatta Admin Panel!", "success");
        await loadAdminData();
        renderAdminServices();
        renderAdminProducts();
        renderAdminBanners();
        populateSettings();
      } else {
        errorMsg.textContent = data.error || "Invalid email or password. Please try again.";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Server unreachable. Make sure local server is running.";
      errorMsg.style.display = "block";
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = "Sign In";
    }
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", handleLogin);
  }

  if (pwdInput) {
    pwdInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLogin();
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        pwdInput?.focus();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out of the Admin Panel?")) {
        clearAdminToken();
        overlay.classList.remove("hidden");
        showToast("Logged out successfully.", "info");
      }
    });
  }
}



// Load Data from Server / localStorage / site_data.json
async function loadAdminData() {
  try {
    const res = await fetch("/api/data");
    if (res.ok) {
      siteData = await res.json();
    } else {
      throw new Error("Local API unavailable");
    }
  } catch (e) {
    try {
      const resSupa = await fetch("https://vbfdimlkbilkdakjbfjg.supabase.co/storage/v1/object/public/site_data/site_data.json");
      if (resSupa.ok) {
        siteData = await resSupa.json();
      }
    } catch (errSupa) {
      console.warn("Could not fetch from Supabase:", errSupa);
    }
  }

  if (!siteData) {
    const cached = localStorage.getItem("shri_gurudatta_site_data");
    if (cached) {
      try {
        siteData = JSON.parse(cached);
      } catch (err) {}
    }
  }

  // Ensure default structures exist
  if (!siteData) {
    siteData = {
      business: {
        name: "Shri GuruDatta Astroved",
        experience: "15+ Years",
        tagline: "Rewriting your Luck Through Astrology",
        phoneDisplay: "+91 90638 62498 / +91 76759 66942",
        phoneRaw: "917675966942",
        whatsappRaw: "9063862498",
        gpayNumber: "7675966942",
        upiId: "7675966942@ybl",
        qrImage: "payment_qr.png",
        address: "Kesanupalli village, Dachepalli mandal, Palnadu district – 522414",
        timings: "Morning: 09:00 AM – 01:00 PM | Evening: 04:00 PM – 08:30 PM"
      },
      services: [],
      products: [],
      banners: []
    };
  }

  if (!Array.isArray(siteData.services)) siteData.services = [];
  if (!Array.isArray(siteData.products)) siteData.products = [];
  if (!Array.isArray(siteData.banners)) siteData.banners = [];
}

// Save Data to Server API and Supabase Postgres
async function saveAllData(customMsg = "Changes saved and live on website!") {
  const token = getAdminToken();
  if (!token) {
    showToast("Please log in to save changes.", "info");
    document.getElementById("adminLoginOverlay")?.classList.remove("hidden");
    return;
  }

  showToast("Saving changes to database...", "info");

  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(siteData)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("shri_gurudatta_site_data", JSON.stringify(siteData));
      showToast(data.message || customMsg, "success");
      return;
    } else if (res.status === 401) {
      clearAdminToken();
      document.getElementById("adminLoginOverlay")?.classList.remove("hidden");
      showToast("Session expired. Please log in again.", "info");
      return;
    }
  } catch (e) {
    console.warn("Server save error:", e);
  }

  showToast("Could not sync to database. Check server connection.", "error");
}

// Tab Switching & Sidebar Navigation
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const topbarTitle = document.getElementById("topbarTitle");
  const sidebar = document.getElementById("adminSidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  const titles = {
    "tab-services": "Astrology Services",
    "tab-products": "Astro Products",
    "tab-banners": "Homepage Banners",
    "tab-bookings": "Consultation Leads",
    "tab-settings": "Contact & Payment Settings"
  };

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");

      if (topbarTitle && titles[targetId]) {
        topbarTitle.textContent = titles[targetId];
      }

      if (targetId === "tab-bookings") {
        loadAndRenderBookings();
      }

      // Close mobile sidebar if open
      if (sidebar && window.innerWidth < 992) {
        sidebar.classList.remove("mobile-open");
      }
    });
  });

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }
}

// ----------------------------------------------------
// TAB 1: SERVICES MANAGEMENT
// ----------------------------------------------------
function renderAdminServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (siteData.services.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #8A98B0;">No services added yet. Click "+ Add New Service" above.</div>`;
    return;
  }

  siteData.services.forEach((service, index) => {
    const card = document.createElement("div");
    card.className = "admin-item-card";

    const coverImg = (service.images && service.images.length > 0) ? service.images[0] : (service.img || "service_general.jpg");
    const imgCount = (service.images && service.images.length > 0) ? service.images.length : 1;

    card.innerHTML = `
      <div class="admin-card-media">
        <img src="${coverImg}" alt="${service.title}" onerror="this.src='image.png'">
        <span class="admin-card-badge">${imgCount} Image${imgCount > 1 ? 's' : ''}</span>
      </div>
      <div class="admin-card-body">
        <div>
          <h3 class="admin-card-title">${service.title}</h3>
          <p class="admin-card-desc">${service.shortDesc || "No short description provided."}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn-action-edit" onclick="openEditServiceModal(${index})">✏️ Edit Service</button>
          <button class="btn-action-delete" onclick="deleteService(${index})">🗑️ Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.openEditServiceModal = function(index) {
  const modal = document.getElementById("serviceModal");
  const modalTitle = document.getElementById("serviceModalTitle");
  const indexInput = document.getElementById("serviceEditIndex");
  const titleInput = document.getElementById("serviceInputTitle");
  const shortDescInput = document.getElementById("serviceInputShortDesc");
  const explInput = document.getElementById("serviceInputExplanation");
  const waInput = document.getElementById("serviceInputWa");

  indexInput.value = index;

  if (index >= 0) {
    const s = siteData.services[index];
    modalTitle.textContent = `Edit Service: ${s.title}`;
    titleInput.value = s.title || "";
    shortDescInput.value = s.shortDesc || "";
    explInput.value = s.explanation || s.headline || "";
    waInput.value = s.waMessage || "";
    currentServiceImages = s.images ? [...s.images] : [s.img || "service_general.jpg"];
  } else {
    modalTitle.textContent = "Add New Service";
    titleInput.value = "";
    shortDescInput.value = "";
    explInput.value = "";
    waInput.value = "Hello Guruji, I would like to consult regarding this service.";
    currentServiceImages = ["service_general.jpg"];
  }

  renderServiceImageChips();
  modal.classList.add("active");
};

function renderServiceImageChips() {
  const strip = document.getElementById("serviceImagesStrip");
  strip.innerHTML = "";

  currentServiceImages.forEach((src, idx) => {
    const chip = document.createElement("div");
    chip.className = "img-chip";
    chip.innerHTML = `
      <img src="${src}" alt="Image ${idx + 1}" onerror="this.src='image.png'">
      <button type="button" class="img-chip-remove" onclick="removeServiceImage(${idx})">&times;</button>
    `;
    strip.appendChild(chip);
  });
}

window.removeServiceImage = function(idx) {
  currentServiceImages.splice(idx, 1);
  renderServiceImageChips();
};

window.deleteService = function(index) {
  if (confirm(`Are you sure you want to delete "${siteData.services[index].title}"?`)) {
    siteData.services.splice(index, 1);
    renderAdminServices();
    saveAllData("Service deleted successfully!");
  }
};

// ----------------------------------------------------
// TAB 2: ASTRO PRODUCTS MANAGEMENT
// ----------------------------------------------------
function renderAdminProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (siteData.products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #8A98B0;">No products added yet. Click "+ Add New Product" above.</div>`;
    return;
  }

  siteData.products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "admin-item-card";

    const coverImg = (product.images && product.images.length > 0) ? product.images[0] : (product.img || "product_yantra.jpg");
    const imgCount = (product.images && product.images.length > 0) ? product.images.length : 1;

    card.innerHTML = `
      <div class="admin-card-media">
        <img src="${coverImg}" alt="${product.title}" onerror="this.src='image.png'">
        <span class="admin-card-badge">${imgCount} Image${imgCount > 1 ? 's' : ''}</span>
      </div>
      <div class="admin-card-body">
        <div>
          <h3 class="admin-card-title">${product.title}</h3>
          <p class="admin-card-desc">${product.shortDesc || "No description provided."}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn-action-edit" onclick="openEditProductModal(${index})">✏️ Edit Product</button>
          <button class="btn-action-delete" onclick="deleteProduct(${index})">🗑️ Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.openEditProductModal = function(index) {
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("productModalTitle");
  const indexInput = document.getElementById("productEditIndex");
  const titleInput = document.getElementById("productInputTitle");
  const shortDescInput = document.getElementById("productInputShortDesc");
  const specsInput = document.getElementById("productInputSpecs");
  const waInput = document.getElementById("productInputWa");

  indexInput.value = index;

  if (index >= 0) {
    const p = siteData.products[index];
    modalTitle.textContent = `Edit Product: ${p.title}`;
    titleInput.value = p.title || "";
    shortDescInput.value = p.shortDesc || "";
    specsInput.value = p.specs || "";
    waInput.value = p.waMessage || "";
    currentProductImages = p.images ? [...p.images] : [p.img || "product_yantra.jpg"];
  } else {
    modalTitle.textContent = "Add New Astro Product";
    titleInput.value = "";
    shortDescInput.value = "";
    specsInput.value = "";
    waInput.value = "Hello Guruji, I would like to order this Astro Product.";
    currentProductImages = ["product_yantra.jpg"];
  }

  renderProductImageChips();
  modal.classList.add("active");
};

function renderProductImageChips() {
  const strip = document.getElementById("productImagesStrip");
  strip.innerHTML = "";

  currentProductImages.forEach((src, idx) => {
    const chip = document.createElement("div");
    chip.className = "img-chip";
    chip.innerHTML = `
      <img src="${src}" alt="Product Image ${idx + 1}" onerror="this.src='image.png'">
      <button type="button" class="img-chip-remove" onclick="removeProductImage(${idx})">&times;</button>
    `;
    strip.appendChild(chip);
  });
}

window.removeProductImage = function(idx) {
  currentProductImages.splice(idx, 1);
  renderProductImageChips();
};

window.deleteProduct = function(index) {
  if (confirm(`Are you sure you want to delete "${siteData.products[index].title}"?`)) {
    siteData.products.splice(index, 1);
    renderAdminProducts();
    saveAllData("Product deleted successfully!");
  }
};

// ----------------------------------------------------
// TAB 3: HOMEPAGE BANNERS MANAGEMENT
// ----------------------------------------------------
function renderAdminBanners() {
  const grid = document.getElementById("bannersGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!siteData.banners || siteData.banners.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--admin-text-muted);">No banners added yet. Click "+ Add New Banner" above.</div>`;
    return;
  }

  siteData.banners.forEach((banner, index) => {
    const card = document.createElement("div");
    card.className = "admin-item-card";

    const bannerImg = banner.img || "astrologer_portrait.jpg";

    card.innerHTML = `
      <div class="admin-card-media">
        <img src="${bannerImg}" alt="${banner.title}" onerror="this.src='astrologer_portrait.jpg'">
        <span class="admin-card-badge">Banner #${index + 1}</span>
      </div>
      <div class="admin-card-body">
        <div>
          <h3 class="admin-card-title">${banner.title}</h3>
          <p class="admin-card-desc">Button: <strong>${banner.buttonText || "Book Consultation"}</strong><br>${banner.waMessage || "WhatsApp Consultation Action"}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn-action-edit" onclick="openEditBannerModal(${index})">✏️ Edit Banner</button>
          <button class="btn-action-delete" onclick="deleteBanner(${index})">🗑️ Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.openEditBannerModal = function(index) {
  const modal = document.getElementById("bannerModal");
  const modalTitle = document.getElementById("bannerModalTitle");
  const indexInput = document.getElementById("bannerEditIndex");
  const titleInput = document.getElementById("bannerInputTitle");
  const btnTextInput = document.getElementById("bannerInputButtonText");
  const imgInput = document.getElementById("bannerInputImg");
  const previewImg = document.getElementById("bannerPreviewImg");
  const waInput = document.getElementById("bannerInputWa");

  indexInput.value = index;

  if (index >= 0 && siteData.banners && siteData.banners[index]) {
    const b = siteData.banners[index];
    modalTitle.textContent = `Edit Banner: ${b.title}`;
    titleInput.value = b.title || "";
    btnTextInput.value = b.buttonText || "Book Consultation";
    imgInput.value = b.img || "";
    previewImg.src = b.img || "astrologer_portrait.jpg";
    waInput.value = b.waMessage || "";
  } else {
    modalTitle.textContent = "Add New Homepage Banner";
    titleInput.value = "";
    btnTextInput.value = "Book Consultation";
    imgInput.value = "astrologer_portrait.jpg";
    previewImg.src = "astrologer_portrait.jpg";
    waInput.value = "Hello Guruji, I would like to consult regarding this consultation banner.";
  }

  modal.classList.add("active");
};

function closeBannerModal() {
  const modal = document.getElementById("bannerModal");
  if (modal) modal.classList.remove("active");
}

window.deleteBanner = function(index) {
  if (confirm(`Are you sure you want to delete banner "${siteData.banners[index].title}"?`)) {
    siteData.banners.splice(index, 1);
    renderAdminBanners();
    saveAllData("Banner deleted successfully!");
  }
// ----------------------------------------------------
// TAB 4: CONSULTATION LEADS MANAGEMENT
// ----------------------------------------------------
async function loadAndRenderBookings() {
  const container = document.getElementById("bookingsListContainer");
  if (!container) return;

  const token = getAdminToken();
  if (!token) return;

  container.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--admin-text-muted);">Loading consultation inquiries...</div>`;

  try {
    const res = await fetch("/api/bookings", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      const bookings = await res.json();
      if (!Array.isArray(bookings) || bookings.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; background: #FFFFFF; border: 1px dashed var(--admin-border); border-radius: 12px; color: var(--admin-text-muted);">No consultation inquiries received yet. Inquiries submitted from website forms will appear here in real time.</div>`;
        return;
      }

      container.innerHTML = "";
      bookings.forEach((b) => {
        const item = document.createElement("div");
        item.style.cssText = "background: #FFFFFF; border: 1px solid var(--admin-border); border-radius: 12px; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);";

        const cleanPhone = (b.phone || "").replace(/[^0-9]/g, '');
        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${b.name}, thank you for reaching out to Shri Gurudatta Astroved regarding ${b.service}.`)}`;
        const dateStr = b.created_at ? new Date(b.created_at).toLocaleString() : "Recently";

        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h3 style="margin: 0; font-size: 1.15rem; color: var(--admin-text-main); font-weight: 700;">${b.name}</h3>
                <span style="background: #FEF3C7; color: #92400E; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">${b.status || 'New Lead'}</span>
              </div>
              <p style="margin: 4px 0 0; font-size: 0.82rem; color: var(--admin-text-muted);">Submitted: ${dateStr}</p>
            </div>

            <div style="display: flex; gap: 8px;">
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: #25D366; color: #FFFFFF; text-decoration: none; padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
                <span>💬 WhatsApp Client</span>
              </a>
              <a href="tel:${b.phone}" style="display: inline-flex; align-items: center; gap: 6px; background: #0F172A; color: #FFFFFF; text-decoration: none; padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
                <span>📞 Call</span>
              </a>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: #F8FAFC; padding: 14px; border-radius: 8px;">
            <div>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted); display: block;">PHONE NUMBER</span>
              <strong style="font-size: 0.95rem; color: var(--admin-text-main);">${b.phone}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted); display: block;">REQUESTED SERVICE</span>
              <strong style="font-size: 0.95rem; color: #B45309;">${b.service || 'Astrology Consultation'}</strong>
            </div>
            ${b.email ? `
            <div>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted); display: block;">EMAIL</span>
              <strong style="font-size: 0.95rem; color: var(--admin-text-main);">${b.email}</strong>
            </div>` : ''}
          </div>

          ${b.message ? `
          <div style="font-size: 0.88rem; color: #334155; line-height: 1.5; background: #FFFFFF; border-left: 3px solid var(--admin-primary); padding: 8px 12px;">
            <strong>Query / Details:</strong> ${b.message}
          </div>` : ''}
        `;
        container.appendChild(item);
      });
    }
  } catch (e) {
    container.innerHTML = `<div style="text-align: center; padding: 20px; color: #DC2626;">Failed to load inquiries: ${e.message}</div>`;
  }
}

// ----------------------------------------------------
// TAB 5: SETTINGS POPULATION
// ----------------------------------------------------
function populateSettings() {
  const b = siteData.business || {};
  document.getElementById("settingWhatsapp").value = b.whatsappRaw || "9063862498";
  document.getElementById("settingGpay").value = b.gpayNumber || "7675966942";
  document.getElementById("settingUpi").value = b.upiId || "7675966942@ybl";
  document.getElementById("settingPhoneDisplay").value = b.phoneDisplay || "+91 90638 62498 / +91 76759 66942";
  document.getElementById("settingAddress").value = b.address || "";
  document.getElementById("settingTimings").value = b.timings || "Morning: 09:00 AM – 01:00 PM | Evening: 04:00 PM – 08:30 PM";

  if (b.qrImage) {
    document.getElementById("qrPreviewImg").src = b.qrImage;
  }
}

// ----------------------------------------------------
// EVENT BINDINGS
// ----------------------------------------------------
function bindAdminEvents() {
  // Master Save Button
  document.getElementById("btnMasterSave").addEventListener("click", () => {
    saveSettingsFromForm();
    saveAllData("All settings, services, and products are live!");
  });

  // Save Settings Button
  document.getElementById("btnSaveSettings").addEventListener("click", () => {
    saveSettingsFromForm();
    saveAllData("Payment & contact details updated successfully!");
  });

  // Services Modal Events
  document.getElementById("btnAddNewService").addEventListener("click", () => openEditServiceModal(-1));
  document.getElementById("btnCloseServiceModal").addEventListener("click", () => closeServiceModal());
  document.getElementById("btnCancelService").addEventListener("click", () => closeServiceModal());

  // Products Modal Events
  document.getElementById("btnAddNewProduct").addEventListener("click", () => openEditProductModal(-1));
  document.getElementById("btnCloseProductModal").addEventListener("click", () => closeProductModal());
  document.getElementById("btnCancelProduct").addEventListener("click", () => closeProductModal());

  // Manual image URL additions
  document.getElementById("btnAddServiceImgManual").addEventListener("click", () => {
    const input = document.getElementById("serviceManualImgInput");
    if (input.value.trim()) {
      currentServiceImages.push(input.value.trim());
      input.value = "";
      renderServiceImageChips();
    }
  });

  document.getElementById("btnAddProductImgManual").addEventListener("click", () => {
    const input = document.getElementById("productManualImgInput");
    if (input.value.trim()) {
      currentProductImages.push(input.value.trim());
      input.value = "";
      renderProductImageChips();
    }
  });

  // Service File Upload trigger
  document.getElementById("serviceUploadBox").addEventListener("click", () => {
    document.getElementById("serviceFileInput").click();
  });

  document.getElementById("serviceFileInput").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    for (const f of files) {
      const uploadedUrl = await handleFileUpload(f);
      if (uploadedUrl) currentServiceImages.push(uploadedUrl);
    }
    renderServiceImageChips();
  });

  // Product File Upload trigger
  document.getElementById("productUploadBox").addEventListener("click", () => {
    document.getElementById("productFileInput").click();
  });

  document.getElementById("productFileInput").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    for (const f of files) {
      const uploadedUrl = await handleFileUpload(f);
      if (uploadedUrl) currentProductImages.push(uploadedUrl);
    }
    renderProductImageChips();
  });

  // QR Code upload trigger
  document.getElementById("qrUploadBox").addEventListener("click", () => {
    document.getElementById("qrFileInput").click();
  });

  document.getElementById("qrFileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleFileUpload(file);
      if (url) {
        siteData.business.qrImage = url;
        document.getElementById("qrPreviewImg").src = url;
        showToast("QR code updated! Remember to click Save.", "success");
      }
    }
  });

  // Save Service from Modal
  document.getElementById("btnSaveService").addEventListener("click", () => {
    const idx = parseInt(document.getElementById("serviceEditIndex").value, 10);
    const title = document.getElementById("serviceInputTitle").value.trim();
    if (!title) {
      alert("Please enter a service title.");
      return;
    }

    const shortDesc = document.getElementById("serviceInputShortDesc").value.trim();
    const explanation = document.getElementById("serviceInputExplanation").value.trim();
    const waMessage = document.getElementById("serviceInputWa").value.trim();
    const images = currentServiceImages.length > 0 ? [...currentServiceImages] : ["service_general.jpg"];

    const serviceObj = {
      id: (idx >= 0 && siteData.services[idx].id) ? siteData.services[idx].id : title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      shortDesc,
      explanation,
      headline: title,
      img: images[0],
      images: images,
      waMessage: waMessage || "Hello Guruji, I would like to consult regarding this service."
    };

    if (idx >= 0) {
      siteData.services[idx] = { ...siteData.services[idx], ...serviceObj };
    } else {
      siteData.services.push(serviceObj);
    }

    closeServiceModal();
    renderAdminServices();
    saveAllData("Service saved successfully!");
  });

  // Save Product from Modal
  document.getElementById("btnSaveProduct").addEventListener("click", () => {
    const idx = parseInt(document.getElementById("productEditIndex").value, 10);
    const title = document.getElementById("productInputTitle").value.trim();
    if (!title) {
      alert("Please enter a product name.");
      return;
    }

    const shortDesc = document.getElementById("productInputShortDesc").value.trim();
    const specs = document.getElementById("productInputSpecs").value.trim();
    const waMessage = document.getElementById("productInputWa").value.trim();
    const images = currentProductImages.length > 0 ? [...currentProductImages] : ["product_yantra.jpg"];

    const productObj = {
      id: (idx >= 0 && siteData.products[idx].id) ? siteData.products[idx].id : title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      shortDesc,
      specs,
      img: images[0],
      images: images,
      waMessage: waMessage || "Hello Guruji, I would like to order this Astro Product."
    };

    if (idx >= 0) {
      siteData.products[idx] = { ...siteData.products[idx], ...productObj };
    } else {
      siteData.products.push(productObj);
    }

    closeProductModal();
    renderAdminProducts();
    saveAllData("Product saved successfully!");
  });

  // Banner Modal Events
  const btnAddBanner = document.getElementById("btnAddNewBanner");
  if (btnAddBanner) btnAddBanner.addEventListener("click", () => openEditBannerModal(-1));

  const btnCloseBanner = document.getElementById("btnCloseBannerModal");
  if (btnCloseBanner) btnCloseBanner.addEventListener("click", () => closeBannerModal());

  const btnCancelBanner = document.getElementById("btnCancelBanner");
  if (btnCancelBanner) btnCancelBanner.addEventListener("click", () => closeBannerModal());

  // Banner image manual input change
  const bannerImgInput = document.getElementById("bannerInputImg");
  if (bannerImgInput) {
    bannerImgInput.addEventListener("input", (e) => {
      document.getElementById("bannerPreviewImg").src = e.target.value.trim() || "astrologer_portrait.jpg";
    });
  }

  // Banner File Upload trigger (Cloudinary)
  const bannerUploadBox = document.getElementById("bannerUploadBox");
  const bannerFileInput = document.getElementById("bannerFileInput");
  if (bannerUploadBox && bannerFileInput) {
    bannerUploadBox.addEventListener("click", () => bannerFileInput.click());
    bannerFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        showToast("Uploading banner to Cloudinary...", "info");
        const uploadedUrl = await handleFileUpload(file);
        if (uploadedUrl) {
          document.getElementById("bannerInputImg").value = uploadedUrl;
          document.getElementById("bannerPreviewImg").src = uploadedUrl;
          showToast("Banner image uploaded to Cloudinary!", "success");
        }
      }
    });
  }

  // Save Banner from Modal
  const btnSaveBanner = document.getElementById("btnSaveBanner");
  if (btnSaveBanner) {
    btnSaveBanner.addEventListener("click", () => {
      const idx = parseInt(document.getElementById("bannerEditIndex").value, 10);
      const title = document.getElementById("bannerInputTitle").value.trim();
      if (!title) {
        alert("Please enter a banner title.");
        return;
      }

      const buttonText = document.getElementById("bannerInputButtonText").value.trim() || "Book Consultation";
      const img = document.getElementById("bannerInputImg").value.trim() || "astrologer_portrait.jpg";
      const waMessage = document.getElementById("bannerInputWa").value.trim() || "Hello Guruji, I would like to consult.";

      const bannerObj = {
        id: (idx >= 0 && siteData.banners[idx] && siteData.banners[idx].id) ? siteData.banners[idx].id : ("banner-" + Date.now()),
        title,
        buttonText,
        img,
        waMessage
      };

      if (!Array.isArray(siteData.banners)) siteData.banners = [];

      if (idx >= 0) {
        siteData.banners[idx] = { ...siteData.banners[idx], ...bannerObj };
      } else {
        siteData.banners.push(bannerObj);
      }

      closeBannerModal();
      renderAdminBanners();
      saveAllData("Homepage banner saved and live on website!");
    });
  }

  // Refresh Consultation Inquiries
  const btnRefreshBookings = document.getElementById("btnRefreshBookings");
  if (btnRefreshBookings) {
    btnRefreshBookings.addEventListener("click", () => {
      loadAndRenderBookings();
      showToast("Consultation inquiries refreshed!", "info");
    });
  }
}

function saveSettingsFromForm() {
  siteData.business = siteData.business || {};
  siteData.business.whatsappRaw = document.getElementById("settingWhatsapp").value.trim();
  siteData.business.gpayNumber = document.getElementById("settingGpay").value.trim();
  siteData.business.upiId = document.getElementById("settingUpi").value.trim();
  siteData.business.phoneDisplay = document.getElementById("settingPhoneDisplay").value.trim();
  siteData.business.address = document.getElementById("settingAddress").value.trim();
  siteData.business.timings = document.getElementById("settingTimings").value.trim();
}

function closeServiceModal() {
  document.getElementById("serviceModal").classList.remove("active");
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
}

// Convert file to base64 & upload to Cloudinary via server
function handleFileUpload(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const token = getAdminToken();

      // Try uploading to server
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ filename: file.name, base64 })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url || data.filename) {
            resolve(data.url || data.filename);
            return;
          }
        } else if (res.status === 401) {
          clearAdminToken();
          document.getElementById("adminLoginOverlay")?.classList.remove("hidden");
          showToast("Session expired. Please log in to upload.", "info");
        }
      } catch (err) {
        console.warn("Upload API unavailable, using base64 data URL:", err);
      }

      // Fallback to base64 data URL
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

// Toast Notifications
function showToast(msg, type = "success") {
  const toast = document.getElementById("adminToast");
  const msgSpan = document.getElementById("toastMsg");
  const iconSpan = document.getElementById("toastIcon");

  msgSpan.textContent = msg;
  iconSpan.textContent = type === "success" ? "✅" : "ℹ️";
  toast.className = `admin-toast ${type}`;
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}
