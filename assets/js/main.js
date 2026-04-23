/**
 * OK Car Shipping LLC — main.js
 * Handles: nav, mobile menu, FAQ accordion, scroll animations,
 *          quote form, sticky CTA, smooth interactions
 */
(function() {
  'use strict';

  // ── DOM Ready ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDropdowns();
    initFAQ();
    initScrollAnimations();
    initStickyHeader();
    initStickyCTA();
    initQuoteForm();
    initCounters();
    initPhoneMask();
  });

  // ── Mobile Menu ──────────────────────────────────────────
  function initMobileMenu() {
    const toggle   = document.querySelector('.menu-toggle');
    const menu     = document.querySelector('.mobile-menu');
    const overlay  = document.querySelector('.mobile-overlay');
    const close    = document.querySelector('.mobile-menu-close');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      overlay && overlay.classList.add('open');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('open');
      overlay && overlay.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    close && close.addEventListener('click', closeMenu);
    overlay && overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ── Dropdowns (keyboard accessible) ─────────────────────
  function initDropdowns() {
    const items = document.querySelectorAll('.nav-item.has-children');
    items.forEach(function(item) {
      const link    = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');
      if (!link || !dropdown) return;

      // Close on outside click
      document.addEventListener('click', function(e) {
        if (!item.contains(e.target)) {
          dropdown.style.opacity = '';
          dropdown.style.visibility = '';
        }
      });
    });
  }

  // ── FAQ Accordion ────────────────────────────────────────
  function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const answer  = btn.nextElementSibling;
        const isOpen  = btn.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-question.open').forEach(function(q) {
          q.classList.remove('open');
          const a = q.nextElementSibling;
          if (a) a.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) {
          btn.classList.add('open');
          if (answer) answer.classList.add('open');
        }
      });
    });
  }

  // ── Scroll Animations ────────────────────────────────────
  function initScrollAnimations() {
    const targets = document.querySelectorAll('.animate-on-scroll');
    if (!targets.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function(el) { observer.observe(el); });
  }

  // ── Sticky Header ─────────────────────────────────────── 
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Sticky Bottom CTA ────────────────────────────────────
  function initStickyCTA() {
    const cta = document.querySelector('.sticky-cta');
    if (!cta) return;
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          cta.classList.toggle('visible', window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Quote Form ───────────────────────────────────────────
  function initQuoteForm() {
    const form = document.querySelector('#quote-form');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');
    let currentStep = 0;

    function showStep(n) {
      steps.forEach(function(s, i) {
        s.style.display = i === n ? 'block' : 'none';
      });
      currentStep = n;
    }

    if (steps.length) {
      showStep(0);
      nextBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (currentStep < steps.length - 1) showStep(currentStep + 1);
        });
      });
      prevBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (currentStep > 0) showStep(currentStep - 1);
        });
      });
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      showSuccessMessage(form);
    });

    // Standard form submit
    const singleForms = document.querySelectorAll('.single-quote-form');
    singleForms.forEach(function(f) {
      f.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccessMessage(f);
      });
    });
  }

  function showSuccessMessage(form) {
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.innerHTML = '<div style="text-align:center;padding:2rem;">' +
      '<div style="font-size:2.5rem;margin-bottom:1rem;">✅</div>' +
      '<h3 style="color:var(--navy);margin-bottom:.5rem;">Quote Request Received!</h3>' +
      '<p style="color:var(--gray-600);">Our team will contact you within 30 minutes during business hours.</p>' +
      '<p style="color:var(--gray-400);font-size:.82rem;margin-top:.5rem;">Or call us now: <strong><a href="tel:+14055551234">(405) 555-1234</a></strong></p>' +
      '</div>';
    form.innerHTML = '';
    form.appendChild(msg);
  }

  // ── Animated Counters ────────────────────────────────────
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start  = Date.now();

        function update() {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        update();
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  // ── Phone Input Masking ──────────────────────────────────
  function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function(input) {
      input.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '').substring(0, 10);
        if (val.length >= 6) {
          val = '(' + val.substring(0,3) + ') ' + val.substring(3,6) + '-' + val.substring(6);
        } else if (val.length >= 3) {
          val = '(' + val.substring(0,3) + ') ' + val.substring(3);
        }
        e.target.value = val;
      });
    });
  }

  // ── Utility: Quote estimator ─────────────────────────────
  window.estimateQuote = function() {
    const origin  = document.querySelector('#est-origin');
    const dest    = document.querySelector('#est-dest');
    const type    = document.querySelector('#est-type');
    const result  = document.querySelector('#est-result');
    if (!origin || !dest || !result) return;

    if (!origin.value.trim() || !dest.value.trim()) {
      result.innerHTML = '<p style="color:var(--orange);font-weight:600;">Please enter both origin and destination.</p>';
      return;
    }

    // Rough distance-based estimate (frontend mockup)
    const isEnclosed = type && type.value === 'enclosed';
    const baseMin    = isEnclosed ? 900 : 400;
    const baseMax    = isEnclosed ? 1800 : 900;

    result.innerHTML =
      '<div style="background:rgba(232,80,10,.07);border:1.5px solid rgba(232,80,10,.2);border-radius:8px;padding:1.25rem;text-align:center;">' +
      '<p style="font-size:.8rem;color:var(--gray-400);margin-bottom:.35rem;">Estimated Price Range</p>' +
      '<p style="font-size:2rem;font-weight:800;color:var(--navy);font-family:var(--font-head);margin-bottom:.35rem;">$' + baseMin + ' – $' + baseMax + '</p>' +
      '<p style="font-size:.8rem;color:var(--gray-600);margin-bottom:1rem;">Final price depends on exact distance, vehicle size &amp; scheduling.</p>' +
      '<a href="/quote.html" class="btn btn-primary btn-sm">Get Exact Quote →</a>' +
      '</div>';
  };

})();
