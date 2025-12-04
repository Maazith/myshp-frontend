@echo off
echo ========================================
echo Testing Login Setup
echo ========================================
echo.

cd backend

echo [1] Checking if Django is installed...
python -c "import django; print('Django version:', django.get_version())" 2>nul
if errorlevel 1 (
    echo ERROR: Django not found. Please install dependencies first.
    pause
    exit /b 1
)

echo.
echo [2] Checking if superuser exists...
python manage.py shell <<EOF
from django.contrib.auth.models import User
user = User.objects.filter(username='Maazith').first()
if user:
    print("✓ User 'Maazith' exists")
    print("  Email:", user.email)
    print("  Is staff:", user.is_staff)
    print("  Is superuser:", user.is_superuser)
    if user.check_password('maazith2005'):
        print("  ✓ Password is correct")
    else:
        print("  ✗ Password is WRONG - resetting...")
        user.set_password('maazith2005')
        user.save()
        print("  ✓ Password reset to 'maazith2005'")
else:
    print("✗ User 'Maazith' does not exist")
    print("Creating superuser...")
    User.objects.create_superuser('Maazith', 'maazith.md@gmail.com', 'maazith2005')
    print("✓ Superuser created!")
EOF

echo.
echo [3] Starting Django server...
echo Please open a new terminal to test login while server is running.
echo Press Ctrl+C to stop the server.
echo.
python manage.py runserver


