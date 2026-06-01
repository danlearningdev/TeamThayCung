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
if (valid) alert('Thank you! Your message has been received. We will get in touch with you as soon as possible.');
});

// ─── LANGUAGE TOGGLE (Vietnamese/English) ─────────────────────────────────
const langToggle = document.getElementById('language-toggle');
const currentLang = localStorage.getItem('language') || 'en';
let isVietnamese = currentLang === 'vi';

const translations = {
  'vi': {
    // Navigation
    'Home': 'Trang Chủ',
    'About Us': 'Về Chúng Tôi',
    'Achievements': 'Thành Tích',
    'Spirit Gathering': 'Tập Hợp Linh Hồn',
    'Press Kit': 'Bộ Tài Liệu',
    'Team': 'Đội Ngũ',
    'Contact': 'Liên Hệ',
    
    // Hero
    'RMIT University · Boardgame Design Studio': 'Đại học RMIT · Studio Thiết kế Board Game',
    'Team\nThầy Cúng': 'Team\nThầy Cúng',
    'Vietnamese Folklore Boardgame Studio': 'Studio Board Game Dân gian Việt Nam',
    'We are Exorcist Studio, a game design team from RMIT University. We create strategic boardgames and digital experiences rooted in Vietnamese spiritual folklore, rituals, and spiritual culture. Every game is a séance, every decision is a prayer.': 'Chúng tôi là Exorcist Studio, một đội thiết kế game từ Đại học RMIT. Chúng tôi tạo ra những trò chơi board game chiến lược và trải nghiệm kỹ thuật số có gốc rễ trong dân gian tâm linh, nghi lễ và văn hóa tâm linh Việt Nam. Mỗi trò chơi là một buổi cầu hồn, mỗi quyết định là một lời cầu nguyện.',
    'Explore Spirit Gathering': 'Khám Phá Tập Hợp Linh Hồn',
    'View Press Kit': 'Xem Bộ Tài Liệu',
    'Cuộn xuống': 'Cuộn xuống',
    
    // About
    '✦ About Us': '✦ Về Chúng Tôi',
    'Team Thay Cung / Exorcist Studio': 'Team Thay Cung / Exorcist Studio',
    'Who We Are': 'Chúng Tôi Là Ai',
    'Team Thay Cung (Exorcist Studio) is a Vietnamese boardgame design studio dedicated to creating games that celebrate and explore Vietnamese spiritual culture, folklore, and rituals.': 'Team Thay Cung (Exorcist Studio) là một studio thiết kế board game Việt Nam tập trung vào tạo ra những trò chơi tôn vinh và khám phá văn hóa tâm linh, dân gian và nghi lễ Việt Nam.',
    'Our Mission': 'Sứ Mệnh Của Chúng Tôi',
    'We bring Vietnamese spiritual heritage closer to the world through immersive tabletop and digital games. We believe folklore is not just history-it\'s an endless source of storytelling, strategy, and human connection. Through our games, we honor ancestral traditions while creating modern, engaging experiences.': 'Chúng tôi mang di sản tâm linh Việt Nam gần hơn với thế giới thông qua những trò chơi bàn và kỹ thuật số đắm chìm. Chúng tôi tin rằng dân gian không chỉ là lịch sử - nó là một nguồn vô tận của kỳ tích, chiến lược và kết nối con người. Thông qua các trò chơi của chúng tôi, chúng tôi tôn vinh truyền thống tổ tiên trong khi tạo ra những trải nghiệm hiện đại, hấp dẫn.',
    'Our Vision': 'Tầm Nhìn Của Chúng Tôi',
    'To establish Vietnamese boardgame design as a distinctive voice in the global gaming industry, rooted in authentic cultural narratives and ritual aesthetics. We aspire to export Vietnamese spiritual worldviews through games that are mechanically rich, narratively deep, and culturally resonant.': 'Thiết lập thiết kế board game Việt Nam như một giọng nói độc đáo trong ngành công nghiệp game toàn cầu, có gốc rễ trong các câu chuyện văn hóa xác thực và thẩm mỹ nghi lễ. Chúng tôi khao khát xuất khẩu thế giới quan tâm linh Việt Nam thông qua những trò chơi giàu cơ chế, sâu sắc về tường thuật và cộng hưởng về mặt văn hóa.',
    'Based at:': 'Có trụ sở tại:',
    'Founded:': 'Thành lập:',
    'Studio Size:': 'Kích thước Studio:',
    'Core team of 4 passionate designers and creators': 'Đội ngũ cốt lõi 4 nhà thiết kế và người sáng tạo đam mê',
    'Strategic Design': 'Thiết Kế Chiến Lược',
    'Complex, rewarding mechanics rooted in Vietnamese cultural symbolism.': 'Cơ chế phức tạp và xứng đáng có gốc rễ trong biểu tượng văn hóa Việt Nam.',
    'Folklore-First': 'Dân Gian Đầu Tiên',
    'Authentic cultural narratives, not shallow aesthetics.': 'Các câu chuyện văn hóa xác thực, không phải thẩm mỹ nông cạn.',
    'Community-Driven': 'Hướng Tới Cộng Đồng',
    'Games designed to bring people together through shared ritual and story.': 'Các trò chơi được thiết kế để đoàn kết mọi người thông qua nghi lễ và câu chuyện chung.',
    
    // Achievements
    '✦ Achievements': '✦ Thành Tích',
    'Our Journey': 'Hành Trình Của Chúng Tôi',
  }
};

// Initialize language on page load
if (isVietnamese) {
  langToggle.querySelector('.lang-text').textContent = 'VI';
  translatePage(true);
} else {
  langToggle.querySelector('.lang-text').textContent = 'EN';
}

function translatePage(toVi) {
  document.querySelectorAll('[data-en]').forEach(el => {
    // Skip parent containers whose children also have data-en (let children handle themselves)
    if (el.querySelector('[data-en]')) return;

    // Save original innerHTML the first time (preserves <a>, <strong>, etc.)
    if (!el.dataset.originalHtml) {
      el.dataset.originalHtml = el.innerHTML;
    }

    if (toVi) {
      const viText = el.dataset.vi || el.dataset.en;
      el.textContent = viText;
    } else {
      // Restore the original HTML (with links, bold tags intact)
      el.innerHTML = el.dataset.originalHtml;
    }
  });
}

langToggle.addEventListener('click', () => {
  isVietnamese = !isVietnamese;
  localStorage.setItem('language', isVietnamese ? 'vi' : 'en');
  
  langToggle.querySelector('.lang-text').textContent = isVietnamese ? 'VI' : 'EN';
  translatePage(isVietnamese);
});

// ─── SCROLL TO TOP BUTTON ──────────────────────────────────────────
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});