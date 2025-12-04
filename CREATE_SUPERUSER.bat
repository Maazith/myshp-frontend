@echo off
echo ========================================
echo Creating Admin Superuser
echo ========================================
echo.

cd backend

echo Creating superuser with credentials:
echo   Username: Maazith
echo   Email: maazith.md@gmail.com
echo   Password: maazith2005
echo.

python manage.py shell <<EOF
from django.contrib.auth.models import User

# Check if user exists
if User.objects.filter(username='Maazith').exists():
    user = User.objects.get(username='Maazith')
    print("User 'Maazith' already exists.")
    print("Resetting password...")
    user.set_password('maazith2005')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("✓ Password reset and privileges set!")
else:
    print("Creating new superuser...")
    User.objects.create_superuser(
        username='Maazith',
        email='maazith.md@gmail.com',
        password='maazith2005'
    )
    print("✓ Superuser created successfully!")
EOF

echo.
echo ========================================
echo Done! You can now login with:
echo   Username: Maazith
echo   Password: maazith2005
echo ========================================
echo.
pause


