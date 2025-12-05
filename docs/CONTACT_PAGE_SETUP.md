# 📞 Contact Page Setup Guide

## ✅ What's Been Done

1. **Order Success Page Updated** ✅
   - Now shows "Payment Proof Received" message
   - Displays admin verification instructions
   - Explains the next steps clearly
   - Added link to Contact page for help

2. **Contact Page Created** ✅
   - Beautiful contact page with WhatsApp and Instagram chatboxes
   - Loads contact info from Site Settings (Email, Phone, Address)
   - Clickable chatbox cards for easy access
   - Responsive design matching the site theme

## 🔧 Configuring WhatsApp & Instagram

### Quick Setup (Temporary - Until Admin Settings Added)

Edit `frontend/assets/js/contact.js` and update these values:

```javascript
// Line 4-5
let whatsappNumber = '919876543210'; // Change to your WhatsApp number (country code + number, no +)
let instagramUsername = 'edithcloths'; // Change to your Instagram username
```

**Example:**
- WhatsApp: If your number is +91 98765 43210, use `919876543210`
- Instagram: If your username is `@mybrand`, use `mybrand` (without @)

### WhatsApp Number Format
- Remove all spaces, dashes, parentheses, and + sign
- Include country code without leading zero
- Example: `+91 98765 43210` → `919876543210`

### Instagram Username Format
- No @ symbol
- No spaces
- Example: `@mybrand` → `mybrand`

## 📱 How It Works

### WhatsApp Chatbox
- Clicking opens WhatsApp Web/App
- Pre-fills message: "Hello! I need help with my order from EdithCloths."
- Uses format: `https://wa.me/<number>?text=<message>`

### Instagram Chatbox
- Clicking opens Instagram profile
- Users can DM you from there
- Uses format: `https://www.instagram.com/<username>/`

## 🔮 Future Enhancement

We can add WhatsApp and Instagram fields to Site Settings so admins can configure them directly from Django Admin without code changes.

For now, update the values in `contact.js` as shown above.

---

**Ready to use!** Just update the WhatsApp number and Instagram username in `contact.js`! 🚀



