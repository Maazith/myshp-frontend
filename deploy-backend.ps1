# PowerShell script to prepare and deploy backend to Render
# Run this from the project root directory

Write-Host "🚀 Backend Deployment Preparation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend\render.yaml")) {
    Write-Host "❌ Error: backend\render.yaml not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found backend configuration files" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "📋 Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git not initialized or not in a git repository" -ForegroundColor Yellow
    Write-Host ""
    $initGit = Read-Host "Initialize git repository? (y/n)"
    if ($initGit -eq "y") {
        git init
        Write-Host "✅ Git initialized" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Git repository found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Current Git status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "🔍 Verifying deployment files..." -ForegroundColor Yellow

$files = @(
    "backend\render.yaml",
    "backend\build.sh",
    "backend\start.sh",
    "backend\requirements.txt",
    "backend\Procfile",
    "backend\manage.py"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - MISSING!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Some required files are missing. Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All required files are present!" -ForegroundColor Green
Write-Host ""

# Check if there are uncommitted changes
$uncommitted = git diff --quiet 2>&1
$untracked = git ls-files --others --exclude-standard

if ($uncommitted -or $untracked) {
    Write-Host "📦 You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host ""
    
    $commit = Read-Host "Commit changes now? (y/n)"
    if ($commit -eq "y") {
        $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Prepare for Render deployment"
        }
        
        git add .
        git commit -m $commitMessage
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🌐 GitHub Remote Check..." -ForegroundColor Yellow
$remotes = git remote -v 2>&1
if ($remotes -like "*origin*") {
    Write-Host "✅ GitHub remote configured:" -ForegroundColor Green
    git remote -v | Select-String "origin"
    Write-Host ""
    
    $push = Read-Host "Push to GitHub now? (y/n)"
    if ($push -eq "y") {
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Push failed. You may need to set upstream:" -ForegroundColor Yellow
            Write-Host "   git push -u origin main" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  No GitHub remote configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To connect to GitHub:" -ForegroundColor Cyan
    Write-Host "  1. Create a repository on GitHub" -ForegroundColor White
    Write-Host "  2. Run: git remote add origin https://github.com/USERNAME/REPO.git" -ForegroundColor White
    Write-Host "  3. Run: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Render Dashboard: https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Click 'New +' → 'Blueprint'" -ForegroundColor White
Write-Host "3. Select your GitHub repository" -ForegroundColor White
Write-Host "4. Click 'Apply' and wait 10 minutes" -ForegroundColor White
Write-Host "5. Set environment variables (see DEPLOY_EVERYTHING.md)" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full guide: DEPLOY_EVERYTHING.md" -ForegroundColor Cyan
Write-Host "⚡ Quick guide: DEPLOY_NOW.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Preparation complete!" -ForegroundColor Green

