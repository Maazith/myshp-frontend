# Fixing Product Creation 500 Error

## Issue
HTTP 500: Internal Server Error when trying to save a product.

## Root Cause
The `hero_media` field in ProductSerializer was defined as a SerializerMethodField (read-only), which cannot accept file uploads.

## Fix Applied

1. **Updated ProductSerializer** to properly handle file uploads:
   - Changed `hero_media` from SerializerMethodField to FileField (for writing)
   - Added `hero_media_url` as SerializerMethodField (for reading)

2. **Improved Error Handling**:
   - Better error messages with detailed validation errors
   - Proper exception handling in ProductCreateView

## Next Steps

1. **Restart Backend Server** to apply changes
2. **Clear Browser Cache** (Ctrl+Shift+R)
3. **Try Creating Product Again**

## Required Fields for Product Creation

- **Title** (required)
- **Category** (must select from dropdown - required)
- **Base Price** (required)
- **Gender** (defaults to Unisex)
- **Description** (optional)
- **Hero Image** (optional)
- **Featured** checkbox (optional)

## If Error Persists

Check:
1. Is backend server running?
2. Are you logged in as admin?
3. Is category selected from dropdown (not typed)?
4. Are all required fields filled?

