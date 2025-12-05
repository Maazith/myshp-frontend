#!/usr/bin/env python3
"""
End-to-End Project Verification Script
Verifies all files are in correct locations and project structure is valid
"""
import os
from pathlib import Path

ROOT = Path(__file__).parent
FRONTEND = ROOT / "frontend"
BACKEND = ROOT / "backend"

def check_file_exists(path, description):
    """Check if file exists"""
    if path.exists():
        print(f"[OK] {description}: {path}")
        return True
    else:
        print(f"[FAIL] {description}: {path} - NOT FOUND")
        return False

def verify_structure():
    """Verify project structure"""
    print("=" * 60)
    print("Project Structure Verification")
    print("=" * 60)
    
    errors = []
    
    # Check directories
    print("\nChecking directories...")
    dirs = {
        FRONTEND: "Frontend directory",
        BACKEND: "Backend directory",
        FRONTEND / "admin": "Frontend admin pages",
        FRONTEND / "pages": "Frontend user pages",
        FRONTEND / "assets": "Frontend assets",
        FRONTEND / "assets" / "css": "Frontend CSS",
        FRONTEND / "assets" / "js": "Frontend JavaScript",
        BACKEND / "edithclothes": "Django project",
        BACKEND / "shop": "Django shop app",
        BACKEND / "templates": "Django templates",
        BACKEND / "shop" / "static" / "admin" / "css": "Admin CSS",
    }
    
    for path, desc in dirs.items():
        if not path.exists():
            print(f"[FAIL] {desc}: {path} - NOT FOUND")
            errors.append(f"Missing directory: {path}")
        else:
            print(f"[OK] {desc}: {path}")
    
    # Check critical files
    print("\nChecking critical files...")
    files = {
        # Frontend
        FRONTEND / "index.html": "Frontend index",
        FRONTEND / "assets" / "css" / "style.css": "Frontend CSS",
        FRONTEND / "assets" / "js" / "api.js": "API client",
        FRONTEND / "vercel.json": "Vercel config",
        
        # Backend
        BACKEND / "manage.py": "Django manage.py",
        BACKEND / "edithclothes" / "settings.py": "Django settings",
        BACKEND / "edithclothes" / "urls.py": "Django URLs",
        BACKEND / "shop" / "static" / "admin" / "css" / "custom_admin.css": "Admin CSS",
        BACKEND / "templates" / "admin" / "base_site.html": "Admin base template",
        BACKEND / "templates" / "registration" / "login.html": "Login template",
        BACKEND / "render.yaml": "Render config",
        BACKEND / "requirements.txt": "Python dependencies",
        BACKEND / "build.sh": "Build script",
        BACKEND / "start.sh": "Start script",
    }
    
    for path, desc in files.items():
        if not check_file_exists(path, desc):
            errors.append(f"Missing file: {path}")
    
    # Check for unwanted root files
    print("\nChecking for unwanted root files...")
    unwanted = ["pages", "admin", "assets"]
    for item in unwanted:
        path = ROOT / item
        if path.exists():
            print(f"⚠️  Unwanted directory in root: {path}")
            errors.append(f"Unwanted directory: {path}")
    
    # Summary
    print("\n" + "=" * 60)
    if errors:
        print(f"❌ Found {len(errors)} issues:")
        for error in errors:
            print(f"   - {error}")
        return False
    else:
        print("Project structure is valid!")
        print("\nSummary:")
        print(f"   Frontend files: {len(list(FRONTEND.rglob('*.html')))} HTML files")
        print(f"   Backend Python: {len(list(BACKEND.rglob('*.py')))} Python files")
        print(f"   Documentation: {len(list((ROOT / 'docs').glob('*.md')))} markdown files")
        return True

if __name__ == "__main__":
    success = verify_structure()
    exit(0 if success else 1)

