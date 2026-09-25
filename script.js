/* ==========================================================================
   ALOKA GREEN COUNTY — LUXURY INTERACTIVE JAVASCRIPT
   Lead Modal Engine, Parallax Slider, PDF Download Trigger, Orbit Tabs & FAQ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavDrawer();
  initLeadModalTriggers();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. MOBILE NAVIGATION DRAWER & TOGGLE ENGINE
   -------------------------------------------------------------------------- */
function initMobileNavDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  overlay.addEventListener('click', closeDrawer);

  // Close when clicking any nav link or action button inside the drawer
  const drawerLinks = drawer.querySelectorAll('.mobile-nav-item, .mobile-btn-sitevisit, .mobile-btn-enquire, .mobile-btn-whatsapp');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small timeout so action/modal triggers cleanly before drawer slides away
      setTimeout(closeDrawer, 150);
    });
  });

  // Also close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   2. LEAD CAPTURE MODAL & TRIGGER LOGIC
   -------------------------------------------------------------------------- */
function initLeadModalTriggers() {
  const modalTriggers = document.querySelectorAll('.trigger-lead-modal');
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Enquire Now';
      const intent = btn.getAttribute('data-intent') || 'enquiry';
      const filePath = btn.getAttribute('data-file') || '';

      openLeadModal(title, intent, filePath);
    });
  });
}

function openLeadModal(title, intent, filePath = '') {
  const modal = document.getElementById('lead-modal');
  const titleEl = document.getElementById('modal-dynamic-title');
  const subtitleEl = document.getElementById('modal-dynamic-subtitle');
  const intentInput = document.getElementById('modal-intent-input');
  const fileInput = document.getElementById('modal-file-input');

  const formState = document.getElementById('modal-form-state');
  const successState = document.getElementById('modal-success-state');

  // Reset states
  formState.style.display = 'block';
  successState.style.display = 'none';

  // Customize modal copy based on intent
  if (intent === 'brochure') {
    titleEl.textContent = 'Download Project Brochure (PDF)';
    subtitleEl.textContent = 'Enter your details to receive instant brochure download & pricing sheet.';
  } else if (intent === 'layout-plan') {
    titleEl.textContent = 'Download Master Layout Plan (PDF)';
    subtitleEl.textContent = 'Get the full 43-plot high-resolution master layout map.';
  } else if (intent === 'site-visit') {
    titleEl.textContent = 'Schedule Free Site Visit with Pick-up';
    subtitleEl.textContent = 'Choose your preferred date and our team will arrange complimentary pick-up.';
  } else if (intent === 'corner-plot') {
    titleEl.textContent = 'Check Corner Plot Availability';
    subtitleEl.textContent = 'Corner plots are limited! Drop your contact details for instant status.';
  } else if (intent.includes('price')) {
    titleEl.textContent = 'Get Complete Cost Sheet & Plot Pricing';
    subtitleEl.textContent = 'Receive plot price matrix, payment schedule & government charges break-up.';
  } else {
    titleEl.textContent = title;
    subtitleEl.textContent = 'Enter your contact info for an instant response from developer team.';
  }

  intentInput.value = intent;
  fileInput.value = filePath;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLeadModal() {
  const modal = document.getElementById('lead-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLeadModal();
    closeLightbox();
  }
});

/* --------------------------------------------------------------------------
   3. LEAD SUBMISSION & AUTOMATIC FILE DOWNLOAD
   -------------------------------------------------------------------------- */
function handleLeadSubmit(event, source = 'Form') {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const name = formData.get('name') || '';
  const phone = formData.get('phone') || '';
  const email = formData.get('email') || '';
  const plotSize = formData.get('plot_size') || '30x40';
  const intent = formData.get('intent') || 'enquiry';
  const filePath = formData.get('file_path') || '';

  // Save Lead in LocalStorage for offline record
  const leadObj = {
    id: 'LEAD_' + Date.now(),
    name,
    phone,
    email,
    plotSize,
    intent,
    source,
    timestamp: new Date().toISOString()
  };

  const existingLeads = JSON.parse(localStorage.getItem('aloka_leads') || '[]');
  existingLeads.push(leadObj);
  localStorage.setItem('aloka_leads', JSON.stringify(existingLeads));

  console.log('New Lead Captured:', leadObj);

  // Trigger File Download if requested
  if (filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (intent === 'brochure') {
    const link = document.createElement('a');
    link.href = './01_Projects/01_Aloka_Green_County/collaterals/Aloka Green County - Brochure.pdf';
    link.download = 'Aloka Green County - Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (intent === 'layout-plan') {
    const link = document.createElement('a');
    link.href = './01_Projects/01_Aloka_Green_County/collaterals/Aloka Green County - Layout Plan.pdf';
    link.download = 'Aloka Green County - Layout Plan.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Update Success State inside Modal
  const formState = document.getElementById('modal-form-state');
  const successState = document.getElementById('modal-success-state');
  const successMsg = document.getElementById('success-message-text');
  const whatsappLink = document.getElementById('success-whatsapp-link');

  if (formState && successState) {
    formState.style.display = 'none';
    successState.style.display = 'block';

    const cleanMsg = `Thank you ${name}! Your request has been confirmed. ${filePath || intent.includes('brochure') || intent.includes('layout') ? 'Your PDF file download has started automatically.' : 'Our team will contact you shortly.'}`;
    if (successMsg) successMsg.textContent = cleanMsg;

    const waText = encodeURIComponent(`Hi Aloka Developers, my name is ${name}. I just requested ${intent} on the website. Please share full plot details.`);
    if (whatsappLink) whatsappLink.href = `https://wa.me/919187969708?text=${waText}`;

    // Show Lead Modal if submitted from Hero form
    if (source === 'Hero Form') {
      openLeadModal('Request Confirmed', intent);
      document.getElementById('modal-form-state').style.display = 'none';
      document.getElementById('modal-success-state').style.display = 'block';
    }
  }

  showToast(`Thank you ${name}! Enquiry submitted successfully.`);
  form.reset();
}

/* --------------------------------------------------------------------------
   4. CONNECTIVITY ORBIT TABS SWITCHER
   -------------------------------------------------------------------------- */
function switchOrbitTab(tabId) {
  const tabs = document.querySelectorAll('.orbit-tab-btn');
  const panels = document.querySelectorAll('.orbit-content-panel');

  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));

  const activeTab = Array.from(tabs).find(t => t.getAttribute('onclick').includes(tabId));
  const activePanel = document.getElementById(`orbit-${tabId}`);

  if (activeTab) activeTab.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION ENGINE
   -------------------------------------------------------------------------- */
function initFaqAccordion() {}

function toggleFaq(btn) {
  const faqItem = btn.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  if (!isActive) {
    faqItem.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   6. LIGHTBOX IMAGE VIEWER
   -------------------------------------------------------------------------- */
function openLightbox(imgSrc, title = '') {
  const lightbox = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (!lightbox || !img) return;

  img.src = imgSrc;
  img.alt = title;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) lightbox.classList.remove('active');
}

/* --------------------------------------------------------------------------
   7. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
