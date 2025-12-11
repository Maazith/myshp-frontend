# Script to delete all products and banners from the database
# Run this from the project root directory

Write-Host "🗑️  Deleting All Test Products and Banners" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""

# Find the correct backend path
$backendPath = $null
$possiblePaths = @(
    "backend\backend\backend",
    "backend\backend",
    "backend"
)

foreach ($path in $possiblePaths) {
    if (Test-Path "$path\manage.py") {
        $backendPath = $path
        Write-Host "✅ Found backend at: $backendPath" -ForegroundColor Green
        break
    }
}

if (-not $backendPath) {
    Write-Host "❌ Error: Could not find backend directory with manage.py" -ForegroundColor Red
    Write-Host "Please ensure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "⚠️  WARNING: This will delete ALL products and banners permanently!" -ForegroundColor Red
Write-Host ""
$confirm = Read-Host "Type 'DELETE ALL' to confirm"

if ($confirm -ne "DELETE ALL") {
    Write-Host "❌ Cancelled. No data was deleted." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🗑️  Deleting products and banners..." -ForegroundColor Yellow

# Change to backend directory and run the delete command
Push-Location $backendPath

try {
    $output = python manage.py shell -c @"
from shop.models import Product, Banner
products_count = Product.objects.count()
banners_count = Banner.objects.count()
Product.objects.all().delete()
Banner.objects.all().delete()
print(f'✅ Deleted {products_count} product(s) and {banners_count} banner(s)')
"@

    Write-Host $output -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ All test data deleted successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error deleting data: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "🔄 Please refresh your admin page to see the changes." -ForegroundColor Cyan





