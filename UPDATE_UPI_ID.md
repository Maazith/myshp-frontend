# How to Update UPI ID

The UPI ID is stored in `SiteSettings` and can be updated in three ways:

---

## Option 1: Via Django Admin Panel (Easiest)

1. **Login to Admin Panel:**
   - Go to: `https://myshp-backend.onrender.com/edith-admin-login/`
   - Login with admin credentials

2. **Navigate to Site Settings:**
   - Click on **"Site Settings"** in the admin panel
   - Or go directly to: `https://myshp-backend.onrender.com/edith-admin-login/shop/sitesettings/1/change/`

3. **Update UPI ID:**
   - Find the **"Payment Settings"** section
   - Update the **"UPI ID"** field
   - Click **"Save"**

4. **Update QR Code (Optional):**
   - Upload a new QR code image in the **"QR Code Image"** field
   - The QR code should match your UPI ID

---

## Option 2: Via Management Command (For Production)

**On Render (via Shell):**

1. Go to Render Dashboard → Your Backend Service → Shell
2. Run:
   ```bash
   python manage.py update_upi_id --upi-id YOUR_UPI_ID@bank
   ```

**Example:**
```bash
python manage.py update_upi_id --upi-id maazith.md@oksbi
```

---

## Option 3: Via API (Programmatic)

**Update via API (Admin only):**

```bash
PUT https://myshp-backend.onrender.com/api/settings/update
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "upi_id": "YOUR_UPI_ID@bank"
}
```

---

## Current UPI ID

The UPI ID is currently set in the database. To check the current value:

1. **Via Admin Panel:** Go to Site Settings
2. **Via API:** `GET https://myshp-backend.onrender.com/api/settings/`
3. **Via Command:** Check the database directly

---

## Notes

- The UPI ID is displayed on the payment page
- The QR code should match the UPI ID
- Changes take effect immediately after saving
- The frontend loads the UPI ID from `/api/settings/` endpoint

---

## Default Fallback

If no UPI ID is set in the database, the frontend uses:
- **Default:** `maazith.md@oksbi`

This is defined in `frontend/assets/js/payment.js` as a fallback.










