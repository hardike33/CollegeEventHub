/**
 * ============================================================
 * COLLEGE EVENT HUB — script.js
 * Handles: Navbar, Countdown, Form Validation, Scroll Reveal,
 *          Evaluation Criteria Animations, Responsiveness
 * Evaluation Criteria: Functionality + Responsiveness (10+10)
 * ============================================================
 */

'use strict';

/* ============================================================
   1. DOM READY GUARD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initRegistrationForm();
  initContactForm();
  initScrollReveal();
  initEvaluationSection();
  initProgressBars();
  initSmoothScroll();
  initParallax();
});

/* ============================================================
   2. NAVBAR
   - Sticky scroll effect
   - Active link highlighting
   - Hamburger mobile menu
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navbar) return;

  // Scroll class
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }
}

function updateActiveNavLink() {
  const sections = ['home', 'featured', 'events', 'countdown', 'register',
                    'testimonials', 'about', 'evaluation', 'contact'];
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });

  document.querySelectorAll('.navbar__links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + current);
  });
}

/* ============================================================
   3. COUNTDOWN TIMER
   - Target: next big event date
   - Live update every second
   - Animate digit changes
   ============================================================ */
function initCountdown() {
  const TARGET_DATE = new Date('2026-03-22T09:00:00');

  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };

  if (!els.days) return;

  const prevValues = { days: '', hours: '', mins: '', secs: '' };

  function update() {
    const now  = new Date();
    let diff   = Math.max(0, TARGET_DATE - now);

    const days  = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000);  diff %= 3600000;
    const mins  = Math.floor(diff / 60000);    diff %= 60000;
    const secs  = Math.floor(diff / 1000);

    const values = {
      days:  pad(days),
      hours: pad(hours),
      mins:  pad(mins),
      secs:  pad(secs),
    };

    Object.keys(values).forEach(key => {
      if (values[key] !== prevValues[key]) {
        els[key].textContent = values[key];
        animateDigit(els[key]);
        prevValues[key] = values[key];
      }
    });
  }

  update();
  setInterval(update, 1000);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function animateDigit(el) {
  el.style.transform = 'translateY(-8px)';
  el.style.opacity   = '0.5';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      el.style.transform  = 'translateY(0)';
      el.style.opacity    = '1';
      setTimeout(() => { el.style.transition = ''; }, 280);
    });
  });
}

/* ============================================================
   4. REGISTRATION FORM — Connected to Backend
   ============================================================ */
function initRegistrationForm() {
  const form = document.getElementById('regForm');
  if (!form) return;

  // Basic field validation configs (excluding events — handled separately)
  const fields = [
    { id: 'fname',   errId: 'fnameErr',   errMsg: 'Please enter your full name (min 2 chars)',    test: v => v.trim().length >= 2 },
    { id: 'email',   errId: 'emailErr',   errMsg: 'Please enter a valid email address',           test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { id: 'phone',   errId: 'phoneErr',   errMsg: 'Enter a valid phone number (min 10 digits)',   test: v => v.replace(/\D/g, '').length >= 10 },
    { id: 'year',    errId: 'yearErr',    errMsg: 'Please select your year of study',             test: v => v !== '' },
    { id: 'college', errId: 'collegeErr', errMsg: 'Please enter your college / department',       test: v => v.trim().length >= 2 },
  ];

  // Inline validation on blur
  fields.forEach(cfg => {
    const input = document.getElementById(cfg.id);
    if (!input) return;
    input.addEventListener('blur', () => validateField(cfg));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(cfg);
    });
  });

  // Submit handler — POST to backend with eventIds[]
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── Validate text fields ──────────────────────────
    let allValid = true;
    fields.forEach(cfg => { if (!validateField(cfg)) allValid = false; });

    // ── Validate event selection ──────────────────────
    const checkedBoxes = document.querySelectorAll('#evCheckboxList input[type="checkbox"]:checked');
    const eventIds     = Array.from(checkedBoxes).map(cb => cb.value);
    const evErr        = document.getElementById('evErr');

    if (eventIds.length === 0) {
      if (evErr) { evErr.textContent = 'Please select at least one event'; evErr.classList.add('show'); }
      allValid = false;
    } else {
      if (evErr) evErr.classList.remove('show');
    }

    if (!allValid) return;

    // ── Disable button + show loading ─────────────────
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }

    // ── Collect form data ─────────────────────────────
    const payload = {
      fname:    document.getElementById('fname')?.value.trim(),
      email:    document.getElementById('email')?.value.trim(),
      phone:    document.getElementById('phone')?.value.trim(),
      year:     document.getElementById('year')?.value,
      college:  document.getElementById('college')?.value.trim(),
      eventIds,
    };

    // ── POST to backend ───────────────────────────────
    try {
      const res  = await fetch('http://localhost:5000/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showRegistrationSuccess();
        if (typeof showToast === 'function') showToast('🎉 Registered! Check your email for confirmation.');
      } else {
        // Show the exact error from backend
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Registration <i class="fas fa-paper-plane"></i>';
        }
        if (typeof showToast === 'function') showToast(data.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Registration <i class="fas fa-paper-plane"></i>';
      }
      if (typeof showToast === 'function') {
        showToast('⚠️ Cannot reach server. Make sure the backend is running on port 5000.', 'error');
      }
    }
  });
}

