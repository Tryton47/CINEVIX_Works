/**
 * CINEVIX Works — main.js
 * Interactive features: loader, page transitions, swipers, modals, animations
 */

/* ============================================================
   PAGE LOADER
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 1800);
  });
})();

/* ============================================================
   SCROLL PROGRESS BAR & REVEAL OBSERVER
   ============================================================ */
(function initScrollProgressAndReveals() {
  const progress = document.getElementById("scroll-progress");
  
  function updateScroll() {
    if (progress) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progress.style.width = scrolled + "%";
    }
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  // Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll(".reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale");
  if (revealElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Optionally unobserve if only reveal once:
          // observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach((el) => observer.observe(el));
  }
})();

/* ============================================================
   HEADER — SCROLL EFFECT
   ============================================================ */
(function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const btn  = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-nav");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    btn.querySelector("i").className = isOpen ? "fas fa-times" : "fas fa-bars";
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("open");
      btn.querySelector("i").className = "fas fa-bars";
    }
  });
})();

/* ============================================================
   PAGE NAVIGATION (SPA-style with transitions)
   ============================================================ */
const PageRouter = (function () {
  const pages    = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  let current    = "home";

  function showPage(pageId) {
    if (pageId === current) return;
    current = pageId;

    pages.forEach(p => {
      p.classList.remove("active", "page-enter");
    });

    const target = document.getElementById(pageId);
    if (!target) return;

    target.classList.add("active");
    // Trigger reflow then add enter animation
    void target.offsetWidth;
    target.classList.add("page-enter");

    navLinks.forEach(l => {
      l.classList.toggle("active", l.dataset.page === pageId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile menu
    const mobileNav = document.getElementById("mobile-nav");
    const mobileBtn = document.getElementById("mobile-menu-btn");
    if (mobileNav) mobileNav.classList.remove("open");
    if (mobileBtn) mobileBtn.querySelector("i").className = "fas fa-bars";
  }

  // Attach to all nav-link elements
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link.dataset.page;
      if (pageId) showPage(pageId);
    });
  });

  return { showPage };
})();

// Make globally accessible (for onclick in HTML)
window.showPage = PageRouter.showPage.bind(PageRouter);

/* ============================================================
   AOS INIT
   ============================================================ */
(function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });
  }
})();

/* ============================================================
   SWIPER — PORTFOLIO (Coverflow)
   ============================================================ */
(function initPortfolioSwiper() {
  if (typeof Swiper === "undefined") return;
  new Swiper(".portfolio-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 120,
      modifier: 1.2,
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
    on: {
      slideChangeTransitionStart() {
        // Slide entrance animation
        const active = this.slides[this.activeIndex];
        if (!active) return;
        active.style.animation = "none";
        void active.offsetWidth;
        active.style.animation = "slideEntrance 0.5s cubic-bezier(0.4,0,0.2,1) forwards";
      }
    }
  });
})();

/* ============================================================
   SWIPER — TEAM (Cards)
   ============================================================ */
(function initTeamSwiper() {
  if (typeof Swiper === "undefined") return;
  new Swiper(".team-swiper", {
    effect: "cards",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
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
      640:  { slidesPerView: 2, effect: "slide", spaceBetween: 20 },
      1024: { slidesPerView: 3, effect: "slide", spaceBetween: 28 },
    }
  });
})();

/* ============================================================
   WORK FILTER
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
      workCards.forEach((card, i) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.transition = `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms`;
        if (match) {
          card.style.display = "";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => {
            if (card.style.opacity === "0") card.style.display = "none";
          }, 350);
        }
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

  // Auto-bind data-video-url cards
  document.querySelectorAll("[data-video-url]").forEach(el => {
    el.addEventListener("click", () => {
      const url = el.dataset.videoUrl;
      if (url) window.openModal(url);
    });
  });
})();

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 320);
  }, { passive: true });
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ============================================================
   STATS COUNTER ANIMATION (hero)
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
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      const timer  = setInterval(() => {
        start = Math.min(start + inc, target);
        el.textContent = Math.floor(start) + suffix;
        if (start >= target) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

/* ============================================================
   CARD MOUSE SHINE & SPOTLIGHT EFFECT
   ============================================================ */
(function initCardSpotlight() {
  const cards = document.querySelectorAll(".glass-panel, .portfolio-card, .team-card, .work-card, .about-card, .contact-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
})();

/* ============================================================
   CONTACT FORM (WhatsApp redirect example)
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
      `Halo CINEVIX!\nNama: ${name}\nEmail: ${email}\nSubjek: ${subject}\n\n${message}`
    );
    window.open(`https://wa.me/6221123456?text=${text}`, "_blank");
  });
})();
