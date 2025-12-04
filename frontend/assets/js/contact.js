import { api } from './api.js';

/**
 * CONTACT PAGE CONFIGURATION
 * 
 * To update WhatsApp and Instagram:
 * 1. WhatsApp: Update whatsappNumber below with your number
 *    - Format: Country code + number (no spaces, dashes, or +)
 *    - Example: +91 98765 43210 → 919876543210
 * 
 * 2. Instagram: Update instagramUsername below with your username
 *    - Format: Username without @ symbol
 *    - Example: @mybrand → mybrand
 */

// Default values - will be loaded from SiteSettings
let whatsappNumber = '6381902506'; // Default fallback
let instagramUsername = 'edithcloths5'; // Default fallback

// Load contact information from site settings
const loadContactInfo = async () => {
  try {
    const settings = await api.getSettings();
    
    // Get WhatsApp number from whatsapp_number field or contact_phone
    if (settings.whatsapp_number) {
      // Remove any +, spaces, or dashes from phone number
      whatsappNumber = settings.whatsapp_number.replace(/[\s\-\+\(\)]/g, '');
    } else if (settings.contact_phone) {
      whatsappNumber = settings.contact_phone.replace(/[\s\-\+\(\)]/g, '');
    }
    
    // Get Instagram username from instagram_link field
    if (settings.instagram_link) {
      // Remove @ if present and extract username
      instagramUsername = settings.instagram_link.replace(/^@/, '').trim();
      console.log('📸 Instagram username loaded:', instagramUsername);
    }
    
    // Update contact info display
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const addressEl = document.getElementById('contact-address');
    
    if (emailEl) {
      emailEl.innerHTML = `<strong>Email:</strong> ${settings.contact_email || 'edith0530s@gmail.com'}`;
    }
    if (phoneEl) {
      // Format phone number nicely if available
      const phone = settings.contact_phone || settings.whatsapp_number || '6381902506';
      const formattedPhone = phone ? (phone.length === 10 ? `+91 ${phone}` : phone) : 'Not available';
      phoneEl.innerHTML = `<strong>Phone:</strong> ${formattedPhone}`;
    }
    if (addressEl) {
      const defaultAddress = 'M.SUDHAN RAJ, 35/1 sivan sannadhi street keeranur (PT) kulathur (TK) Pudukkottai (DT) 622502';
      addressEl.innerHTML = `<strong>Address:</strong> ${settings.contact_address || defaultAddress}`;
    }
  } catch (err) {
    console.error('Error loading contact info:', err);
    // Use defaults
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const addressEl = document.getElementById('contact-address');
    
    if (emailEl) emailEl.innerHTML = '<strong>Email:</strong> edith0530s@gmail.com';
    if (phoneEl) phoneEl.innerHTML = '<strong>Phone:</strong> +91 6381902506';
    if (addressEl) addressEl.innerHTML = '<strong>Address:</strong> M.SUDHAN RAJ, 35/1 sivan sannadhi street keeranur (PT) kulathur (TK) Pudukkottai (DT) 622502';
  }
};

// Setup WhatsApp link
const setupWhatsApp = () => {
  const whatsappLink = document.getElementById('whatsapp-link');
  if (whatsappLink) {
    // Create WhatsApp URL - opens chat in WhatsApp Web or App
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I need help with my order from EdithCloths.')}`;
    whatsappLink.href = whatsappUrl;
    
    // Also make the whole card clickable
    const chatbox = document.getElementById('whatsapp-chatbox');
    if (chatbox) {
      chatbox.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          window.open(whatsappUrl, '_blank');
        }
      });
    }
  }
};

// Setup Instagram link
const setupInstagram = () => {
  const instagramLink = document.getElementById('instagram-link');
  if (instagramLink) {
    // Create Instagram URL - ensure username is clean
    const cleanUsername = instagramUsername.trim().replace(/^@/, '').replace(/\/$/, '');
    const instagramUrl = `https://www.instagram.com/${cleanUsername}/`;
    console.log('📸 Setting Instagram URL:', instagramUrl);
    instagramLink.href = instagramUrl;
    
    // Also make the whole card clickable
    const chatbox = document.getElementById('instagram-chatbox');
    if (chatbox) {
      chatbox.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          window.open(instagramUrl, '_blank');
        }
      });
    }
  }
};

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
  // Load settings first, then setup links
  await loadContactInfo();
  // Setup links after settings are loaded (with updated values)
  setupWhatsApp();
  setupInstagram();
});

