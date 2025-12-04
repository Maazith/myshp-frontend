@echo off
echo ========================================
echo Login Diagnostic Test
echo ========================================
echo.

cd backend

echo [1] Checking Django installation...
python -c "import django; print('✓ Django installed')" 2>nul || (echo ✗ Django not found & pause & exit)

echo.
echo [2] Checking/Creating superuser...
python manage.py shell <<PYTHON
from django.contrib.auth.models import User
username = 'Maazith'
password = 'maazith2005'

user = User.objects.filter(username=username).first()
if user:
    if user.check_password(password):
        print(f"✓ User '{username}' exists with correct password")
    else:
        print(f"⚠ Password wrong - resetting...")
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"✓ Password reset to '{password}'")
else:
    print(f"✗ User '{username}' not found - creating...")
    User.objects.create_superuser(username, 'maazith.md@gmail.com', password)
    print(f"✓ Superuser created!")
print(f"\nLogin credentials:")
print(f"  Username: {username}")
print(f"  Password: {password}")
PYTHON

echo.
echo [3] Testing API endpoint...
echo Starting server for 5 seconds to test...
echo.
echo ========================================
echo IMPORTANT: Start the server manually:
echo   cd backend
echo   python manage.py runserver
echo ========================================
echo.
echo Then try login with:
echo   Username: Maazith
echo   Password: maazith2005
echo.
pause


