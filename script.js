// ========================================
// feelya — B2B Landing Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky nav scroll effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('nav__links--open');
      hamburger.classList.toggle('nav__hamburger--open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav__links--open');
        hamburger.classList.remove('nav__hamburger--open');
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll-triggered animations ---
  const animateElements = document.querySelectorAll(
    '.step, .feature-card, .pricing-card, .testimonial-card, .resource-card, .impact__stat, .platform__content, .platform__preview, .final-cta__content, .final-cta__form-wrap'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i % 3 * 0.1}s, transform 0.6s ease ${i % 3 * 0.1}s`;
    observer.observe(el);
  });

  // Add animate-in styles
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // --- Demo form submission ---
  const demoForm = document.getElementById('demoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = demoForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = 'Submitting...';
      btn.disabled = true;

      // Simulate submission
      setTimeout(() => {
        demoForm.innerHTML = `
          <div style="text-align:center;padding:24px 0;">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin:0 auto 16px;">
              <circle cx="24" cy="24" r="22" stroke="#10b981" stroke-width="3"/>
              <path d="M15 24l6 6 12-12" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 style="color:#fff;font-family:var(--font-serif,Georgia,serif);font-size:22px;margin-bottom:8px;">Thank you!</h3>
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">We've received your request and will be in touch within 24 hours to schedule your demo.</p>
          </div>
        `;
      }, 1200);
    });
  }

  // --- Animate impact numbers on scroll ---
  const impactValues = document.querySelectorAll('.impact__value');
  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        impactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  impactValues.forEach(el => impactObserver.observe(el));

  function animateValue(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current + suffix;
    }, 30);
  }
});
