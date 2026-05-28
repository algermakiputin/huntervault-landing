// ===== Particle Background =====
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return; // Exit if canvas isn't on the page
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '0, 212, 255' : '123, 47, 255'
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.04 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  // Reduce particles on mobile for performance
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    resize();
    createParticles();
    animate();
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }
})();

// ===== Navigation =====
const nav = document.querySelector('.nav');
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
const navPanel = document.getElementById('nav-panel');

const fp = document.getElementById('fullpage');
const updateNavScroll = () => {
  const scrollY = fp ? fp.scrollTop : window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 50);
};
fp?.addEventListener('scroll', updateNavScroll, { passive: true });
window.addEventListener('scroll', updateNavScroll, { passive: true });

function openPanel() {
  navPanel.classList.add('active');
  navPanel.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  navPanel.classList.remove('active');
  navPanel.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  navPanel.classList.contains('active') ? closePanel() : openPanel();
});

// Close panel on any link click inside it
navPanel?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closePanel);
});

// ===== Intersection Observer for Reveal Animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Video Modal =====
const videoModal = document.getElementById('video-modal');
const videoIframe = document.getElementById('video-iframe');
const trailerBtn = document.getElementById('trailer-btn');
const videoClose = document.getElementById('video-close');
const youtubeUrl = 'https://www.youtube.com/embed/kyxljw2JOzM?autoplay=1&rel=0';

function openVideo() {
  gtag('event', 'watch_trailer');
  videoIframe.src = youtubeUrl;
  videoModal.classList.add('active');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  videoModal.classList.remove('active');
  videoModal.setAttribute('aria-hidden', 'true');
  videoIframe.src = '';
  document.body.style.overflow = '';
}

if (trailerBtn) trailerBtn.addEventListener('click', openVideo);
if (videoClose) videoClose.addEventListener('click', closeVideo);
if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (videoModal?.classList.contains('active')) closeVideo();
    if (navPanel?.classList.contains('active')) closePanel();
  }
});

// ===== Conversion Event Tracking =====
// Use specific container selectors to avoid querySelector grabbing the wrong element
document.querySelector('.hero-buttons a[href*="play.google.com"]')?.addEventListener('click', () => {
  gtag('event', 'download_click', { platform: 'google_play', location: 'hero' });
  if (window.fbq) fbq('track', 'Lead', { content_name: 'google_play_hero' });
});
document.querySelector('.hero-buttons a[href*="apps.apple.com"]')?.addEventListener('click', () => {
  gtag('event', 'download_click', { platform: 'app_store', location: 'hero' });
  if (window.fbq) fbq('track', 'Lead', { content_name: 'app_store_hero' });
});

document.querySelector('.cta-buttons a[href*="play.google.com"]')?.addEventListener('click', () => {
  gtag('event', 'download_click', { platform: 'google_play', location: 'cta_section' });
  if (window.fbq) fbq('track', 'Lead', { content_name: 'google_play_cta' });
});
document.querySelector('.cta-buttons a[href*="apps.apple.com"]')?.addEventListener('click', () => {
  gtag('event', 'download_click', { platform: 'app_store', location: 'cta_section' });
  if (window.fbq) fbq('track', 'Lead', { content_name: 'app_store_cta' });
});

// ===== Section View Tracking =====
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gtag('event', 'section_view', { section_id: entry.target.id });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

['features', 'ranks', 'how-it-works', 'privacy', 'download', 'faq'].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ===== FAQ Engagement Tracking =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-expanded') === 'false') {
      gtag('event', 'faq_open', { question: btn.querySelector('span')?.textContent?.trim() });
    }
  });
});

// ===== Kit Email Capture =====
const KIT_FORM_URL = 'https://app.kit.com/forms/9364033/subscriptions';

const kitForm    = document.getElementById('kit-form');
const kitEmail   = document.getElementById('kit-email');
const kitSubmit  = document.getElementById('kit-submit');
const kitMessage = document.getElementById('kit-message');

kitForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = kitEmail.value.trim();
  if (!email) return;

  kitSubmit.disabled = true;
  kitSubmit.textContent = 'Enrolling...';
  kitMessage.textContent = '';
  kitMessage.className = 'email-form-message';

  try {
    const res = await fetch(KIT_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email })
    });

    if (!res.ok) throw new Error();

    kitMessage.textContent = '> Quest Log dispatched. Check your inbox, Hunter.';
    kitMessage.classList.add('success');
    kitForm.reset();
    gtag('event', 'email_signup', { method: 'kit_quest_log' });
  } catch {
    kitMessage.textContent = '> Failed to enroll. Check your email and try again.';
    kitMessage.classList.add('error');
  } finally {
    kitSubmit.disabled = false;
    kitSubmit.innerHTML = 'Claim Quest Log';
  }
});

// ===== Sticky Mobile CTA =====
const stickyCta = document.getElementById('sticky-cta');
const heroSection = document.querySelector('.hero');
const downloadSection = document.getElementById('download');

const showHideSticky = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target === heroSection) {
      if (!entry.isIntersecting) {
        stickyCta.classList.add('visible');
        document.body.classList.add('sticky-cta-visible');
      } else {
        stickyCta.classList.remove('visible');
        document.body.classList.remove('sticky-cta-visible');
      }
    }
    if (entry.target === downloadSection && entry.isIntersecting) {
      stickyCta.classList.remove('visible');
      document.body.classList.remove('sticky-cta-visible');
    }
  });
}, { threshold: 0.1 });

showHideSticky.observe(heroSection);
showHideSticky.observe(downloadSection);

// ===== Smooth scroll for Safari =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Fullpage Scroll Navigation =====
(function() {
  const wrapper = document.getElementById('fullpage');
  if (!wrapper) return;

  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots   = Array.from(document.querySelectorAll('.slide-dot'));
  let current  = 0;

  function setActive(i) {
    current = Math.max(0, Math.min(i, slides.length - 1));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  setActive(0);

  // Track current slide by scroll position
  wrapper.addEventListener('scroll', () => {
    const top = wrapper.scrollTop;
    let closest = 0, minDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetTop - top);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActive(closest);
  }, { passive: true });

  // Dot click → scroll to slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Keyboard navigation (skip if focus is inside a form field)
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      slides[Math.min(current + 1, slides.length - 1)]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      slides[Math.max(current - 1, 0)]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

// ===== Tablet Screenshot Carousel: scale active card =====
(function() {
  function init() {
    const w = window.innerWidth;
    if (w < 769 || w > 1023) return;

    const strip = document.querySelector('#screenshots .app-screens-strip');
    const frames = Array.from(document.querySelectorAll('#screenshots .app-screen-frame'));
    if (!strip || !frames.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.target.classList.toggle('is-active', e.intersectionRatio >= 0.85);
      });
    }, { root: strip, threshold: [0, 0.85, 1] });

    frames.forEach(f => io.observe(f));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.faq-question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      }
    });

    btn.setAttribute('aria-expanded', !isOpen);
    answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
  });
});

// ===== Tools Dropdown =====
(() => {
  const dd  = document.getElementById('nav-tools-dd');
  const btn = document.getElementById('nav-tools-btn');
  if (!dd || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dd.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
