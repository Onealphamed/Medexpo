const defaultConfig = {
  company_name: "OneAlphaMed",
  events_tab_title: "📅 Events",
  sea_section_title: "South East Asia",
  internal_section_title: "Internal Events",
  booths_tab_title: "🏢 Booths",
  engagement_tab_title: "🎯 Engagement",
};

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function safeSetHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

async function onConfigChange(cfg) {
  const config = { ...defaultConfig, ...cfg };

  safeSetText("companyName", config.company_name);
  safeSetHTML(
    "eventsTab",
    `<span>${config.events_tab_title}</span>`
  );
  safeSetText("seaSectionTitle", config.sea_section_title);
  safeSetText(
    "internalSectionTitle",
    config.internal_section_title
  );
  safeSetHTML(
    "boothsTab",
    `<span>${config.booths_tab_title}</span>`
  );
  safeSetHTML(
    "engagementTab",
    `<span>${config.engagement_tab_title}</span>`
  );
}

function mapToCapabilities(cfg) {
  return {
    recolorables: [],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined,
  };
}

function mapToEditPanelValues(cfg) {
  const c = { ...defaultConfig, ...cfg };
  return new Map([
    ["company_name", c.company_name],
    ["events_tab_title", c.events_tab_title],
    ["sea_section_title", c.sea_section_title],
    ["internal_section_title", c.internal_section_title],
    ["booths_tab_title", c.booths_tab_title],
    ["engagement_tab_title", c.engagement_tab_title],
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues,
  });
}

// Initialize with default config for standalone usage
onConfigChange(defaultConfig);

// Ensure script runs after DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.nav-section');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const focusableLinks = navLinks ? navLinks.querySelectorAll('a') : [];

  // Scroll handler to add/remove scrolled class (same behavior you mentioned)
  function updateNavBackground() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  updateNavBackground();
  window.addEventListener('scroll', updateNavBackground);

  // Mobile toggle handler
  if (toggle && navLinks) {
    toggle.addEventListener('click', function (e) {
      const isOpen = this.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      // set aria-expanded on the button for screen readers
      this.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Optional: collapse after clicking a nav link (mobile)
    focusableLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});

 /* ---------- ZOOM / LIGHTBOX FOR IMAGES ONLY ---------- */

const lightbox = document.getElementById('mediaLightbox');
const lightboxInner = lightbox ? lightbox.querySelector('.lightbox-inner') : null;
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

// 1) Add zoom buttons only to images (NOT videos)
const mediaBlocks = document.querySelectorAll('.card-media');

mediaBlocks.forEach((block) => {

  // ⭐ Select ONLY images inside card-media
  const img = block.querySelector('img');
  const video = block.querySelector('video');

  // If this block contains a video → SKIP
  if (video && !img) return;

  // If no image inside → skip
  if (!img) return;

  // Avoid duplicating zoom button
  if (block.querySelector('.zoom-btn')) return;

  // Create the zoom button
  const zoomBtn = document.createElement('button');
  zoomBtn.type = 'button';
  zoomBtn.className = 'zoom-btn';
  zoomBtn.setAttribute('aria-label', 'View larger');
  zoomBtn.innerHTML = '⛶';

  block.appendChild(zoomBtn);

  zoomBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!lightbox || !lightboxInner) return;

    // Clear previous content
    lightboxInner.innerHTML = '';

    // Clone ONLY the image
    const clone = img.cloneNode(true);
    clone.style.width = '100%';
    clone.style.height = 'auto';

    lightboxInner.appendChild(clone);

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

// 2) Lightbox close interactions

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lightboxInner) {
    lightboxInner.innerHTML = '';
  }
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});