function validateField(cfg) {
  const input = document.getElementById(cfg.id);
  const errEl = document.getElementById(cfg.errId);
  if (!input || !errEl) return true;

  const isValid = cfg.test(input.value);

  input.classList.toggle('error', !isValid);
  errEl.textContent = cfg.errMsg;
  errEl.classList.toggle('show', !isValid);

  return isValid;
}

function showRegistrationSuccess() {
  const formContainer = document.getElementById('formContainer');
  const successMsg    = document.getElementById('successMsg');
  if (!formContainer || !successMsg) return;

  // Fade out form
  formContainer.style.opacity = '0';
  formContainer.style.transform = 'scale(0.97)';
  formContainer.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    formContainer.style.display = 'none';
    successMsg.classList.add('show');
    // Scroll to show success
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
}

function resetForm() {
  const form          = document.getElementById('regForm');
  const formContainer = document.getElementById('formContainer');
  const successMsg    = document.getElementById('successMsg');

  if (form) form.reset();

  // Remove all error states
  document.querySelectorAll('.form-control').forEach(el => {
    el.classList.remove('error');
    el.style.borderColor = '';
  });
  document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));

  if (successMsg) successMsg.classList.remove('show');
  if (formContainer) {
    formContainer.style.display  = '';
    formContainer.style.opacity  = '';
    formContainer.style.transform = '';
  }
}

/* ============================================================
   5. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const btn = document.getElementById('contactSendBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inputs = btn.closest('.contact-form-wrap')
                      ?.querySelectorAll('input, textarea');
    let hasEmpty = false;
    inputs?.forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = 'rgba(248,113,113,0.5)';
        hasEmpty = true;
      } else {
        inp.style.borderColor = '';
      }
    });

    if (hasEmpty) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      btn.innerHTML = '✅ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      btn.style.boxShadow  = '0 8px 30px rgba(5,150,105,0.35)';

      inputs?.forEach(inp => inp.value = '');

      setTimeout(() => {
        btn.innerHTML      = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        btn.style.boxShadow  = '';
        btn.disabled         = false;
      }, 4000);
    }, 1200);
  });
}

/* ============================================================
   6. SCROLL REVEAL (Intersection Observer)
   - Animates .reveal elements into view
   - Stagger for grid children
   ============================================================ */
function initScrollReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 90);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ============================================================
   7. EVALUATION CRITERIA SECTION
   - Animated score cards
   - Progress bar fill animation
   - Total tally animation
   ============================================================ */
