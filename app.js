/**
 * Shri Gurudatta Astroved - Dynamic Application Engine
 * Renders the exact visual cards, systems, and handles WhatsApp deep-links and modal drawers.
 */

const DEFAULT_SITE_DATA = {
  business: {
    name: "Shri GuruDatta Astroved",
    experience: "15 Years",
    tagline: "Vedic Astrology & Personal Guidance",
    phoneDisplay: "+91 98765 43210",
    phoneRaw: "919876543210",
    whatsappRaw: "919876543210",
    address: "Kesanupalli village, Dachepalli mandal, Palnadu district – 522414",
    timings: "Morning: 09:00 AM – 01:00 PM | Evening: 04:00 PM – 08:30 PM"
  },

  services: [
    {
      id: "general-prediction",
      img: "service_general.jpg",
      title: "General Prediction",
      shortDesc: "Guidance for your present phase, planetary transits, and future trends.",
      headline: "Clarity on Your Current Phase & Future Path",
      explanation: "A holistic reading of your birth chart to understand your current life cycle, planetary transits (Gocharam), and what the coming months hold for health, career, and personal peace.",
      coverage: [
        "Analysis of current Mahadasha and Antardasha",
        "Key planetary transits affecting your moon sign and ascendant",
        "Clarity on upcoming turning points and favourable periods",
        "Practical remedies and precautions for difficult transits"
      ],
      suitableFor: "Anyone seeking general clarity, feeling stuck at life crossroads, or planning major personal decisions.",
      waMessage: "Hello, I would like to know more about General Prediction guidance."
    },
    {
      id: "horoscope-analysis",
      img: "service_horoscope.jpg",
      title: "Compleat Horoscope ఎనాలిసిస్",
      shortDesc: "Detailed analysis of your birth chart across 12 houses and planetary yogas.",
      headline: "Understand Your Life Through Your Birth Chart",
      explanation: "A deep, multi-system examination of your natal chart combining Parashari Vedic Astrology, KP Sub-lords, and Nadi principles to uncover your true strengths, life challenges, and destiny blueprint.",
      coverage: [
        "12 Bhavas analysis (Finance, Health, Family, Career, Foreign travel)",
        "Planetary yogas, Rajayogas, and Dosha analysis (e.g. Kuja, Rahu-Ketu)",
        "Strength of ascendant (Lagna) and Moon (Rashi)",
        "Personalized gemstone and Vedic remedial guidance"
      ],
      suitableFor: "Individuals wanting an exhaustive, lifelong roadmap of their chart and planetary influences.",
      waMessage: "Hello, I would like to know more about Compleat Horoscope ఎనాలిసిస్."
    },
    {
      id: "astro-counselling",
      img: "service_general.jpg",
      title: "Astro counseling",
      shortDesc: "Personal guidance for life matters, career transitions, and emotional peace.",
      headline: "Calm, Honest Perspective in Times of Uncertainty",
      explanation: "Personalized counselling that merges astrological insights with practical wisdom to help you overcome confusion, manage emotional stress, and make informed choices with calm confidence.",
      coverage: [
        "Identifying root planetary causes of mental unrest or delays",
        "Guidance on timing for job changes, investments, or relocations",
        "Non-judgmental, one-on-one telephonic consultation",
        "Spiritual rituals and mindset alignment remedies"
      ],
      suitableFor: "Those navigating stressful life transitions, career burnout, or complex personal dilemmas.",
      waMessage: "Hello, I would like to seek Astro counseling for personal guidance."
    },
    {
      id: "muhurtham",
      img: "service_muhurtham.jpg",
      title: "ముహూర్తం",
      shortDesc: "Find the right auspicious time for weddings, housewarmings, and new ventures.",
      headline: "Harness Auspicious Celestial Alignments for Sacred Milestones",
      explanation: "Classical Panchanga analysis (Tithi, Vara, Nakshatra, Yoga, Karana) to pinpoint the exact, most fortified moments for your life events, shielding you from malefic planetary influences.",
      coverage: [
        "Vivaha Muhurtham (Marriage timing aligning both bride and groom charts)",
        "Gruhapravesam & Bhoomi Puja timings",
        "Business openings, contract signings, and asset purchases",
        "Namakaranam and Aksharabhyasam auspicious dates"
      ],
      suitableFor: "Families and entrepreneurs preparing for milestone events, constructions, or ceremonies.",
      waMessage: "Hello, I need assistance in finding an auspicious ముహూర్తం."
    },
    {
      id: "marriage-matching",
      img: "service_marriage.jpg",
      title: "వివాహ పొంతన",
      shortDesc: "Compatibility analysis for a happy, prosperous, and harmonious future.",
      headline: "Deep Compatibility Analysis for a Blessed Union",
      explanation: "Beyond superficial Guna Milan scores, we conduct an extensive cross-chart compatibility test focusing on emotional bond, longevity, health, financial prosperity, and mutual growth.",
      coverage: [
        "Ashtakoota & Dasha Koota compatibility",
        "Manglik / Kuja Dosha verification and counter-balances",
        "Longevity (Ayushya) and health harmony between both charts",
        "Dasha agreement for synchronized marital bliss and family prosperity"
      ],
      suitableFor: "Parents, brides, and grooms seeking authentic compatibility before solemnizing marriage.",
      waMessage: "Hello, I would like to know more about వివాహ పొంతన consultation."
    },
    {
      id: "baby-naming",
      img: "service_muhurtham.jpg",
      title: "Names for new born baby",
      shortDesc: "Auspicious starting syllables based on Janma Nakshatra and Numerology.",
      headline: "Blessed First Steps: Astrological & Numerological Naming",
      explanation: "Selecting the ideal starting sound (Akshara) based on the child's Janma Nakshatra and birth Pada, harmonized with positive numerological vibrations for lifetime prosperity and good health.",
      coverage: [
        "Identification of Janma Nakshatra Pada and auspicious starting syllables",
        "Balancing planetary vibrations with Numerology",
        "Analysis of the child's basic birth yogas and planetary blessings",
        "Guidance on first rituals (Namakarana Muhurtham)"
      ],
      suitableFor: "New parents looking for traditional Vedic and numerologically aligned names for their baby.",
      waMessage: "Hello, I would like guidance for Names for new born baby."
    },
    {
      id: "marriage-counselling",
      img: "service_marriage.jpg",
      title: "Marriage Counselling",
      shortDesc: "Resolving marital discord and misunderstandings through astrological clarity.",
      headline: "Restoring Balance and Harmony in Marital Life",
      explanation: "An insightful evaluation of both spouses' horoscopes to understand conflicting planetary energies and provide realistic, peaceful remedies for mutual understanding.",
      coverage: [
        "Pinpointing planetary friction causing communication gaps or temperaments",
        "Evaluating temporary stressful transits vs. long-term compatibility",
        "Practical and spiritual remedies for peace and mutual respect",
        "Objective, constructive guidance for both partners"
      ],
      suitableFor: "Couples facing persistent misunderstandings, family tension, or relationship friction.",
      waMessage: "Hello, I would like to consult regarding Marriage Counselling."
    },
    {
      id: "homam-puja",
      img: "homam_fire.jpg",
      title: "Homam/ Japam / puja services",
      shortDesc: "Authentic Vedic rituals and fire ceremonies to pacify planetary doshas.",
      headline: "Sacred Vedic Rituals for Spiritual Elevation & Protection",
      explanation: "Properly conducted traditional Homams and Mantra Japas performed with strict adherence to Shastric injunctions, clear sankalpa, and sacred Vedic chanting for you and your family.",
      coverage: [
        "Navagraha Homam & Shanti Japas for planetary peace",
        "Ganapathi Homam, Sudarshana Homam, and Mrityunjaya Homam",
        "Specific Dosha Nivarana rituals (Kala Sarpa, Pitru Dosha)",
        "Sankalpa-based remote or in-person guidance and prasadam"
      ],
      suitableFor: "Individuals seeking spiritual remedies, removal of obstinate obstacles, or health protection.",
      waMessage: "Hello, I would like to enquire about Homam/ Japam / puja services."
    },
    {
      id: "vastu",
      img: "service_horoscope.jpg",
      title: "Vastu services",
      shortDesc: "Spatial energy alignment for homes, plots, and commercial properties.",
      headline: "Align Your Living & Working Spaces with Cosmic Harmony",
      explanation: "Vedic Vastu Shastra principles to optimize directional energies (Pancha Bhoota balance), promoting prosperity, health, and peaceful living in your residence or commercial property.",
      coverage: [
        "Residential floor plan and layout energy assessment",
        "Directional placement (Kitchen, Master Bedroom, Pooja Room, Main Entrance)",
        "Commercial and industrial Vastu consultations for business growth",
        "Non-destructive corrective remedies and energetic balancing"
      ],
      suitableFor: "Homeowners, plot buyers, builders, and business owners looking for harmonious spatial energy.",
      waMessage: "Hello, I would like to enquire about Vastu services consultation."
    }
  ],

  systems: [
    {
      img: "service_horoscope.jpg",
      title: "Vedic Astrology",
      desc: "Ancient wisdom for modern life guidance based on classical Parashari treatises."
    },
    {
      img: "astrologer_portrait.jpg",
      title: "Bhrigu Nandi Nadi",
      desc: "Insights from traditional Nadi knowledge focusing on karmic linkages."
    },
    {
      img: "service_general.jpg",
      title: "KP System",
      desc: "Precise analysis with stellar sub-lords for exact event timing."
    },
    {
      img: "service_muhurtham.jpg",
      title: "Numerology",
      desc: "Understand the sacred power and vibration of numbers in your life."
    }
  ],

  gallery: [
    { img: "homam_fire.jpg", caption: "Sacred Vedic Homam Ritual" },
    { img: "astrologer_portrait.jpg", caption: "Personal Consultation Session" },
    { img: "service_marriage.jpg", caption: "Auspicious Wedding Rites" },
    { img: "service_horoscope.jpg", caption: "Classical Birth Chart Calculations" }
  ]
};

