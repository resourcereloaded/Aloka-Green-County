/* ==========================================================================
   ALOKA GREEN COUNTY — LUXURY INTERACTIVE JAVASCRIPT
   Lead Modal Engine, Parallax Slider, PDF Download Trigger, Orbit Tabs & FAQ
   UTM & Click ID Tracking + Dual-Action Lead Engine
   ========================================================================== */

// 1. On page load: Store UTMs & Click IDs in session storage
(function captureUTMs() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    
    utmKeys.forEach(key => {
      if (params.has(key)) {
        sessionStorage.setItem(key, params.get(key));
      }
    });
  } catch (err) {
    console.warn('UTM capture notice:', err);
  }
})();

function getStoredUTMs() {
  try {
    return {
      source: sessionStorage.getItem('utm_source') || 'direct',
      medium: sessionStorage.getItem('utm_medium') || 'web',
      campaign: sessionStorage.getItem('utm_campaign') || 'Direct Website',
      content: sessionStorage.getItem('utm_content') || '-',
      term: sessionStorage.getItem('utm_term') || '-',
      fbclid: sessionStorage.getItem('fbclid') || '',
      gclid: sessionStorage.getItem('gclid') || ''
    };
  } catch (err) {
    return {
      source: 'direct',
      medium: 'web',
      campaign: 'Direct Website',
      content: '-',
      term: '-',
      fbclid: '',
      gclid: ''
    };
  }
}
window.getStoredUTMs = getStoredUTMs;

// Helper to append UTM Campaign & Content tag to any WhatsApp message string
function buildWhatsAppRefTag(utms) {
  const campaign = utms.campaign || 'Direct Website';
  const content = utms.content || '-';
  if (campaign !== 'Direct Website' || content !== '-') {
    return ` [Ref: ${campaign}_${content}]`;
  }
  return '';
}
window.buildWhatsAppRefTag = buildWhatsAppRefTag;

// Dynamically inject UTM reference into all static WhatsApp links across the page
function updateWhatsAppLinksWithUTMs() {
  try {
    const utms = getStoredUTMs();
    const refTag = buildWhatsAppRefTag(utms);
    if (!refTag) return;

    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      try {
        const rawUrl = link.getAttribute('href');
        if (!rawUrl || rawUrl.includes('[Ref:')) return;

        const url = new URL(rawUrl);
        const currentText = url.searchParams.get('text') || 'Hi Aloka Developers, I am interested in Aloka Green County.';
        url.searchParams.set('text', `${currentText.trim()}${refTag}`);
        link.setAttribute('href', url.toString());
      } catch (e) {
        if (link.href && !link.href.includes('[Ref:')) {
          link.href += encodeURIComponent(refTag);
        }
      }
    });
  } catch (err) {
    console.warn('WhatsApp link UTM injection notice:', err);
  }
}
window.updateWhatsAppLinksWithUTMs = updateWhatsAppLinksWithUTMs;

function buildLeadDetailMessage(formName, plotSize, visitDate, pickup, utms, email) {
  const parts = [];
  parts.push(`Enquiry: ${formName || 'Website Lead'}`);
  if (plotSize && plotSize !== 'Residential Plot') parts.push(`Plot: ${plotSize}`);
  if (visitDate) parts.push(`Visit Date: ${visitDate}`);
  if (pickup) parts.push(`Pickup Hub: ${pickup}`);
  if (email) parts.push(`Email: ${email}`);

  const utmParts = [];
  if (utms.source && utms.source !== 'direct') utmParts.push(`source: ${utms.source}`);
  if (utms.medium && utms.medium !== 'web') utmParts.push(`medium: ${utms.medium}`);
  if (utms.campaign && utms.campaign !== 'Direct Website') utmParts.push(`campaign: ${utms.campaign}`);
  if (utms.content && utms.content !== '-') utmParts.push(`content: ${utms.content}`);
  if (utms.term && utms.term !== '-') utmParts.push(`term: ${utms.term}`);
  if (utms.fbclid) utmParts.push(`fbclid: ${utms.fbclid}`);
  if (utms.gclid) utmParts.push(`gclid: ${utms.gclid}`);

  if (utmParts.length > 0) {
    parts.push(`UTMs: [${utmParts.join(', ')}]`);
  }
  return parts.join(' | ');
}
window.buildLeadDetailMessage = buildLeadDetailMessage;

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavDrawer();
  initLeadModalTriggers();
  initFaqAccordion();
  initConversionClickTracking();
  initCaptcha();
  updateEmiCalculation();
  updateWhatsAppLinksWithUTMs();
});

let currentCaptchaSum = 0;

