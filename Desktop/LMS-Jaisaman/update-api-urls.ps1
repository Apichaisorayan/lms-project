# PowerShell Script to update API URLs in Vue files
# Run this script: .\update-api-urls.ps1

Write-Host "🔄 Updating API URLs in Vue files..." -ForegroundColor Cyan

$files = @(
    "frontend\src\views\Register.vue",
    "frontend\src\views\Login.vue",
    "frontend\src\views\Dashboard.vue",
    "frontend\src\views\Courses.vue",
    "frontend\src\views\CourseLessons.vue",
    "frontend\src\views\CourseLearn.vue",
    "frontend\src\views\BrowseCourses.vue",
    "frontend\src\views\AuthCallback.vue",
    "frontend\src\views\QuizTake.vue",
    "frontend\src\views\QuizManage.vue",
    "frontend\src\views\LessonQuizzes.vue"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  📝 Updating $file" -ForegroundColor Yellow
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Replace hardcoded URLs
        $content = $content -replace "http://localhost:5000", '${API_URL}'
        $content = $content -replace "'http://localhost:5000/", '`${API_URL}/'
        $content = $content -replace '"http://localhost:5000/', '`${API_URL}/'
        $content = $content -replace "``http://localhost:5000/", '`${API_URL}/'
        
        # Check if import already exists
        if ($content -notmatch "import.*API_URL.*from.*config/api") {
            # Add import after other imports
            $content = $content -replace "(import.*from 'axios')", "`$1`nimport { API_URL, OAUTH_URLS } from '@/config/api'"
        }
        
        # Write back
        Set-Content $file -Value $content -NoNewline
        
        Write-Host "  ✅ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! All files updated." -ForegroundColor Green
Write-Host "`n⚠️  Please review the changes manually to ensure correctness." -ForegroundColor Yellow
Write-Host "   Some OAuth URLs might need to use OAUTH_URLS.google or OAUTH_URLS.facebook" -ForegroundColor Yellow
