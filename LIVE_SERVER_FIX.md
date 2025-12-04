# 🔧 Live Server Configuration Fix

## Problem
Error: `Cannot GET /admin/login.html`

This happens when Live Server's root directory is not set correctly.

## Solution

### Option 1: Set Live Server Root to `frontend` Folder

1. **In VS Code**:
   - Right-click on the `frontend` folder in the Explorer
   - Select "Open with Live Server"
   - This sets `frontend` as the root directory

2. **Or manually configure**:
   - Open VS Code settings (Ctrl+,)
   - Search for "Live Server"
   - Find "Live Server > Settings: Root"
   - Set it to: `/${workspaceFolder}/frontend`

### Option 2: Access from Root Directory

If Live Server root is set to the project root (`myshp`), use:
- `http://127.0.0.1:5500/frontend/admin/login.html`

### Option 3: Quick Test

1. Make sure you're running Live Server from the `frontend` folder:
   - Right-click `frontend` folder → "Open with Live Server"
   
2. Then access:
   - `http://127.0.0.1:5500/admin/login.html`
   - Or: `http://127.0.0.1:5500/index.html` (landing page)

## Correct File Structure

```
myshp/
  └── frontend/          ← Live Server root should be here
      ├── index.html
      ├── admin/
      │   └── login.html
      ├── pages/
      │   └── login.html
      └── assets/
```

## Verify

1. Open `http://127.0.0.1:5500/index.html` - should show landing page
2. Click "Admin Login" - should navigate to admin login
3. Or directly go to `http://127.0.0.1:5500/admin/login.html`

## If Still Not Working

1. **Check Live Server port**: Look at VS Code bottom-right corner for the port number
2. **Restart Live Server**: Right-click → "Stop Live Server" then start again
3. **Check file exists**: Verify `frontend/admin/login.html` file exists
4. **Use absolute path**: Try `http://127.0.0.1:5500/frontend/admin/login.html`


