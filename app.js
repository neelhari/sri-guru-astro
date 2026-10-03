/**
 * Shri Gurudatta Astroved - Dynamic Application Engine
 * Renders the exact visual cards, systems, products, and handles WhatsApp deep-links and modal drawers.
 * Dynamically synchronized with site_data.json and Admin Panel.
 */

const DEFAULT_SITE_DATA = {
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

  services: [
    {
      id: "general-prediction",
      img: "service_general.jpg",
      images: ["service_general.jpg", "service_horoscope.jpg"],
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
      pageUrl: "service-general-prediction.html",
      waMessage: "Hello Guruji, I would like to know more about General Prediction guidance."
    },
    {
      id: "horoscope-analysis",
      img: "service_horoscope.jpg",
      images: ["service_horoscope.jpg", "service_general.jpg"],
      title: "Complete Horoscope Analysis",
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
      pageUrl: "service-horoscope-analysis.html",
      waMessage: "Hello Guruji, I would like to know more about Complete Horoscope Analysis."
    },
    {
      id: "astro-counselling",
      img: "service_general.jpg",
      images: ["service_general.jpg", "service_marriage.jpg"],
      title: "Astro Counselling",
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
      pageUrl: "service-astro-counselling.html",
      waMessage: "Hello Guruji, I would like to seek Astro Counselling for personal guidance."
    },
    {
      id: "muhurtham",
      img: "service_muhurtham.jpg",
      images: ["service_muhurtham.jpg", "service_marriage.jpg"],
      title: "Auspicious Muhurtham",
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
      pageUrl: "service-muhurtham.html",
      waMessage: "Hello Guruji, I need assistance in finding an Auspicious Muhurtham."
    },
    {
      id: "marriage-matching",
      img: "service_marriage.jpg",
      images: ["service_marriage.jpg", "service_muhurtham.jpg"],
      title: "Marriage Matching",
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
      pageUrl: "service-marriage-matching.html",
      waMessage: "Hello Guruji, I would like to know more about Marriage Matching consultation."
    },
    {
      id: "baby-naming",
      img: "service_muhurtham.jpg",
      images: ["service_muhurtham.jpg", "service_general.jpg"],
      title: "Names for New Born Baby",
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
      pageUrl: "service-baby-naming.html",
      waMessage: "Hello Guruji, I would like guidance for Names for New Born Baby."
    },
    {
      id: "marriage-counselling",
      img: "service_marriage.jpg",
      images: ["service_marriage.jpg", "service_general.jpg"],
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
      pageUrl: "service-marriage-counselling.html",
      waMessage: "Hello Guruji, I would like to consult regarding Marriage Counselling."
    },
    {
      id: "homam-puja",
      img: "homam_fire.jpg",
      images: ["homam_fire.jpg"],
      title: "Homam / Japam / Puja Services",
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
      pageUrl: "service-homam-puja.html",
      waMessage: "Hello Guruji, I would like to enquire about Homam / Japam / Puja Services."
    },
    {
      id: "vastu",
      img: "service_horoscope.jpg",
      images: ["service_horoscope.jpg"],
      title: "Vastu Services",
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
      pageUrl: "service-vastu.html",
      waMessage: "Hello Guruji, I would like to enquire about Vastu Services consultation."
    }
  ],

  products: [
    {
      id: "yantras-pendants",
      img: "product_yantra.jpg",
      images: ["product_yantra.jpg", "product_yantra_closeup.jpg"],
      title: "Yantras & Mantra-Energized Pendant",
      shortDesc: "Sacred geometric energy plates & wearable golden kavach for wealth, health, and negative energy shield.",
      specs: "Authentic sacred geometric energy plates & wearable golden kavach consecrated through traditional Vedic Prana Pratishtha. Consecrated with 108 Shastric Beeja Mantras to shield against negative energies, promote financial growth, and bestow family harmony.",
      pageUrl: "product-yantras-pendants.html",
      waMessage: "Hello Guruji, I would like to enquire about Yantras & Mantra-Energized Pendants."
    },
    {
      id: "energized-malas",
      img: "product_mala.jpg",
      images: ["product_mala.jpg", "product_mala_closeup.jpg"],
      title: "Mantra-Energized Malalu",
      shortDesc: "108-bead consecrated Nepali Rudraksha & clear Spatik malas energized for japa, peace, and spiritual power.",
      specs: "108-bead consecrated Nepali Rudraksha & clear Spatik malas energized for daily japa, inner tranquility, and spiritual focus. Each bead is cleansed and energized with specific Beeja Mantras by Guruji.",
      pageUrl: "product-energized-malas.html",
      waMessage: "Hello Guruji, I would like to enquire about Mantra-Energized Malalu."
    },
    {
      id: "pasupata-kankanam",
      img: "product_kankanam.jpg",
      images: ["product_kankanam.jpg", "product_kankanam_closeup.jpg"],
      title: "Pasupata Kankanalu",
      shortDesc: "Sacred consecrated copper-silver wristband infused with Pasupata Astra mantra for unassailable protection.",
      specs: "Sacred consecrated copper-silver wristband infused with the powerful Pasupata Astra mantra for unassailable protection, dispelling fear, negative influences, and evil eye. Handcrafted in pure copper and sacred metals.",
      pageUrl: "product-pasupata-kankanam.html",
      waMessage: "Hello Guruji, I would like to enquire about Pasupata Kankanalu Protection Bangle."
    },
    {
      id: "customized-remedy-kits",
      img: "product_remedy_kit.jpg",
      images: ["product_remedy_kit.jpg", "product_remedy_kit_closeup.jpg"],
      title: "Customized Remedy Kits",
      shortDesc: "Individualized planetary pacification puja box tailored to your horoscope for career, marriage, and health obstacles.",
      specs: "Individualized planetary pacification puja box tailored directly to your horoscope for overcoming obstacles in career, marriage delays, and health issues. Includes consecrated planetary yantras, dhoop, and custom herbs.",
      pageUrl: "product-customized-remedy-kits.html",
      waMessage: "Hello Guruji, I would like to enquire about Customized Remedy Kits."
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

  banners: [
    {
      id: "banner-1",
      title: "Shri GuruDatta Consultation",
      buttonText: "Book Consultation",
      img: "astrologer_portrait.jpg",
      waMessage: "Hello Guruji, I would like to book a Shri GuruDatta Consultation."
    },
    {
      id: "banner-2",
      title: "Vedic & Nadi Consultation",
      buttonText: "Take Consultation",
      img: "service_horoscope.jpg",
      waMessage: "Hello Guruji, I would like to take Vedic & Nadi Consultation."
    }
  ]
};

class AstrologyApp {
  constructor() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    this.initElements();
    this.initSplashScreen();
    this.bindEvents();
    
    // Load fresh data from API / LocalStorage then render
    this.initDataAndRender();
  }

  async initDataAndRender() {
    // 1. Try local storage cache
    const cached = localStorage.getItem("shri_gurudatta_site_data");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.business) this.data = parsed;
      } catch (e) {}
    }

    // 2. Fetch live data from /api/data, Supabase Storage, or site_data.json
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const liveData = await res.json();
        if (liveData && liveData.business) {
          this.data = liveData;
          localStorage.setItem("shri_gurudatta_site_data", JSON.stringify(liveData));
        }
      } else {
        throw new Error("Local API unavailable");
      }
    } catch (e) {
      try {
        // Direct Supabase Storage CDN fetch
        const resSupa = await fetch("https://vbfdimlkbilkdakjbfjg.supabase.co/storage/v1/object/public/site_data/site_data.json");
        if (resSupa.ok) {
          const liveData = await resSupa.json();
          if (liveData && liveData.business) {
            this.data = liveData;
            localStorage.setItem("shri_gurudatta_site_data", JSON.stringify(liveData));
          }
        } else {
          throw new Error("Supabase storage error");
        }
      } catch (errSupa) {
        try {
          const resFallback = await fetch("site_data.json");
          if (resFallback.ok) {
            const liveData = await resFallback.json();
            if (liveData && liveData.business) {
              this.data = liveData;
              localStorage.setItem("shri_gurudatta_site_data", JSON.stringify(liveData));
            }
          }
        } catch (err) {}
      }
    }

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

  initElements() {
    this.servicesCardsContainer = document.getElementById("servicesCardsContainer");
    this.servicesHubGrid = document.getElementById("servicesHubGrid");
    this.systemsCardsContainer = document.getElementById("systemsCardsContainer");
    this.productsDirectGrids = document.querySelectorAll(".products-direct-grid");

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

    // Consultation Booking Modal Events
    const closeBookingBtn = document.getElementById("btnCloseBookingModal");
    if (closeBookingBtn) {
      closeBookingBtn.addEventListener("click", () => this.closeBookingModal());
    }
    const bookingOverlay = document.getElementById("bookingModalOverlay");
    if (bookingOverlay) {
      bookingOverlay.addEventListener("click", (e) => {
        if (e.target === bookingOverlay) this.closeBookingModal();
      });
    }

    // Modal Booking Form Submission
    const btnSubmitModal = document.getElementById("btnSubmitModalBooking");
    if (btnSubmitModal) {
      btnSubmitModal.addEventListener("click", () => {
        const name = document.getElementById("modalBookingName")?.value.trim() || "";
        const phone = document.getElementById("modalBookingPhone")?.value.trim() || "";
        const email = document.getElementById("modalBookingEmail")?.value.trim() || "";
        const service = document.getElementById("modalBookingService")?.value || "";
        const message = document.getElementById("modalBookingMessage")?.value.trim() || "";
        this.handleBookingSubmission(name, phone, email, service, message);
      });
    }

    // Inline Booking Form Submission (Homepage below Personal Guidance)
    const btnSubmitInline = document.getElementById("btnSubmitInlineBooking");
    if (btnSubmitInline) {
      btnSubmitInline.addEventListener("click", () => {
        const name = document.getElementById("inlineBookingName")?.value.trim() || "";
        const phone = document.getElementById("inlineBookingPhone")?.value.trim() || "";
        const email = document.getElementById("inlineBookingEmail")?.value.trim() || "";
        const service = document.getElementById("inlineBookingService")?.value || "";
        const message = document.getElementById("inlineBookingMessage")?.value.trim() || "";
        this.handleBookingSubmission(name, phone, email, service, message);
      });
    }

    // Contact Page Booking Form Submission
    const btnSubmitContact = document.getElementById("btnSubmitContactBooking");
    if (btnSubmitContact) {
      btnSubmitContact.addEventListener("click", () => {
        const name = document.getElementById("contactBookingName")?.value.trim() || "";
        const phone = document.getElementById("contactBookingPhone")?.value.trim() || "";
        const email = document.getElementById("contactBookingEmail")?.value.trim() || "";
        const service = document.getElementById("contactBookingService")?.value || "";
        const message = document.getElementById("contactBookingMessage")?.value.trim() || "";
        this.handleBookingSubmission(name, phone, email, service, message);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeServiceModal();
        this.closeBookingModal();
        this.toggleMobileDrawer(false);
      }
    });
  }

  openBookingModal(preselectedService = "") {
    const modal = document.getElementById("bookingModalOverlay");
    if (!modal) return;

    if (preselectedService) {
      const select = document.getElementById("modalBookingService");
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(preselectedService.toLowerCase()) ||
              preselectedService.toLowerCase().includes(select.options[i].text.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeBookingModal() {
    const modal = document.getElementById("bookingModalOverlay");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  handleBookingSubmission(name, phone, email, service, message) {
    if (!name || !phone) {
      alert("Please provide both your Name and Phone Number.");
      return;
    }

    // 1. Post lead directly to Supabase Cloud Database Table
    try {
      fetch("https://vbfdimlkbilkdakjbfjg.supabase.co/rest/v1/consultation_bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "sb_publishable_WbNQPT0IvbNpeYqCDrU_SA_BPKbvUrL",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ name, phone, email, service, message })
      }).catch(err => console.warn("Supabase lead direct error:", err));
    } catch (e) {}

    // 2. Also post to local /api/bookings
    try {
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, service, message })
      }).catch(e => console.warn("Booking API record notice:", e));
    } catch (e) {}

    // 2. Open WhatsApp directly with formatted message to Guruji
    const rawNumber = (this.data && this.data.business && this.data.business.whatsappRaw) || "9063862498";
    const cleanNum = rawNumber.replace(/^91/, '');

    const waText = 