class AstrologyApp {
  constructor() {
    this.data = this.loadData();
    this.initElements();
    this.initSplashScreen();
    this.bindEvents();
    this.renderAll();
  }

  initSplashScreen() {
    const splash = document.getElementById("splashScreen");
    const video = document.getElementById("splashVideo");
    const skipBtn = document.getElementById("splashSkipBtn");

    if (!splash) return;

    let dismissed = false;
    const hideSplash = () => {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.style.display = "none";
      }, 700);
    };

    if (video) {
      video.play().catch(() => {});
      video.addEventListener("ended", hideSplash);
    }

    // 4-second timer (4000ms)
    setTimeout(hideSplash, 4000);

    if (skipBtn) {
      skipBtn.addEventListener("click", hideSplash);
    }
  }

  loadData() {
    // Clear any obsolete localStorage cache so fresh service names and addresses always render
    localStorage.removeItem("shri_gurudatta_site_data");
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  }

  saveData() {
    localStorage.setItem("shri_gurudatta_site_data", JSON.stringify(this.data));
    this.renderAll();
  }

  resetData() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    localStorage.removeItem("shri_gurudatta_site_data");
    this.renderAll();
  }

  initElements() {
    this.servicesCardsContainer = document.getElementById("servicesCardsContainer");
    this.systemsCardsContainer = document.getElementById("systemsCardsContainer");
    this.galleryPhotoGrid = document.getElementById("galleryPhotoGrid");

    this.serviceModal = document.getElementById("serviceModal");
    this.modalBody = document.getElementById("modalBody");
    this.modalCloseBtn = document.getElementById("modalCloseBtn");

    this.menuToggle = document.getElementById("menuToggle");
    this.mobileDrawer = document.getElementById("mobileDrawer");
    this.drawerOverlay = document.getElementById("drawerOverlay");
    this.drawerClose = document.getElementById("drawerClose");
    this.mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    this.contactPhoneDisplay = document.getElementById("contactPhoneDisplay");
    this.contactWaDisplay = document.getElementById("contactWaDisplay");
    this.contactAddress = document.getElementById("contactAddress");
  }

  bindEvents() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () => this.toggleMobileDrawer(true));
    }
    if (this.drawerClose) {
      this.drawerClose.addEventListener("click", () => this.toggleMobileDrawer(false));
    }
    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener("click", () => this.toggleMobileDrawer(false));
    }
    this.mobileNavLinks.forEach(link => {
      link.addEventListener("click", () => this.toggleMobileDrawer(false));
    });

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeServiceModal());
    }
    if (this.serviceModal) {
      this.serviceModal.addEventListener("click", (e) => {
        if (e.target === this.serviceModal) this.closeServiceModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeServiceModal();
        this.toggleMobileDrawer(false);
      }
    });
  }

  generateWaLink(message = "Hello Guruji, I would like to consult regarding astrology guidance.") {
    const rawNumber = this.data.business.whatsappRaw || "919876543210";
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  }

  toggleMobileDrawer(show) {
    if (this.mobileDrawer) {
      this.mobileDrawer.classList.toggle("active", show);
      this.mobileDrawer.setAttribute("aria-hidden", !show);
      document.body.style.overflow = show ? "hidden" : "";
    }
  }

  toggleAdminPanel(show) {
    if (this.adminPanel) {
      if (show) {
        this.adminWaInput.value = this.data.business.whatsappRaw;
        this.adminPhoneInput.value = this.data.business.phoneDisplay;
        this.adminAddressInput.value = this.data.business.address;
      }
      this.adminPanel.classList.toggle("active", show);
      this.adminPanel.setAttribute("aria-hidden", !show);
    }
  }

  renderAll() {
    this.updateContactLinks();
    this.renderServices();
    this.renderSystems();
    this.renderGallery();
  }

  updateContactLinks() {
    const defaultWaUrl = this.generateWaLink();
    const telUrl = `tel:+${this.data.business.phoneRaw}`;

    document.querySelectorAll(".dynamic-wa-link").forEach(el => el.setAttribute("href", defaultWaUrl));
    document.querySelectorAll(".dynamic-call-link").forEach(el => el.setAttribute("href", telUrl));

    if (this.contactPhoneDisplay) {
      this.contactPhoneDisplay.textContent = this.data.business.phoneDisplay;
      this.contactPhoneDisplay.setAttribute("href", telUrl);
    }
    if (this.contactWaDisplay) {
      this.contactWaDisplay.textContent = this.data.business.phoneDisplay;
      this.contactWaDisplay.setAttribute("href", defaultWaUrl);
    }
    if (this.contactAddress) {
      this.contactAddress.innerHTML = this.data.business.address.replace(/\n/g, "<br>");
    }
  }

  renderServices() {
    if (!this.servicesCardsContainer) return;
    this.servicesCardsContainer.innerHTML = "";

    const serviceUrls = {
      "general-prediction": "service-general-prediction.html",
      "horoscope-analysis": "service-horoscope-analysis.html",
      "astro-counselling": "service-astro-counselling.html",
      "muhurtham": "service-muhurtham.html",
      "marriage-matching": "service-marriage-matching.html",
      "baby-naming": "service-baby-naming.html",
      "marriage-counselling": "service-marriage-counselling.html",
      "homam-puja": "service-homam-puja.html",
      "vastu": "service-vastu.html"
    };

    this.data.services.forEach((service, index) => {
      const pageUrl = serviceUrls[service.id] || "services.html";
      const card = document.createElement("a");
      card.href = pageUrl;
      const animClass = index % 2 === 0 ? "anim-slide-right" : "anim-slide-left";
      card.className = `service-tall-card ${animClass}`;

      card.innerHTML = `
        <div class="service-tall-img-wrap">
          <img src="${service.img}" alt="${service.title}" class="service-tall-thumb" loading="lazy">
          <span class="service-number-pill">0${index + 1}</span>
        </div>
        <div class="service-tall-body">
          <h3 class="service-tall-title">${service.title}</h3>
          <p class="service-tall-desc">${service.shortDesc}</p>
          <div class="service-tall-link-row">
            <span>Explore Guidance</span>
            <span>&rarr;</span>
          </div>
        </div>
      `;
      this.servicesCardsContainer.appendChild(card);
    });

    this.initScrollAnimations();
  }

  initScrollAnimations() {
    const animatedCards = document.querySelectorAll(".service-tall-card");
    if (!("IntersectionObserver" in window)) {
      animatedCards.forEach(c => c.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    animatedCards.forEach(card => observer.observe(card));
  }

  renderSystems() {
    if (!this.systemsCardsContainer) return;
    this.systemsCardsContainer.innerHTML = "";

    this.data.systems.forEach(sys => {
      const card = document.createElement("div");
      card.className = "system-grid-card";
      card.innerHTML = `
        <div class="system-grid-img-wrap">
          <img src="${sys.img}" alt="${sys.title}" class="system-grid-img" loading="lazy">
        </div>
        <div class="system-grid-body">
          <h3 class="system-grid-title">${sys.title}</h3>
          <p class="system-grid-desc">${sys.desc}</p>
        </div>
      `;
      this.systemsCardsContainer.appendChild(card);
    });
  }

  renderGallery() {
    // Gallery removed as requested
  }

  openServiceModal(serviceId) {
    const service = this.data.services.find(s => s.id === serviceId);
    if (!service || !this.serviceModal || !this.modalBody) return;

    const specificWaLink = this.generateWaLink(service.waMessage);
    const telUrl = `tel:+${this.data.business.phoneRaw}`;
    const bulletsHtml = service.coverage.map(item => `<li>${item}</li>`).join("");

    this.modalBody.innerHTML = `
      <div class="modal-header-tag">SERVICE DETAILS</div>
      <h2 class="modal-title">${service.title}</h2>
      <p class="modal-lead">${service.explanation}</p>

      <h3 class="modal-section-title">What This Consultation Covers</h3>
      <ul class="modal-bullets">${bulletsHtml}</ul>

      <h3 class="modal-section-title">Who Is This For?</h3>
      <p style="font-size: 0.9rem; margin-bottom: 20px;">${service.suitableFor}</p>

      <div class="modal-action-box">
        <h4>Connect with Shri Gurudatta Astroved</h4>
        <p>Talk directly with Guruji via WhatsApp or direct call with your birth details.</p>
        <div class="modal-cta-buttons">
          <a href="${specificWaLink}" class="btn-gold-pill" target="_blank" rel="noopener noreferrer">
            <svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.4 1.25-1.94 1.33-.51.08-1.18.11-3.41-.81-2.85-1.18-4.69-4.08-4.83-4.27-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.53-.35.71-.35.18 0 .36 0 .52.01.17.01.4.06.61.56.24.58.82 2 .89 2.15.07.15.11.33.02.52-.09.19-.14.31-.28.48-.14.17-.3.38-.43.51-.14.14-.29.3-.12.59.17.29.74 1.22 1.6 1.98 1.1 0.98 2.03 1.28 2.32 1.42.29.14.46.12.63-.07.17-.19.74-.86.94-1.16.2-.29.4-.24.67-.14.28.1 1.76.83 2.06.98.3.15.5.22.57.34.07.13.07.74-.17 1.42z"/>
            </svg>
            <span>Talk About This Service on WhatsApp</span>
          </a>
          <a href="${telUrl}" class="btn-outline-pill">
            <span>Call Now</span>
          </a>
        </div>
      </div>
    `;

    this.serviceModal.classList.add("active");
    this.serviceModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  closeServiceModal() {
    if (this.serviceModal) {
      this.serviceModal.classList.remove("active");
      this.serviceModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }
}

let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AstrologyApp();
  window.app = app;
});
