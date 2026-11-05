/* ==========================================================================
   ALOKA GREEN COUNTY — LANDING PAGE TRACKING & LEAD CONVERSION ENGINE (app.js)
   UTM & Click ID Session Capture | Dual-Action Submission | Smart WhatsApp Tagging
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

// Expose captureUTMs globally
window.captureUTMs = function() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  utmKeys.forEach(key => {
    if (params.has(key)) {
      sessionStorage.setItem(key, params.get(key));
    }
  });
};

// Retrieve stored UTMs with fallback defaults
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
        // Fallback for simple string replacement if URL parser fails on relative formats
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

// Helper to format detailed summary message for Google Sheet & CRM
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

// 2. Dual-Action Submission (Zero-Lead Loss)
window.handleFormSubmit = function(event, formName) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const form = event && event.target ? event.target : document.getElementById('modal-lead-form');
  const formData = form ? new FormData(form) : new FormData();

  // Anti-Bot Honeypot Trap
  const trapField = formData.get('b_trap_security');
  if (trapField) {
    console.warn('Automated bot submission prevented.');
    return;
  }

  const utms = getStoredUTMs();

  // Extract form fields with robust fallbacks
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

  // Payload for n8n Webhook & Google Sheets Ingestion Engine
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

  // 1. Send lead instantly to Google Sheet Sync Webhook (auto-appends to 1KSPI2Jp48zhpCJf2MKTGtOq9AYsAkNtg3hE15v-PeN4)
  fetch('https://n8n-bcko.srv1763383.hstgr.cloud/webhook/website-property-enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      interest: effectiveFormName === 'Site Visit Booking' ? 'Site Visit Booking' : (plotSize !== 'Residential Plot' ? plotSize : effectiveFormName),
      submitted: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    })
  }).then(res => {
    console.log('Lead successfully appended to Google Sheet (WEB Property Enquiries).');
  }).catch(err => {
    console.error('Google Sheet webhook sync notice:', err);
  });

  // 2. Also send to Master Ingestion Engine
  fetch('https://n8n-bcko.srv1763383.hstgr.cloud/webhook/website-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => {
    console.log('Lead successfully synced to master aggregator.');
  }).catch(err => {
    console.error('Master lead webhook notice:', err);
  });

  // Secondary backup: Apps Script Google Sheet & Laravel API
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

  // Open WhatsApp synchronously in user activation context to avoid popup blocker
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

  // 6. Smooth redirect to Thank You page
  setTimeout(() => {
    const thankYouParams = new URLSearchParams({
      name: customerName,
      intent: intent
    });
    if (plotSize && plotSize !== 'Residential Plot') thankYouParams.set('plot', plotSize);
    window.location.href = `thank-you.html?${thankYouParams.toString()}`;
  }, 750);
};

// Alias handleLeadSubmit to handleFormSubmit for backwards compatibility
window.handleLeadSubmit = function(event, source) {
  const formName = source || 'Website Modal Form';
  return window.handleFormSubmit(event, formName);
};

// Initialize WhatsApp link decoration on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateWhatsAppLinksWithUTMs();
  });
}
