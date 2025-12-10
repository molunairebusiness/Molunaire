// Navigation - hamburger toggle
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    if (mainNav.style.display === 'flex' || mainNav.style.display === '') {
      mainNav.style.display = 'none';
    } else {
      mainNav.style.display = 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.gap = '12px';
    }
  });
}

// Modal open/close
function openContactModal(){
  const modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeContactModal(){
  const modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  clearFormStatus();
}

// Basic client-side form submission (demo)
// NOTE: For real email delivery use a backend or a form service (Formspree, Netlify Forms, etc.)
function submitContactForm(e){
  e.preventDefault();
  const form = e.target.closest('form') || document.getElementById('contactForm') || document.getElementById('contactFormPage');
  if (!form) return false;

  const name = form.querySelector('input[name="name"]').value.trim();
  const email = form.querySelector('input[name="email"]').value.trim();
  const message = form.querySelector('textarea[name="message"]').value.trim();
  const statusEl = form.querySelector('.form-status') || document.getElementById('formStatus') || document.getElementById('formStatusPage');

  if (!name || !email || !message) {
    setFormStatus(statusEl, 'Vul alstublieft alle verplichte velden in.', true);
    return false;
  }

  // Simulate sending: show a loader, then success message.
  setFormStatus(statusEl, 'Verzenden…', false);
  setTimeout(() => {
    // In productie: stuur via Fetch naar je backend of formulier-service
    setFormStatus(statusEl, 'Dank! We nemen binnen 24 uur contact met je op.', false);
    form.reset();
    // auto-close modal after 2s if modal present
    const modal = document.getElementById('contactModal');
    if (modal) setTimeout(() => { closeContactModal(); }, 2000);
  }, 1200);

  return false;
}

function setFormStatus(el, msg, isError){
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#ff7a7a' : '#98ffb3';
}
function clearFormStatus(){
  const els = document.querySelectorAll('.form-status');
  els.forEach(el => el.textContent = '');
}

// Testimonial carousel (auto-rotate)
(function initCarousel(){
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.slide');
  let idx = 0;
  slides.forEach((s,i)=> s.classList.toggle('active', i===0));
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5000);
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({behavior:'smooth'});
  });
});