function initCaptcha() {
  const questionEl = document.getElementById('modal-captcha-question');
  const inputEl = document.getElementById('modal-captcha-input');
  const alertEl = document.getElementById('modal-captcha-alert');

  if (!questionEl) return;

  const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const num2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  currentCaptchaSum = num1 + num2;

  questionEl.textContent = `${num1} + ${num2} = ?`;
  if (inputEl) inputEl.value = '';
  if (alertEl) alertEl.style.display = 'none';
}

function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

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

  // Initialize Smart Auto-Trigger (Timer & Scroll)
  initAutoPopup();
}

let autoPopupTriggered = false;

function initAutoPopup() {
  // Check if popup was already shown or dismissed in this session
  if (sessionStorage.getItem('aloka_popup_shown') === 'true') {
    return;
  }

  const triggerPopup = (reason = 'auto') => {
    if (autoPopupTriggered || sessionStorage.getItem('aloka_popup_shown') === 'true') return;

    const modal = document.getElementById('lead-modal');
    if (modal && modal.classList.contains('active')) return;

    autoPopupTriggered = true;
    sessionStorage.setItem('aloka_popup_shown', 'true');
    console.log(`Auto popup triggered via: ${reason}`);
    openLeadModal('Exclusive VIP Offer & Complete Price Sheet', 'vip-offer', 'collaterals/brochure.pdf');
  };

  // 1. Timed Trigger: 45 seconds after session start if no CTA clicked
  const autoTimer = setTimeout(() => {
    triggerPopup('timer_45s');
  }, 45000);

  // 2. Scroll-Triggered Popup: After 60% scroll depth (mobile & desktop)
  const handleScrollPopup = () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPercent = (window.scrollY / scrollTotal) * 100;
      if (scrollPercent >= 60) {
        window.removeEventListener('scroll', handleScrollPopup);
        clearTimeout(autoTimer);
        triggerPopup('scroll_60%');
      }
    }
  };
  window.addEventListener('scroll', handleScrollPopup, { passive: true });

  // 3. Desktop Exit-Intent Trigger: mouse leaves top of viewport (minimum 3s dwell time)
  const pageLoadedAt = Date.now();
  const handleExitIntent = (e) => {
    if (Date.now() - pageLoadedAt < 3000) return;
    if (navigator.webdriver) return;
    if (e.clientY <= 15 && e.relatedTarget == null) {
      document.removeEventListener('mouseleave', handleExitIntent);
      clearTimeout(autoTimer);
      triggerPopup('exit_intent');
    }
  };
  document.addEventListener('mouseleave', handleExitIntent);
}