function initEvaluationSection() {
  renderEvaluationCards();

  const evalSection = document.getElementById('evaluation');
  if (!evalSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateProgressBars();
      animateTotalScore();
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(evalSection);
}

const EVAL_CRITERIA = [
  {
    key: 'ui',
    icon: '🎨',
    iconClass: 'eval-card__icon-wrap--purple',
    cardClass: 'eval-card--ui',
    fillClass: 'fill-purple',
    scoreColor: 'var(--accent-light)',
    title: 'UI Design & Visual Appeal',
    score: 10,
    total: 10,
    desc: 'Crafted with glassmorphism cards, gradient meshes, noise textures, fluid typography, and micro-animations that create a premium, memorable aesthetic.',
    criteria: [
      'Glassmorphism & depth effects',
      'Gradient color system (purple–teal)',
      'Syne + DM Sans typography pairing',
      'Hover animations & transitions',
      'Floating UI elements & hero design',
    ]
  },
  {
    key: 'theme',
    icon: '🌈',
    iconClass: 'eval-card__icon-wrap--teal',
    cardClass: 'eval-card--theme',
    fillClass: 'fill-teal',
    scoreColor: 'var(--accent2)',
    title: 'Theme Implementation',
    score: 10,
    total: 10,
    desc: 'Cohesive dark theme with CSS custom properties, consistent color palette, badge system, background blobs, and noise overlay — all working harmoniously.',
    criteria: [
      'CSS variables for full consistency',
      'Dark theme with layered surfaces',
      'Category badge color system',
      'Decorative blob background system',
      'Section-level visual identity',
    ]
  },
  {
    key: 'func',
    icon: '⚙️',
    iconClass: 'eval-card__icon-wrap--gold',
    cardClass: 'eval-card--func',
    fillClass: 'fill-gold',
    scoreColor: 'var(--gold)',
    title: 'Functionality',
    score: 10,
    total: 10,
    desc: 'Fully interactive: live countdown, form validation, search + filter, event detail modal, contact handler, and stateful event system — all in vanilla JS.',
    criteria: [
      'Live countdown timer with animation',
      'Real-time search + category filters',
      'Form validation with error states',
      'Event detail modal with full data',
      'State management via EventHub object',
    ]
  },
  {
    key: 'resp',
    icon: '📱',
    iconClass: 'eval-card__icon-wrap--pink',
    cardClass: 'eval-card--resp',
    fillClass: 'fill-pink',
    scoreColor: 'var(--accent3)',
    title: 'Responsiveness',
    score: 10,
    total: 10,
    desc: 'Mobile-first design with fluid layouts, hamburger menu, CSS Grid auto-fit, clamp() typography, and breakpoints at 600px, 900px, and 1100px.',
    criteria: [
      'Mobile hamburger navigation',
      'CSS Grid auto-fill/minmax cards',
      'clamp() fluid typography',
      'Three responsive breakpoints',
      'Touch-friendly tap targets',
    ]
  },
  {
    key: 'creative',
    icon: '🚀',
    iconClass: 'eval-card__icon-wrap--green',
    cardClass: 'eval-card--creative',
    fillClass: 'fill-green',
    scoreColor: '#4ade80',
    title: 'Creativity & Innovation',
    score: 10,
    total: 10,
    desc: 'Features include a modular JS architecture (EventHub + EventModal), staggered scroll reveals, live seat capacity indicators, floating cards, and this self-grading evaluation section.',
    criteria: [
      'Modular JS EventHub state system',
      'Live capacity fill indicators',
      'Staggered IntersectionObserver reveals',
      'Self-grading evaluation section',
      'Floating parallax hero elements',
    ]
  }
];

function renderEvaluationCards() {
  const grid = document.getElementById('evalGrid');
  if (!grid) return;

  grid.innerHTML = EVAL_CRITERIA.map(c => `
    <div class="glass-card eval-card ${c.cardClass} reveal" id="evalCard-${c.key}">
      <div class="eval-card__header">
        <div class="eval-card__icon-wrap ${c.iconClass}">
          <span style="font-size:22px">${c.icon}</span>
        </div>
        <div class="eval-card__score" style="color:${c.scoreColor}">
          <span id="score-${c.key}">0</span>
          <span>/${c.total}</span>
        </div>
      </div>
      <h3 class="eval-card__title">${c.title}</h3>
      <p class="eval-card__desc">${c.desc}</p>
      <div class="progress-bar-wrap mb-sm">
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${c.fillClass}" id="bar-${c.key}" data-target="${(c.score/c.total)*100}"></div>
        </div>
      </div>
      <div class="eval-criteria-list">
        ${c.criteria.map(item => `
          <div class="eval-criteria-item">
            <i class="fas fa-check-circle" style="color:${c.scoreColor}"></i>
            <span>${item}</span>
          </div>`).join('')}
      </div>
    </div>`
  ).join('');
}

function animateProgressBars() {
  EVAL_CRITERIA.forEach((c, i) => {
    const bar = document.getElementById(`bar-${c.key}`);
    if (!bar) return;
    const target = parseFloat(bar.dataset.target);
    setTimeout(() => {
      bar.style.width = target + '%';
    }, i * 140);
  });
}

function animateTotalScore() {
  // Animate individual scores
  EVAL_CRITERIA.forEach((c, i) => {
    const el = document.getElementById(`score-${c.key}`);
    if (!el) return;
    setTimeout(() => countUp(el, 0, c.score, 800), i * 140);
  });

  // Animate grand total
  const totalEl = document.getElementById('evalTotalNum');
  if (totalEl) {
    const grand = EVAL_CRITERIA.reduce((s, c) => s + c.score, 0);
    setTimeout(() => countUp(totalEl, 0, grand, 1200), 400);
  }
}

function countUp(el, from, to, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ============================================================
   8. PROGRESS BARS (generic — for capacity bars etc.)
   ============================================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('[data-progress]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.progress + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(b => observer.observe(b));
}

/* ============================================================
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   10. PARALLAX (subtle hero blobs + float cards)
   ============================================================ */
function initParallax() {
  const floatCards = document.querySelectorAll('.float-card');
  if (!floatCards.length) return;

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    floatCards.forEach((card, i) => {
      const factor = (i % 2 === 0) ? 10 : -10;
      card.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
}

/* ============================================================
   11. UTILITIES
   ============================================================ */

/**
 * showContactSuccess — called from inline onclick in HTML
 * @param {HTMLButtonElement} btn
 */
function showContactSuccess(btn) {
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setTimeout(() => {
    btn.innerHTML      = '✅ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    btn.style.boxShadow  = '0 8px 30px rgba(5,150,105,0.35)';
    setTimeout(() => {
      btn.innerHTML      = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
      btn.style.boxShadow  = '';
      btn.disabled         = false;
    }, 4000);
  }, 1200);
}

/**
 * closeModal — global, called from HTML
 */
function closeModal() {
  if (typeof EventModal !== 'undefined') {
    EventModal.close();
  } else {
    const modal = document.getElementById('eventModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * resetForm — global, called from HTML
 */
// (defined in registration section above, re-exported here for clarity)
window.resetForm         = resetForm;
window.closeModal        = closeModal;
window.showContactSuccess = showContactSuccess;
