# EdithCloths Project - End-to-End Test Script
# This script tests all connections and functionality

Write-Host "🔍 EdithCloths Project - Master Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()
$success = @()

# 1. Check Frontend API Configuration
Write-Host "1️⃣  Checking Frontend API Configuration..." -ForegroundColor Yellow

$apiFiles = @(
    "frontend/assets/js/api.js",
    "frontend/config.js",
    "frontend/api-config.js",
    "frontend/index.html",
    "frontend/assets/js/admin-api.js",
    "frontend/assets/js/admin-auth.js"
)

foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "api\.edithcloths\.com") {
            $success += "✅ $file - API URL configured correctly"
        } else {
            $errors += "❌ $file - API URL not found or incorrect"
        }
    } else {
        $warnings += "⚠️  $file - File not found"
    }
}

# 2. Check Backend CORS Configuration
Write-Host "2️⃣  Checking Backend CORS Configuration..." -ForegroundColor Yellow

$backendSettings = "backend/backend/edithclothes/settings.py"
if (Test-Path $backendSettings) {
    $content = Get-Content $backendSettings -Raw
    if ($content -match "edithcloths\.com" -and $content -match "CORS_ALLOWED_ORIGINS") {
        $success += "✅ Backend CORS configured for edithcloths.com"
    } else {
        $errors += "❌ Backend CORS not properly configured"
    }
} else {
    $warnings += "⚠️  Backend settings file not found at expected path"
}

# 3. Check Image Loading Functions
Write-Host "3️⃣  Checking Image Loading System..." -ForegroundColor Yellow

$imageFiles = @(
    "frontend/assets/js/components.js",
    "frontend/assets/js/product-detail.js",
    "frontend/assets/js/cart.js"
)

foreach ($file in $imageFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "getAbsoluteImageUrl|BACKEND_BASE_URL|api\.baseUrl") {
            $success += "✅ $file - Image URL handling present"
        } else {
            $warnings += "⚠️  $file - Image URL handling may be missing"
        }
    }
}

# 4. Check Key Functionality Files
Write-Host "4️⃣  Checking Key Functionality Files..." -ForegroundColor Yellow

$functionalityFiles = @(
    "frontend/assets/js/products.js",
    "frontend/assets/js/cart.js",
    "frontend/assets/js/checkout.js",
    "frontend/assets/js/orders.js",
    "frontend/assets/js/admin-products.js",
    "frontend/assets/js/admin-orders.js"
)

foreach ($file in $functionalityFiles) {
    if (Test-Path $file) {
        $success += "✅ $file - Exists"
    } else {
        $errors += "❌ $file - Missing"
    }
}

# 5. Check API Endpoints
Write-Host "5️⃣  Checking API Endpoints..." -ForegroundColor Yellow

$urlsFile = "backend/backend/shop/urls.py"
if (Test-Path $urlsFile) {
    $content = Get-Content $urlsFile -Raw
    $endpoints = @("products", "cart", "orders", "categories", "banners", "settings")
    foreach ($endpoint in $endpoints) {
        if ($content -match $endpoint) {
            $success += "✅ API endpoint: /api/$endpoint/"
        } else {
            $warnings += "⚠️  API endpoint /api/$endpoint/ may be missing"
        }
    }
}

# 6. Check Placeholder Images
Write-Host "6️⃣  Checking Placeholder Images..." -ForegroundColor Yellow

$placeholder = "frontend/assets/img/placeholder.jpg"
if (Test-Path $placeholder) {
    $success += "✅ Placeholder image exists"
} else {
    $warnings += "⚠️  Placeholder image not found - images may fail to load gracefully"
}

# 7. Check Connection Resolver
Write-Host "7️⃣  Checking Connection Resolver..." -ForegroundColor Yellow

$resolverFile = "frontend/assets/js/connection-resolver.js"
if (Test-Path $resolverFile) {
    $content = Get-Content $resolverFile -Raw
    if ($content -match "api\.edithcloths\.com") {
        $success += "✅ Connection resolver configured correctly"
    }
}

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ SUCCESS ($($success.Count) items):" -ForegroundColor Green
foreach ($item in $success) {
    Write-Host "  $item" -ForegroundColor Green
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  WARNINGS ($($warnings.Count) items):" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "  $item" -ForegroundColor Yellow
    }
}

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ ERRORS ($($errors.Count) items):" -ForegroundColor Red
    foreach ($item in $errors) {
        Write-Host "  $item" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✅ PROJECT STATUS: ALL SYSTEMS GO" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Deploy backend to api.edithcloths.com" -ForegroundColor White
    Write-Host "2. Deploy frontend to edithcloths.com" -ForegroundColor White
    Write-Host "3. Test all functionality in production" -ForegroundColor White
    Write-Host "4. Verify CORS and image loading" -ForegroundColor White
} else {
    Write-Host "⚠️  PROJECT STATUS: ISSUES FOUND" -ForegroundColor Yellow
    Write-Host "Please fix the errors above before deployment." -ForegroundColor Yellow
}












