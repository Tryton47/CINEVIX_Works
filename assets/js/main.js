/**
 * CINEVIX Works — main.js v3.2
 * Clean, fast, and rock-solid interactive logic
 */

/* ============================================================
   PAGE LOADER (Fast fadeout, no delay freeze)
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  const hide = () => loader.classList.add("hidden");
  if (document.readyState === "complete") {
    setTimeout(hide, 200);
  } else {
    window.addEventListener("load", () => setTimeout(hide, 200));
  }
})();

/* ============================================================
   HEADER: Scroll Effect
   ============================================================ */
(function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const progress = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const btn  = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-nav");
  if (!btn || !menu) return;

  function setMenuState(open) {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    const icon = btn.querySelector("i");
    if (icon) icon.className = open ? "fas fa-times" : "fas fa-bars";
  }

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    setMenuState(!isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target) && menu.classList.contains("open")) {
      setMenuState(false);
    }
  });

  window.closeMobileNav = () => setMenuState(false);
})();

/* ============================================================
   PAGE ROUTER (SPA)
   ============================================================ */
const PageRouter = (function () {
  const pages    = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link[data-page]");
  let current    = "home";

  function showPage(pageId) {
    if (pageId === current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    current = pageId;

    pages.forEach(p => {
      p.classList.remove("active");
    });

    const target = document.getElementById(pageId);
    if (!target) return;
    target.classList.add("active");

    navLinks.forEach(l => {
      l.classList.toggle("active", l.dataset.page === pageId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile menu if open
    if (window.closeMobileNav) window.closeMobileNav();
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link.dataset.page;
      if (pageId) showPage(pageId);
    });
  });

  return { showPage };
})();

window.showPage = (id) => PageRouter.showPage(id);

// Navigate to contact section
window.goContact = function () {
  PageRouter.showPage("home");
  setTimeout(() => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

/* ============================================================
   AOS (Scroll Reveal)
   ============================================================ */
(function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 650,
    once: true,
    offset: 50,
    easing: "ease-out-cubic",
  });
})();

/* ============================================================
   SWIPER — PORTFOLIO
   ============================================================ */
(function initPortfolioSwiper() {
  if (typeof Swiper === "undefined") return;
  new Swiper(".portfolio-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 28,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      scale: 0.9,
      slideShadows: false,
    },
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".portfolio-swiper .swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".portfolio-swiper .swiper-button-next",
      prevEl: ".portfolio-swiper .swiper-button-prev",
    },
  });
})();

/* ============================================================
   SWIPER — TEAM
   ============================================================ */
(function initTeamSwiper() {
  if (typeof Swiper === "undefined") return;
  new Swiper(".team-swiper", {
    grabCursor: true,
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".team-swiper .swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".team-swiper .swiper-button-next",
      prevEl: ".team-swiper .swiper-button-prev",
    },
    breakpoints: {
      600:  { slidesPerView: 2, spaceBetween: 20 },
      900:  { slidesPerView: 3, spaceBetween: 24 },
      1200: { slidesPerView: 4, spaceBetween: 24 },
    },
  });
})();

/* ============================================================
   WORKS FILTER
   ============================================================ */
(function initWorkFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards  = document.querySelectorAll(".work-card");
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      workCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
})();

/* ============================================================
   VIDEO MODAL
   ============================================================ */
(function initVideoModal() {
  const modal    = document.getElementById("video-modal");
  const iframe   = document.getElementById("modal-iframe");
  const closeBtn = document.getElementById("close-modal-btn");
  const backdrop = modal?.querySelector(".modal-backdrop");
  if (!modal) return;

  window.openModal = function (url) {
    if (!url) return;
    iframe.src = url + (url.includes("?") ? "&" : "?") + "autoplay=1&rel=0";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    iframe.src = "";
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
})();

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 350);
  }, { passive: true });
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ============================================================
   HERO STATS COUNTER
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let start    = 0;
      const inc    = target / 60;
      const timer  = setInterval(() => {
        start = Math.min(start + inc, target);
        el.textContent = Math.floor(start) + suffix;
        if (start >= target) clearInterval(timer);
      }, 20);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => obs.observe(c));
})();

/* ============================================================
   CONTACT FORM → WhatsApp
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name    = form.querySelector("[name='name']")?.value || "";
    const email   = form.querySelector("[name='email']")?.value || "";
    const subject = form.querySelector("[name='subject']")?.value || "";
    const message = form.querySelector("[name='message']")?.value || "";

    const text = encodeURIComponent(
      `Halo CINEVIX! 🎬\n\nNama: ${name}\nEmail: ${email}\nJenis Proyek: ${subject}\n\nDetail:\n${message}`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  });
})();
