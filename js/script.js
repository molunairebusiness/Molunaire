/* =======================
   Helpers
   ======================= */
const qs = (sel, parent = document) => parent.querySelector(sel);
const qsa = (sel, parent = document) => [...parent.querySelectorAll(sel)];

/* =======================
   Theme toggle
   ======================= */
(function themeToggle() {
  const btn = qs('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const root = document.body;
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('molunaire-theme', next);
  });
  const saved = localStorage.getItem('molunaire-theme');
  if (saved) document.body.setAttribute('data-theme', saved);
})();

/* =======================
   Mobile menu
   ======================= */
(function mobileMenu() {
  const burger = qs('.hamburger');
  const menu = qs('.mobile-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    const open = menu.classList.contains('open');
    menu.setAttribute('aria-hidden', String(!open));
  });
})();

/* =======================
   Page transitions
   ======================= */
(function pageTransitions() {
  const cover = qs('#transition-cover');
  if (!cover) return;

  // Intro animation on load
  requestAnimationFrame(() => {
    cover.classList.add('active');
    setTimeout(() => cover.classList.add('anim-out'), 60);
    setTimeout(() => cover.classList.remove('active', 'anim-out'), 720);
  });

  // Link intercept for same-domain links
  qsa('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    a.addEventListener('click', (e) => {
      const same = a.host === location.host;
      if (!same) return;
      e.preventDefault();
      cover.classList.add('active');
      setTimeout(() => window.location.href = href, 280);
    });
  });
})();

/* =======================
   Intersection reveals
   ======================= */
(function reveals() {
  const items = qsa('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* =======================
   Parallax
   ======================= */
(function parallax() {
  const layers = qsa('.parallax');
  if (!layers.length) return;
  const onScroll = () => {
    const y = window.scrollY || 0;
    layers.forEach(el => {
      const depth = parseFloat(el.dataset.depth || '0.15');
      el.style.transform = `translate3d(0, ${y * depth * -0.2}px, 0)`;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =======================
   Magnetic buttons
   ======================= */
(function magneticButtons() {
  const mags = qsa('.magnetic');
  mags.forEach(btn => {
    const strength = 14;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* =======================
   Custom cursor
   ======================= */
(function customCursor() {
  const c = qs('.cursor');
  if (!c) return;
  let x = 0, y = 0, tx = 0, ty = 0;

  const move = (e) => {
    x = e.clientX; y = e.clientY;
  };
  const loop = () => {
    tx += (x - tx) * 0.18;
    ty += (y - ty) * 0.18;
    c.style.transform = `translate(${tx}px, ${ty}px)`;
    requestAnimationFrame(loop);
  };

  document.addEventListener('mousemove', move);
  loop();

  qsa('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => c.style.width = c.style.height = '26px');
    el.addEventListener('mouseleave', () => c.style.width = c.style.height = '18px');
  });
})();

/* =======================
   Smooth hash scroll
   ======================= */
(function smoothHash() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = qs(`#${id}`);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

/* =======================
   Lazy loading fallback (older browsers)
   ======================= */
(function lazyFallback() {
  if ('loading' in HTMLImageElement.prototype) return;
  const imgs = qsa('img[loading="lazy"]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('src');
        if (src) img.src = src;
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '250px' });
  imgs.forEach(img => obs.observe(img));
})();

/* =======================
   Tabs
   ======================= */
(function tabs() {
  const container = qs('.tabs');
  if (!container) return;
  const buttons = qsa('.tab-btn', container);
  const panels = qsa('.tab-panel', container);

  const activate = (id) => {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    panels.forEach(p => p.classList.toggle('active', p.id === id));
  };

  buttons.forEach(b => {
    b.addEventListener('click', () => activate(b.dataset.tab));
  });
})();

/* =======================
   Contact form validation + mock submit
   ======================= */
(function contactForm() {
  const form = qs('#contact-form');
  if (!form) return;
  const status = qs('#form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();

    let ok = true;
    const setError = (id, msg) => {
      ok = false;
      const field = qs(`#${id}`);
      const hint = field?.parentElement?.querySelector('.error');
      if (hint) hint.textContent = msg;
    };
    // Reset hints
    qsa('.error', form).forEach(h => h.textContent = '');

    if (!name) setError('name', 'Vul je naam in.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) setError('email', 'Vul een geldig e‑mailadres in.');
    if (message.length < 10) setError('message', 'Geef minimaal 10 tekens aan context.');

    if (!ok) return;

    status.textContent = 'Versturen…';
    try {
      // Mock request; vervang met echte endpoint
      await new Promise(res => setTimeout(res, 900));
      status.textContent = 'Dank je! We nemen snel contact op.';
      form.reset();
    } catch (err) {
      status.textContent = 'Er ging iets mis. Probeer later opnieuw.';
    }
  });
})();