function openLeadModal(title, intent, filePath = '') {
  const modal = document.getElementById('lead-modal');
  const titleEl = document.getElementById('modal-dynamic-title');
  const subtitleEl = document.getElementById('modal-dynamic-subtitle');
  const intentInput = document.getElementById('modal-intent-input');
  const fileInput = document.getElementById('modal-file-input');

  const formState = document.getElementById('modal-form-state');
  const successState = document.getElementById('modal-success-state');

  // Mark as shown so auto triggers don't fire again
  autoPopupTriggered = true;
  sessionStorage.setItem('aloka_popup_shown', 'true');

  // Reset states
  if (formState) formState.style.display = 'block';
  if (successState) successState.style.display = 'none';

  // Customize modal copy based on intent
  if (intent === 'brochure') {
    titleEl.textContent = 'Download Project Brochure (PDF)';
    subtitleEl.textContent = 'Enter your details to receive instant brochure download & pricing sheet.';
  } else if (intent === 'layout-plan') {
    titleEl.textContent = 'Download Master Layout Plan (PDF)';
    subtitleEl.textContent = 'Get the full 43-plot high-resolution master layout map.';
  } else if (intent === 'site-visit') {
    titleEl.textContent = 'Schedule Site Visit';
    subtitleEl.textContent = 'Enter your contact details to schedule your guided on-site visit with free cab pickup.';
  } else if (intent === 'corner-plot') {
    titleEl.textContent = 'Check Corner Plot Availability';
    subtitleEl.textContent = 'Corner plots are limited! Drop your contact details for instant status.';
  } else if (intent.includes('price')) {
    titleEl.textContent = 'Get Complete Cost Sheet & Plot Pricing';
    subtitleEl.textContent = 'Receive plot price matrix, payment schedule & government charges break-up.';
  } else if (intent === 'vip-offer') {
    titleEl.textContent = 'Unlock Exclusive VIP Launch Pricing';
    subtitleEl.textContent = 'Enter your details to receive instant brochure download & limited-period price benefits.';
  } else if (intent === 'loan-assistance' || intent.includes('loan')) {
    titleEl.textContent = 'Check Bank Loan Eligibility';
    subtitleEl.textContent = 'Pre-approved residential plot loans up to 80% available from HDFC, ICICI, IDBI & BOB.';
  } else {
    titleEl.textContent = title;
    subtitleEl.textContent = 'Enter your contact info for an instant response from developer team.';
  }

  if (intentInput) intentInput.value = intent;
  if (fileInput) fileInput.value = filePath;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLeadModal() {
  const modal = document.getElementById('lead-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  // Set session flag on close
  sessionStorage.setItem('aloka_popup_shown', 'true');
}

// Close modal when clicking on the backdrop
const leadModalContainer = document.getElementById('lead-modal');
if (leadModalContainer) {
  leadModalContainer.addEventListener('click', (e) => {
    if (e.target === leadModalContainer) {
      closeLeadModal();
    }
  });
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
/* --------------------------------------------------------------------------
   3. DUAL-ACTION LEAD SUBMISSION (ZERO-LEAD LOSS) & UTM TRACKING
   -------------------------------------------------------------------------- */
window.handleFormSubmit = function(event, formName) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const form = event && event.target ? event.target : document.getElementById('modal-lead-form');
  const formData = form ? new FormData(form) : new FormData();

  // 1. Anti-Bot Honeypot Trap
  const trapField = formData.get('b_trap_security');
  if (trapField) {
    console.warn('Automated bot submission prevented.');
    return;
  }

  const utms = getStoredUTMs();

  // Extract form fields with robust aliases
  const customerName = formData.get('fullName') || formData.get('name') || 'Customer';
  const customerPhone = formData.get('phone') || '';
  const customerEmail = formData.get('email') || '';
  const plotSize = formData.get('plotSize') || formData.get('plot_size') || 'Residential Plot';
  const visitDate = formData.get('visitDate') || formData.get('visit_date') || '';
  const pickupLocation = formData.get('pickupLocation') || formData.get('pickup') || '';
  const intent = formData.get('intent') || (formName === 'Site Visit Booking' ? 'site-visit' : 'enquiry');
  const filePath = formData.get('file_path') || '';

  const effectiveFormName = formName || (intent === 'site-visit' ? 'Site Visit Booking' : 'Website Enquiry');
  const detailedMessage = buildLeadDetailMessage(effectiveFormName, plotSize, visitDate, pickupLocation, utms, customerEmail);

  // Complete Payload with all UTMs, Click IDs, and Booking details
  const payload = {
    customer: customerName,
    name: customerName,
    phone: customerPhone,
    email: customerEmail,
    plot_size: plotSize,
    visit_date: visitDate,
    pickup: pickupLocation,
    property: 'Aloka Green County',
    enquiry_type: effectiveFormName,
    campaign: (utms.campaign && utms.campaign !== 'Direct Website') ? utms.campaign : effectiveFormName,
    message: detailedMessage,
    utm_source: utms.source,
    utm_medium: utms.medium,
    utm_campaign: utms.campaign,
    utm_content: utms.content,
    utm_term: utms.term,
    fbclid: utms.fbclid,
    gclid: utms.gclid,
    submitted_at: new Date().toISOString()
  };

  // 1. Send lead instantly to n8n webhook (background async POST)
  fetch('https://n8n-bcko.srv1763383.hstgr.cloud/webhook/website-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => {
    console.log('Lead successfully synced to n8n master ingestion engine.');
  }).catch(err => {
    console.error('Lead webhook error:', err);
  });

  // Secondary backup integrations (Google Apps Script & Laravel API)
  try {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwAcMvdocc23oCn_gHv9v5U_M8vs-mV0RtEaZm-2RRM-PAIMCsCi07mCppL2ANJ080x/exec';
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        plotSize: plotSize,
        intent: intent,
        source: utms.source || 'Website',
        message: detailedMessage
      })
    }).catch(() => {});
  } catch (e) {}

  try {
    const postFormData = new FormData();
    postFormData.append('name', customerName);
    postFormData.append('phone', customerPhone);
    postFormData.append('email', customerEmail || 'enquiry@greencounty.alokadevelopers.com');
    postFormData.append('interest', intent === 'site-visit' ? 'Site Visit' : 'Pricing & Brochure');
    postFormData.append('message', detailedMessage);
    fetch('https://alokadevelopers.com/api/landing-enquiry', {
      method: 'POST',
      body: postFormData,
      mode: 'cors'
    }).catch(() => {});
  } catch (e) {}

  // Local storage offline record
  try {
    const leadObj = {
      id: 'LEAD_' + Date.now(),
      ...payload
    };
    const existingLeads = JSON.parse(localStorage.getItem('aloka_leads') || '[]');
    existingLeads.push(leadObj);
    localStorage.setItem('aloka_leads', JSON.stringify(existingLeads));
  } catch (e) {}

  // 2. Build WhatsApp message with campaign tag attached
  let waMessage = `Hello Aloka Developers, my name is ${payload.customer} (Phone: ${payload.phone}). I am interested in Green County.`;
  if (effectiveFormName === 'Site Visit Booking' || payload.visit_date) {
    waMessage += ` Scheduling visit for ${payload.visit_date}${payload.pickup ? ' (Pickup: ' + payload.pickup + ')' : ''}.`;
  }
  waMessage += ` [Ref: ${utms.campaign}_${utms.content}]`;
  const waUrl = `https://wa.me/919187969708?text=${encodeURIComponent(waMessage)}`;

  // Open WhatsApp in user activation context to avoid browser popup blocker
  try {
    window.open(waUrl, '_blank');
  } catch (e) {
    console.warn('WhatsApp window open notice:', e);
  }

  // 3. Trigger File Download if requested (Brochure / Layout Plan)
  if (filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (intent === 'brochure') {
    const link = document.createElement('a');
    link.href = 'collaterals/brochure.pdf';
    link.download = 'Aloka Green County - Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (intent === 'layout-plan') {
    const link = document.createElement('a');
    link.href = 'collaterals/layout-plan.pdf';
    link.download = 'Aloka Green County - Layout Plan.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 4. Update Success State inside Modal
  const formState = document.getElementById('modal-form-state');
  const successState = document.getElementById('modal-success-state');
  const successMsg = document.getElementById('success-message-text');
  const whatsappLink = document.getElementById('success-whatsapp-link');

  if (formState && successState) {
    formState.style.display = 'none';
    successState.style.display = 'block';

    const cleanMsg = `Thank you ${customerName}! Your request has been confirmed. ${filePath || intent.includes('brochure') || intent.includes('layout') ? 'Your PDF file download has started automatically.' : 'Our team will contact you shortly.'}`;
    if (successMsg) successMsg.textContent = cleanMsg;

    if (whatsappLink) whatsappLink.href = waUrl;
  }

  // 5. Google Analytics 4, GTM & Meta Pixel Lead Conversion Tracking
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'form_submit',
      form_id: (form && form.id) || 'modal-lead-form',
      intent: intent,
      lead_source: utms.source,
      campaign: utms.campaign
    });
    window.dataLayer.push({
      event: 'generate_lead',
      intent: intent,
      value: 1,
      lead_source: utms.source,
      plot_size: plotSize
    });
  }

  if (typeof gtag === 'function') {
    gtag('event', 'form_submit', {
      event_category: 'Lead Form',
      event_label: intent,
      lead_source: utms.source
    });
    gtag('event', 'generate_lead', {
      event_category: 'Lead Form',
      event_label: intent,
      value: 1,
      lead_source: utms.source,
      plot_size: plotSize
    });
  }

  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {
      content_name: intent,
      content_category: plotSize,
      value: 1.00,
      currency: 'INR'
    });
  }

  if (typeof showToast === 'function') {
    showToast(`Thank you ${customerName}! Enquiry submitted successfully.`);
  }

  if (form && typeof form.reset === 'function') {
    form.reset();
  }

  // 6. Smooth redirect to Dedicated Conversion Thank You Page
  setTimeout(() => {
    const thankYouParams = new URLSearchParams({
      name: customerName,
      intent: intent
    });
    if (plotSize && plotSize !== 'Residential Plot') thankYouParams.set('plot', plotSize);
    window.location.href = `thank-you.html?${thankYouParams.toString()}`;
  }, 750);
};

