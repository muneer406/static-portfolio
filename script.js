document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-navigation");
  const navLinks = navList ? navList.querySelectorAll("a") : [];
  const yearSpan = document.querySelector("[data-year]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const introOverlay = document.querySelector(".intro-overlay");
  const introName = introOverlay?.querySelector(".intro-name");
  const brandName = document.querySelector(".brand-name");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (navToggle && header) {
    const toggleNav = () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };

    navToggle.addEventListener("click", toggleNav);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (header.classList.contains("nav-open")) {
          header.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  if (introOverlay && introName && brandName) {
    const highlightBrand = () => {
      brandName.classList.add("brand-highlight");
      setTimeout(() => brandName.classList.remove("brand-highlight"), 1600);
    };

    const removeOverlay = () => {
      introOverlay.classList.add("intro-hidden");
      setTimeout(() => {
        introOverlay.remove();
      }, 360);
    };

    if (
      prefersReducedMotion ||
      typeof introName.animate !== "function" ||
      typeof introOverlay.animate !== "function"
    ) {
      highlightBrand();
      removeOverlay();
    } else {
      const playIntro = () => {
        const brandRect = brandName.getBoundingClientRect();
        const introRect = introName.getBoundingClientRect();

        const translateX =
          brandRect.left + brandRect.width / 2 - window.innerWidth / 2;
        const translateY =
          brandRect.top + brandRect.height / 2 - window.innerHeight / 2;

        const scaleWidth = brandRect.width / introRect.width || 0.25;
        const scaleHeight = brandRect.height / introRect.height || 0.25;
        const scale = Math.max(Math.min(scaleWidth, scaleHeight) * 0.92, 0.28);

        const endTransform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;

        const nameAnimation = introName.animate(
          [
            {
              transform: "translate(-50%, -50%) scale(1)",
              opacity: 1,
            },
            {
              transform: endTransform,
              opacity: 1,
            },
          ],
          {
            duration: 1700,
            easing: "cubic-bezier(0.83, 0, 0.17, 1)",
            fill: "forwards",
          }
        );

        introOverlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 420,
          delay: 1200,
          easing: "ease-out",
          fill: "forwards",
        });

        nameAnimation.onfinish = () => {
          highlightBrand();
          removeOverlay();
        };
      };

      window.requestAnimationFrame(() => {
        setTimeout(playIntro, 120);
      });
    }
  }

  const scrollItems = document.querySelectorAll("[data-scroll]");
  if (scrollItems.length) {
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.dataset.scroll = "revealed";
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      scrollItems.forEach((item) => {
        item.dataset.scroll = "hidden";
        observer.observe(item);
      });
    } else {
      scrollItems.forEach((item) => {
        item.dataset.scroll = "revealed";
      });
    }
  }

  const heroButton = document.querySelector(".hero-actions .btn.cta");
  if (heroButton) {
    heroButton.addEventListener("mouseenter", () => {
      heroButton.style.transform = "translateY(-6px) rotate(-1.8deg)";
    });
    heroButton.addEventListener("mouseleave", () => {
      heroButton.style.transform = "";
    });
    heroButton.addEventListener("focus", () => {
      heroButton.style.transform = "translateY(-6px) rotate(-1.8deg)";
    });
    heroButton.addEventListener("blur", () => {
      heroButton.style.transform = "";
    });
  }

  const lifeClock = document.querySelector("[data-life-clock]");
  if (lifeClock) {
    const origin = new Date("2006-01-28T00:00:00");

    const updateLifeClock = () => {
      const now = new Date();
      const diffMs = now.getTime() - origin.getTime();
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const minutes = totalMinutes % 60;
      const totalHours = Math.floor(totalMinutes / 60);
      const hours = totalHours % 24;
      const days = Math.floor(totalHours / 24);

      const formatted = `${days.toLocaleString()} days ${hours} hours ${minutes} minutes`;
      lifeClock.textContent = formatted;
    };

    updateLifeClock();
    setInterval(updateLifeClock, 60 * 1000);
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      const subjectBase = name
        ? `Hello from ${name}`
        : "Hello from your portfolio";
      const subject = encodeURIComponent(subjectBase);

      const bodyLines = [
        message || "Hi Muneer,",
        "",
        name ? `— ${name}` : "",
        email ? `Email: ${email}` : "",
      ].filter(Boolean);

      const body = encodeURIComponent(bodyLines.join("\n"));
      const mailto = `mailto:muneer.alam320@gmail.com?subject=${subject}&body=${body}`;

      window.open(mailto, "_blank", "noopener,noreferrer");
    });
  }
});
