/* ------------------------------------------------------------------
   Progressive enhancements
   The page is fully usable without this file. Everything here adds
   polish: active-section nav, scroll reveal, copy-to-clipboard,
   live local time and dynamic year.
   ------------------------------------------------------------------ */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header border once the page has scrolled ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Highlight the nav item for the section in view ---------- */
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => setCurrent(entry.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Reveal elements as they enter the viewport ---------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    revealTargets.forEach((el, index) => {
      // Stagger siblings inside a group, e.g. work cards or skills
      const group = el.closest("[data-reveal-group]");
      if (group) {
        const position = Array.from(group.querySelectorAll("[data-reveal]")).indexOf(el);
        el.style.setProperty("--reveal-delay", `${Math.min(position, 5) * 80}ms`);
      }
      revealObserver.observe(el);
    });
  }

  /* ---------- Copy email to clipboard ---------- */
  const copyButton = document.querySelector("[data-copy]");
  const toast = document.querySelector(".toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  if (copyButton && navigator.clipboard) {
    copyButton.addEventListener("click", async () => {
      const value = copyButton.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        copyButton.classList.add("is-copied");
        copyButton.setAttribute("aria-label", "Email copied");
        showToast("Email copied to clipboard");
        window.setTimeout(() => {
          copyButton.classList.remove("is-copied");
          copyButton.setAttribute("aria-label", "Copy email address");
        }, 2200);
      } catch (error) {
        showToast("Couldn't copy — please select the address");
      }
    });
  } else if (copyButton) {
    copyButton.hidden = true;
  }

  /* ---------- Local time in the footer ---------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const timeZone = clock.getAttribute("data-clock") || undefined;
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => {
      clock.textContent = formatter.format(new Date());
    };
    tick();
    window.setInterval(tick, 30_000);
  }

  /* ---------- Current year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Back to top respects motion preferences ---------- */
  const backToTop = document.querySelector("[data-back-to-top]");
  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      document.querySelector(".brand")?.focus({ preventScroll: true });
    });
  }
})();
