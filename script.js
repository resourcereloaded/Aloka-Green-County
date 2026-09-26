/* ==========================================================================
   ALOKA GREEN COUNTY — LUXURY INTERACTIVE JAVASCRIPT
   Lead Modal Engine, Parallax Slider, PDF Download Trigger, Orbit Tabs & FAQ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavDrawer();
  initLeadModalTriggers();
  initFaqAccordion();
  initConversionClickTracking();
  initCaptcha();
  updateEmiCalculation();
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
    openLeadModal('Exclusive VIP Offer & Brochure', 'vip-offer', 'collaterals/brochure.pdf');
  };

  // 1. Time-based trigger: Display after 7 seconds
  const autoTimer = setTimeout(() => {
    triggerPopup('timer');
  }, 7000);

  // 2. Scroll-based trigger: Display when visitor scrolls past 25% of the page
  const handleScrollPopup = () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPercent = (window.scrollY / scrollTotal) * 100;
      if (scrollPercent >= 25) {
        window.removeEventListener('scroll', handleScrollPopup);
        clearTimeout(autoTimer);
        triggerPopup('scroll');
      }
    }
  };

  window.addEventListener('scroll', handleScrollPopup, { passive: true });
}

function openLeadModal(title, intent, filePath = '') {
  const modal = document.getElementById('lead-modal');
  const titleEl = document.getElementById('modal-dynamic-title');
  const subtitleEl = document.getElementById('modal-dynamic-subtitle');
  const intentInput = document.getElementById('modal-intent-input');
  const fileInput = document.getElementById('modal-file-input');

  const formState = document.getElementById('modal-form-state');
  const successState = document.getElementById('modal-success-state');

  // Mark as shown so auto timer doesn't fire again
  autoPopupTriggered = true;
  sessionStorage.setItem('aloka_popup_shown', 'true');

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
  } else if (intent === 'vip-offer') {
    titleEl.textContent = 'Unlock Exclusive VIP Launch Pricing';
    subtitleEl.textContent = 'Enter your details to receive instant brochure download & limited-period price benefits.';
  } else {
    titleEl.textContent = title;
    subtitleEl.textContent = 'Enter your contact info for an instant response from developer team.';
  }

  intentInput.value = intent;
  fileInput.value = filePath;

  // Refresh captcha every time modal is opened
  initCaptcha();

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLeadModal() {
  const modal = document.getElementById('lead-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Set session flag on close
  sessionStorage.setItem('aloka_popup_shown', 'true');
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

  // 1. Anti-Bot Honeypot Trap (Silently stops automated bots)
  const trapField = formData.get('b_trap_security');
  if (trapField) {
    console.warn('Automated bot submission prevented.');
    return;
  }

  // 2. Interactive Math Security Challenge Validation
  const captchaInput = document.getElementById('modal-captcha-input');
  const captchaAlert = document.getElementById('modal-captcha-alert');
  if (captchaInput) {
    const userAnswer = parseInt(captchaInput.value.trim(), 10);
    if (isNaN(userAnswer) || userAnswer !== currentCaptchaSum) {
      if (captchaAlert) captchaAlert.style.display = 'flex';
      captchaInput.focus();
      initCaptcha();
      return;
    }
    if (captchaAlert) captchaAlert.style.display = 'none';
  }

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

  // --- 1. Send Lead to Google Sheet (Primary Integration) ---
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwAcMvdocc23oCn_gHv9v5U_M8vs-mV0RtEaZm-2RRM-PAIMCsCi07mCppL2ANJ080x/exec';

  const sheetPayload = {
    name: name,
    phone: phone,
    email: email || '',
    plotSize: plotSize || 'Not Specified',
    intent: intent,
    source: source,
    message: `Preferred Plot: ${plotSize} | Intent: ${intent} | Source: greencounty.alokadevelopers.com (${source})`
  };

  try {
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(sheetPayload)
    }).then(() => {
      console.log('Lead successfully recorded to Google Sheet');
    }).catch(err => {
      console.warn('Google Sheet sync notice:', err);
    });
  } catch (err) {
    console.warn('Google Sheet post error:', err);
  }

  // --- 2. Background Sync to Laravel Admin Panel ---
  try {
    const postFormData = new FormData();
    postFormData.append('name', name);
    postFormData.append('phone', phone);
    postFormData.append('email', email || 'enquiry@greencounty.alokadevelopers.com');
    postFormData.append('interest', intent === 'site-visit' ? 'Site Visit' : 'Pricing & Brochure');
    postFormData.append('message', `Preferred Plot: ${plotSize} | Intent: ${intent} | Source: greencounty.alokadevelopers.com (${source})`);

    fetch('https://alokadevelopers.com/api/landing-enquiry', {
      method: 'POST',
      body: postFormData,
      mode: 'cors'
    }).catch(() => {
      // Ignore background errors
    });
  } catch (err) {
    // Ignore background errors
  }

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

  // --- Google Analytics 4 & Meta Pixel Lead Conversion Tracking ---
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      event_category: 'Lead Form',
      event_label: intent,
      value: 1,
      plot_size: plotSize,
      lead_source: source
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

  showToast(`Thank you ${name}! Enquiry submitted successfully.`);
  form.reset();

  // Redirect to Dedicated Conversion Thank You Page
  setTimeout(() => {
    const thankYouParams = new URLSearchParams({
      name: name,
      intent: intent,
      plot: plotSize
    });
    window.location.href = `thank-you.html?${thankYouParams.toString()}`;
  }, 500);
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
   10. CLICK CONVERSION TRACKING (WHATSAPP & PHONE CALLS)
   -------------------------------------------------------------------------- */
function initConversionClickTracking() {
  // Track WhatsApp button & link clicks
  document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, .mobile-btn-whatsapp').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          event_category: 'Direct Contact',
          event_label: 'WhatsApp Chat',
          method: 'WhatsApp'
        });
      }
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', {
          content_name: 'WhatsApp Click'
        });
      }
    });
  });

  // Track Direct Phone Call clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          event_category: 'Direct Contact',
          event_label: 'Phone Call',
          method: 'Phone'
        });
      }
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', {
          content_name: 'Phone Call Click'
        });
      }
    });
  });
}
