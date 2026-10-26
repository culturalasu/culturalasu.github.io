/* ==========================================================================
   Culture & Media Committee Website — Vanilla JavaScript (js/main.js)
   Developed by Dr. Ahmed Elkateb
   Handles:
   1. Mobile Navigation Toggle
   2. Creative Zine Category Filtering & On-Page Reader Modal (LTR & RTL)
   3. Media Gallery Filtering & Fullscreen Lightbox
   4. Certificate Verification (fetches ./certificates.json)
   5. Event RSVP Confirmation Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('primary-nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // 2. Creative Zine Category Filter & On-Page Reader Modal
  const zineFilterBtns = document.querySelectorAll('[data-zine-filter]');
  const zineCards = document.querySelectorAll('.zine-item');
  if (zineFilterBtns.length > 0) {
    zineFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        zineFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-zine-filter');
        zineCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Zine Reader Modal
  const zineModal = document.getElementById('zine-reader-modal');
  const zineModalClose = document.getElementById('zine-modal-close');
  const readButtons = document.querySelectorAll('.open-zine-reader');

  if (zineModal && readButtons.length > 0) {
    readButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.zine-item');
        if (!card) return;
        const dir = card.getAttribute('dir') || 'ltr';
        const title = card.querySelector('.card-title')?.textContent || '';
        const category = card.querySelector('.card-tag')?.textContent || '';
        const author = card.querySelector('.zine-author')?.textContent || '';
        const fullTextEl = card.querySelector('.zine-full-content');
        const fullHtml = fullTextEl ? fullTextEl.innerHTML : card.querySelector('.card-text')?.innerHTML || '';

        const modalBody = document.getElementById('zine-modal-body');
        if (modalBody) {
          modalBody.setAttribute('dir', dir);
          modalBody.innerHTML = `
            <span class="eyebrow-badge" style="margin-bottom:0.75rem;">${category}</span>
            <h2 class="serif-heading" style="font-size:1.85rem; margin-bottom:0.4rem; color:var(--bg-espresso);">${title}</h2>
            <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--border-warm);">${author}</p>
            <div style="font-size:1.08rem; line-height:1.95; color:var(--text-primary);">${fullHtml}</div>
          `;
        }
        zineModal.classList.add('open');
      });
    });

    if (zineModalClose) {
      zineModalClose.addEventListener('click', () => zineModal.classList.remove('open'));
    }
    zineModal.addEventListener('click', (e) => {
      if (e.target === zineModal) zineModal.classList.remove('open');
    });
  }

  // 3. Media Gallery Filter & Fullscreen Lightbox
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-gallery-filter');
        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          item.style.display = (cat === 'all' || itemCat === cat) ? 'flex' : 'none';
        });
      });
    });
  }

  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryTriggers = document.querySelectorAll('.gallery-zoom-trigger');

  if (lightbox && galleryTriggers.length > 0) {
    galleryTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const imgSrc = trigger.getAttribute('data-img-src');
        const caption = trigger.getAttribute('data-caption');
        if (lightboxImg && imgSrc) lightboxImg.src = imgSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption || '';
        lightbox.classList.add('open');
      });
    });
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  // 4. Certificate Verification Logic (verify.html)
  const verifyBtn = document.getElementById('verify-btn');
  const certInput = document.getElementById('cert-id-input');
  const resultContainer = document.getElementById('verification-result');
  const quickSampleBtns = document.querySelectorAll('[data-sample-cert]');

  // Fallback embedded array in case admin opens verify.html via file:// protocol locally
  const FALLBACK_CERTIFICATES = [
    { cert_id: "SU-CCM-1001", name: "Sample Student", role: "Media Committee Volunteer", issue_date: "2025-11-20", status: "Valid" },
    { cert_id: "SU-CCM-1002", name: "Jane Doe", role: "Event Photographer", issue_date: "2026-03-10", status: "Valid" },
    { cert_id: "SU-CCM-1003", name: "Omar Khaled El-Sayed", role: "Gilgamesh Book Club Moderator", issue_date: "2026-04-15", status: "Valid" },
    { cert_id: "SU-CCM-1004", name: "Nourhan Tarek Abdelrahman", role: "Theatrical Production Stage Director (Al-Live Al-Akheer)", issue_date: "2026-05-02", status: "Valid" },
    { cert_id: "SU-CCM-1005", name: "Youssef Mahmoud Hassan", role: "Creative Zine Editorial Reviewer", issue_date: "2026-06-18", status: "Valid" }
  ];

  async function verifyCertificateId(rawQuery) {
    if (!resultContainer) return;
    const query = (rawQuery || '').trim().toUpperCase();
    if (!query) {
      resultContainer.innerHTML = `
        <div class="result-error-card" role="alert">
          Invalid ID. Certificate not found. Please enter a valid Certificate ID (e.g., SU-CCM-1001).
        </div>
      `;
      return;
    }

    let records = FALLBACK_CERTIFICATES;
    try {
      const response = await fetch('./certificates.json', { cache: 'no-store' });
      if (response.ok) {
        records = await response.json();
      }
    } catch (err) {
      // Uses FALLBACK_CERTIFICATES when opened via local file:// protocol
    }

    const match = records.find(item => String(item.cert_id).toUpperCase() === query);
    if (match) {
      resultContainer.innerHTML = `
        <div class="result-success-card" role="status">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding-bottom:0.75rem; border-bottom:1px solid rgba(16,185,129,0.3);">
            <strong style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
              <span>&#10003; Verified Authentic Certificate</span>
            </strong>
            <span style="background:#059669; color:#fff; padding:0.25rem 0.75rem; border-radius:999px; font-size:0.78rem; font-weight:700; text-transform:uppercase;">
              ${match.status}
            </span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.85rem; font-size:0.95rem;">
            <div><span style="opacity:0.75; display:block; font-size:0.8rem;">Certificate ID</span><strong>${match.cert_id}</strong></div>
            <div><span style="opacity:0.75; display:block; font-size:0.8rem;">Recipient Name</span><strong>${match.name}</strong></div>
            <div><span style="opacity:0.75; display:block; font-size:0.8rem;">Committee Role</span><strong>${match.role}</strong></div>
            <div><span style="opacity:0.75; display:block; font-size:0.8rem;">Issue Date</span><strong>${match.issue_date}</strong></div>
          </div>
        </div>
      `;
    } else {
      resultContainer.innerHTML = `
        <div class="result-error-card" role="alert">
          Invalid ID. Certificate not found.
        </div>
      `;
    }
  }

  if (verifyBtn && certInput) {
    verifyBtn.addEventListener('click', () => verifyCertificateId(certInput.value));
    certInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyCertificateId(certInput.value);
      }
    });
  }

  if (quickSampleBtns.length > 0 && certInput) {
    quickSampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleId = btn.getAttribute('data-sample-cert') || '';
        certInput.value = sampleId;
        verifyCertificateId(sampleId);
      });
    });
  }
});
