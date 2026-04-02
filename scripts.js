// ─── NAV SCROLL ──────────────────────────────────────────
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── SCROLL REVEAL ───────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ─── CUSTOM CURSOR ───────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -100, my = -100;
let rx = -100, ry = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// hover state on interactive elements
const hoverEls = document.querySelectorAll('a, button, .lightbox-trigger, .achievement-card, .team-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

document.addEventListener('mousedown', () => ring.classList.add('clicking'));
document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

// ─── SPIRIT TRAIL CANVAS ─────────────────────────────────
const sc = document.getElementById('spirit-canvas');
const sctx = sc.getContext('2d');
sc.width = window.innerWidth;
sc.height = window.innerHeight;
window.addEventListener('resize', () => { sc.width = window.innerWidth; sc.height = window.innerHeight; });

const spirits = [];
class Spirit {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(Math.random() * 1.5 + 0.5);
    this.life = 1;
    this.decay = Math.random() * 0.04 + 0.03;
    this.size = Math.random() * 4 + 2;
    this.hue = Math.random() < 0.6 ? 0 : 40; // red or gold
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.97;
    this.vy *= 0.98;
    this.life -= this.decay;
    this.size *= 0.97;
  }
  draw() {
    sctx.save();
    sctx.globalAlpha = this.life * 0.7;
    const grad = sctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    if (this.hue === 0) {
      grad.addColorStop(0, 'rgba(255,80,20,0.9)');
      grad.addColorStop(1, 'rgba(139,0,0,0)');
    } else {
      grad.addColorStop(0, 'rgba(232,200,106,0.9)');
      grad.addColorStop(1, 'rgba(201,168,76,0)');
    }
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();
  }
}

let lastMx = 0, lastMy = 0;
document.addEventListener('mousemove', e => {
  const dx = e.clientX - lastMx, dy = e.clientY - lastMy;
  const speed = Math.sqrt(dx * dx + dy * dy);
  if (speed > 3) {
    for (let i = 0; i < Math.min(3, speed * 0.3); i++) {
      spirits.push(new Spirit(e.clientX, e.clientY));
    }
  }
  lastMx = e.clientX; lastMy = e.clientY;
});

function animateSpirits() {
  sctx.clearRect(0, 0, sc.width, sc.height);
  for (let i = spirits.length - 1; i >= 0; i--) {
    spirits[i].update();
    spirits[i].draw();
    if (spirits[i].life <= 0) spirits.splice(i, 1);
  }
  requestAnimationFrame(animateSpirits);
}
animateSpirits();

// ─── EMBER PARTICLES ─────────────────────────────────────
const ec = document.getElementById('ember-canvas');
const ectx = ec.getContext('2d');
ec.width = window.innerWidth;
ec.height = window.innerHeight;
window.addEventListener('resize', () => { ec.width = window.innerWidth; ec.height = window.innerHeight; });

const embers = [];
class Ember {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * ec.width;
    this.y = init ? Math.random() * ec.height : ec.height + 10;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -(Math.random() * 0.6 + 0.2);
    this.size = Math.random() * 1.8 + 0.5;
    this.life = Math.random() * 0.5 + 0.3;
    this.maxLife = this.life;
    this.flicker = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx + Math.sin(this.flicker) * 0.3;
    this.y += this.vy;
    this.flicker += 0.06;
    this.life -= 0.002;
    if (this.life <= 0 || this.y < -10) this.reset(false);
  }
  draw() {
    const a = (this.life / this.maxLife) * 0.55;
    ectx.save();
    ectx.globalAlpha = a;
    ectx.fillStyle = Math.random() < 0.7 ? '#C0392B' : '#C9A84C';
    ectx.shadowColor = ectx.fillStyle;
    ectx.shadowBlur = 6;
    ectx.beginPath();
    ectx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ectx.fill();
    ectx.restore();
  }
}

for (let i = 0; i < 55; i++) embers.push(new Ember());

function animateEmbers() {
  ectx.clearRect(0, 0, ec.width, ec.height);
  embers.forEach(e => { e.update(); e.draw(); });
  requestAnimationFrame(animateEmbers);
}
animateEmbers();

// ─── LIGHTBOX ─────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');
const lbClose = document.getElementById('lightbox-close');

document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const img = trigger.querySelector('img');
    if (!img || img.style.display === 'none') return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = trigger.dataset.caption || img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 350);
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── CONTACT FORM ─────────────────────────────────────────
document.getElementById('submit-btn')?.addEventListener('click', () => {
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  let valid = true;
  inputs.forEach(inp => {
    inp.style.borderColor = !inp.value.trim() ? 'var(--crimson-bright)' : '';
    if (!inp.value.trim()) valid = false;
  });
  if (valid) alert('Cảm ơn! Lời nhắn của bạn đã được ghi nhận. Chúng tôi sẽ liên lạc sớm nhất.');
});