// Backwards compatibility alias
window.handleLeadSubmit = function(event, source) {
  const formName = source || 'Modal Form';
  return window.handleFormSubmit(event, formName);
};

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

/* --------------------------------------------------------------------------
   9. PLOT LOAN & EMI CALCULATOR ENGINE
   -------------------------------------------------------------------------- */
function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(Math.round(val));
}

function setEmiPreset(plotCost, btnEl) {
  const plotCostSlider = document.getElementById('calc-plot-cost');
  if (plotCostSlider) {
    plotCostSlider.value = plotCost;
  }

  // Update active preset button style
  document.querySelectorAll('.calc-preset-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  updateEmiCalculation();
}

function updateEmiCalculation() {
  const costSlider = document.getElementById('calc-plot-cost');
  const downSlider = document.getElementById('calc-down-payment');
  const rateSlider = document.getElementById('calc-interest-rate');
  const tenureSlider = document.getElementById('calc-tenure-years');

  if (!costSlider || !downSlider || !rateSlider || !tenureSlider) return;

  const totalPlotCost = parseFloat(costSlider.value) || 3660000;
  const downPaymentPercent = parseFloat(downSlider.value) || 20;
  const interestRate = parseFloat(rateSlider.value) || 8.5;
  const tenureYears = parseFloat(tenureSlider.value) || 15;

  // Calculate Values
  const downPaymentAmount = totalPlotCost * (downPaymentPercent / 100);
  const principalAmount = totalPlotCost - downPaymentAmount;

  // Monthly Interest Rate (r) and Total Months (n)
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = tenureYears * 12;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  let monthlyEmi = 0;
  if (monthlyRate > 0) {
    monthlyEmi = (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyEmi = principalAmount / totalMonths;
  }

  const totalRepayment = monthlyEmi * totalMonths;
  const totalInterest = totalRepayment - principalAmount;

  // Percentages for Progress Bar
  const principalPercent = totalRepayment > 0 ? Math.round((principalAmount / totalRepayment) * 100) : 50;
  const interestPercent = 100 - principalPercent;

  // Update DOM Displays
  const costTxt = document.getElementById('calc-plot-cost-txt');
  const downPercentTxt = document.getElementById('calc-down-percent-txt');
  const downAmountTxt = document.getElementById('calc-down-amount-txt');
  const interestTxt = document.getElementById('calc-interest-txt');
  const tenureTxt = document.getElementById('calc-tenure-txt');

  const resultEmi = document.getElementById('result-monthly-emi');
  const resultPrincipal = document.getElementById('result-principal-val');
  const resultInterest = document.getElementById('result-interest-val');
  const resultTotal = document.getElementById('result-total-payment');

  const barPrincipal = document.getElementById('bar-principal');
  const barInterest = document.getElementById('bar-interest');
  const legendPrincipal = document.getElementById('legend-principal-percent');
  const legendInterest = document.getElementById('legend-interest-percent');

  if (costTxt) costTxt.textContent = `₹${formatINR(totalPlotCost)}`;
  if (downPercentTxt) downPercentTxt.textContent = `${downPaymentPercent}%`;
  if (downAmountTxt) downAmountTxt.textContent = `(₹${formatINR(downPaymentAmount)})`;
  if (interestTxt) interestTxt.textContent = `${interestRate.toFixed(1)}%`;
  if (tenureTxt) tenureTxt.textContent = `${tenureYears} Years`;

  if (resultEmi) resultEmi.textContent = formatINR(monthlyEmi);
  if (resultPrincipal) resultPrincipal.textContent = `₹${formatINR(principalAmount)}`;
  if (resultInterest) resultInterest.textContent = `₹${formatINR(totalInterest)}`;
  if (resultTotal) resultTotal.textContent = `₹${formatINR(totalRepayment)}`;

  if (barPrincipal) barPrincipal.style.width = `${principalPercent}%`;
  if (barInterest) barInterest.style.width = `${interestPercent}%`;
  if (legendPrincipal) legendPrincipal.textContent = `${principalPercent}%`;
  if (legendInterest) legendInterest.textContent = `${interestPercent}%`;
}

/* --------------------------------------------------------------------------
   10. CLICK CONVERSION TRACKING (WHATSAPP & PHONE CALLS — ISSUE 7 FIX)
   -------------------------------------------------------------------------- */
function initConversionClickTracking() {
  // Track WhatsApp button & link clicks
  document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, .mobile-btn-whatsapp').forEach(link => {
    link.addEventListener('click', function() {
      const sectionId = this.closest('section')?.id || 'header_or_floating';

      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
          content_name: 'WhatsApp Click',
          content_category: sectionId
        });
      }

      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: sectionId,
          method: 'WhatsApp'
        });
        gtag('event', 'contact', {
          event_category: 'Direct Contact',
          event_label: 'WhatsApp Chat',
          method: 'WhatsApp'
        });
      }

      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'whatsapp_click',
          click_location: sectionId
        });
      }
    });
  });

  // Track Direct Phone Call clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      const sectionId = this.closest('section')?.id || 'header_or_floating';

      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
          content_name: 'Phone Call Click',
          content_category: sectionId
        });
      }

      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call_click', {
          event_category: 'engagement',
          event_label: sectionId,
          method: 'Phone'
        });
        gtag('event', 'contact', {
          event_category: 'Direct Contact',
          event_label: 'Phone Call',
          method: 'Phone'
        });
      }

      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'phone_click',
          click_location: sectionId
        });
      }
    });
  });
}