`*New Consultation Booking Request*
👤 *Name:* ${name}
📞 *Phone:* ${phone}
🔮 *Service:* ${service || 'Astrology Consultation'}
${email ? `📧 *Email:* ${email}\n` : ''}${message ? `📝 *Query/Birth Details:* ${message}\n` : ''}
Hello Guruji, I have submitted my consultation booking details above. Please confirm my appointment timing.`;

    const waUrl = `https://wa.me/91${cleanNum}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");

    this.closeBookingModal();
  }

  toggleMobileDrawer(open) {
    if (!this.mobileDrawer) return;
    if (open) {
      this.mobileDrawer.classList.add("active");
      this.mobileDrawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      this.mobileDrawer.classList.remove("active");
      this.mobileDrawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  generateWaLink(customMessage) {
    const rawNumber = this.data.business.whatsappRaw || "9063862498";
    const cleanNum = rawNumber.replace(/^91/, '');
    const defaultMsg = "Hello Guruji, I would like to consult regarding astrology guidance.";
    const text = encodeURIComponent(customMessage || defaultMsg);
    return `https://wa.me/91${cleanNum}?text=${text}`;
  }

  renderAll() {
    this.updateGlobalContactInfo();
    this.renderBanners();
    this.renderServices();
    this.renderServicesHub();
    this.renderProducts();
    this.renderSystems();
  }

  renderBanners() {
    const container = document.getElementById("featuredBannersGrid");
    if (!container) return;

    const banners = this.data.banners || DEFAULT_SITE_DATA.banners || [];
    if (banners.length === 0) return;

    container.innerHTML = "";
    banners.forEach(b => {
      const card = document.createElement("div");
      card.className = "consult-banner-card";

      const escapedTitle = (b.title || "Consultation").replace(/'/g, "\\'");

      card.innerHTML = `
        <img src="${b.img || 'astrologer_portrait.jpg'}" alt="${b.title}" class="consult-banner-img" loading="lazy" onerror="this.src='astrologer_portrait.jpg'">
        <div class="consult-banner-center-content">
          <h3 class="consult-banner-title">${b.title}</h3>
          <button type="button" class="btn-banner-white" onclick="app.openBookingModal('${escapedTitle}')">
            ${b.buttonText || "Book Consultation"}
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  updateGlobalContactInfo() {
    const b = this.data.business || {};
    const defaultWa = this.generateWaLink();
    const cleanPhone = (b.phoneRaw || "917675966942").replace(/^91/, '');
    const telUrl = `tel:+91${cleanPhone}`;

    // Update all dynamic WhatsApp links
    document.querySelectorAll(".dynamic-wa-link").forEach(link => {
      // Retain custom prefilled message if already present in href, else apply live default
      const currentHref = link.getAttribute("href");
      if (currentHref && currentHref.includes("text=")) {
        const textParam = currentHref.split("text=")[1];
        link.href = `https://wa.me/91${(b.whatsappRaw || "9063862498").replace(/^91/, '')}?text=${textParam}`;
      } else {
        link.href = defaultWa;
      }
    });

    // Update all dynamic Call links
    document.querySelectorAll(".dynamic-call-link").forEach(link => {
      link.href = telUrl;
    });

    if (this.contactPhoneDisplay) {
      this.contactPhoneDisplay.textContent = b.phoneDisplay || "+91 90638 62498 / +91 76759 66942";
    }
    if (this.contactWaDisplay) {
      this.contactWaDisplay.textContent = "+91 " + (b.whatsappRaw || "9063862498");
      this.contactWaDisplay.href = defaultWa;
    }
    if (this.contactAddress && b.address) {
      this.contactAddress.innerHTML = b.address.replace(/\n/g, "<br>");
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

    // Display exactly 6 service cards on the homepage, followed by See More Services
    const homeServices = (this.data.services || []).slice(0, 6);

    homeServices.forEach((service, index) => {
      const pageUrl = (service.pageUrl && service.pageUrl !== "services.html") ? service.pageUrl : (serviceUrls[service.id] || `service.html?id=${service.id}`);
      const card = document.createElement("a");
      card.href = pageUrl;
      const animClass = index % 2 === 0 ? "anim-slide-right" : "anim-slide-left";
      card.className = `service-tall-card ${animClass}`;

      const coverImg = (service.images && service.images.length > 0) ? service.images[0] : (service.img || "service_general.jpg");

      card.innerHTML = `
        <div class="service-tall-img-wrap">
          <img src="${coverImg}" alt="${service.title}" class="service-tall-thumb" loading="lazy" onerror="this.src='service_general.jpg'">
          <span class="service-number-pill">0${index + 1}</span>
        </div>
        <div class="service-tall-body">
          <h3 class="service-tall-title">${service.title}</h3>
          <p class="service-tall-desc">${service.shortDesc || ""}</p>
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

  renderServicesHub() {
    if (!this.servicesHubGrid) return;
    this.servicesHubGrid.innerHTML = "";

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

    const services = this.data.services || [];
    services.forEach(service => {
      const pageUrl = (service.pageUrl && service.pageUrl !== "services.html") ? service.pageUrl : (serviceUrls[service.id] || `service.html?id=${service.id}`);
      const coverImg = (service.images && service.images.length > 0) ? service.images[0] : (service.img || "service_general.jpg");

      const card = document.createElement("div");
      card.className = "service-hub-card";
      card.innerHTML = `
        <div class="hub-card-img-wrap">
          <img src="${coverImg}" alt="${service.title}" class="hub-card-img" loading="lazy" onerror="this.src='service_general.jpg'">
          <span class="hub-badge">🌟 Guidance</span>
        </div>
        <div class="hub-card-body">
          <h3 class="hub-card-title">${service.title}</h3>
          <p class="hub-card-desc">${service.shortDesc || ""}</p>
          <div class="hub-card-footer">
            <a href="${pageUrl}" class="btn-hub-view">View Details &rarr;</a>
          </div>
        </div>
      `;
      this.servicesHubGrid.appendChild(card);
    });
  }

  renderProducts() {
    const grids = document.querySelectorAll(".products-direct-grid");
    if (!grids || grids.length === 0) return;

    const products = this.data.products || [];
    if (products.length === 0) return;

    grids.forEach(grid => {
      grid.innerHTML = "";
      products.forEach(prod => {
        const card = document.createElement("a");
        // Link to dedicated product.html?id=... (or static product file if preferred)
        card.href = `product.html?id=${prod.id}`;
        card.className = "product-direct-card";
        card.setAttribute("aria-label", prod.title);

        const coverImg = (prod.images && prod.images.length > 0) ? prod.images[0] : (prod.img || "product_yantra.jpg");

        card.innerHTML = `
          <div class="product-direct-img-wrap">
            <img src="${coverImg}" alt="${prod.title}" class="product-direct-thumb" loading="lazy" onerror="this.src='product_yantra.jpg'">
          </div>
          <div class="product-direct-info">
            <span class="product-direct-name">${prod.title}</span>
            <span class="product-direct-arrow" aria-hidden="true">&rarr;</span>
          </div>
        `;
        grid.appendChild(card);
      });
    });
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

    const systems = this.data.systems || DEFAULT_SITE_DATA.systems;
    systems.forEach(sys => {
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

  openServiceModal(serviceId) {
    const service = (this.data.services || []).find(s => s.id === serviceId);
    if (!service || !this.serviceModal || !this.modalBody) return;

    const specificWaLink = this.generateWaLink(service.waMessage);
    const telUrl = `tel:+${this.data.business.phoneRaw || '917675966942'}`;
    const bulletsHtml = (service.coverage || []).map(item => `<li>${item}</li>`).join("");

    this.modalBody.innerHTML = `
      <div class="modal-header-tag">SERVICE DETAILS</div>
      <h2 class="modal-title">${service.title}</h2>
      <p class="modal-lead">${service.explanation || service.shortDesc || ''}</p>

      ${bulletsHtml ? `
        <h3 class="modal-section-title">What This Consultation Covers</h3>
        <ul class="modal-bullets">${bulletsHtml}</ul>
      ` : ''}

      ${service.suitableFor ? `
        <h3 class="modal-section-title">Who Is This For?</h3>
        <p style="font-size: 0.9rem; margin-bottom: 20px;">${service.suitableFor}</p>
      ` : ''}

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
