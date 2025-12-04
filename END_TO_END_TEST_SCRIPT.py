"""
End-to-End Testing Script for EdithCloths E-Commerce Platform
This script simulates all user flows and verifies functionality
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"

# Test Results Storage
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_test(name, passed, message=""):
    """Log test results"""
    result = {
        "name": name,
        "status": "PASSED" if passed else "FAILED",
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    if passed:
        test_results["passed"].append(result)
        print(f"✅ PASS: {name}")
    else:
        test_results["failed"].append(result)
        print(f"❌ FAIL: {name} - {message}")
    if message and passed:
        print(f"   → {message}")

def log_warning(name, message):
    """Log warnings"""
    test_results["warnings"].append({
        "name": name,
        "message": message,
        "timestamp": datetime.now().isoformat()
    })
    print(f"⚠️  WARNING: {name} - {message}")

# Global variables to store tokens and IDs
user_token = None
admin_token = None
user_id = None
admin_id = None
product_id = None
category_id = None
order_id = None

print("=" * 80)
print("EDITHCLOTHS - END-TO-END TEST SIMULATION")
print("=" * 80)
print()

# ============================================================================
# TEST SUITE 1: AUTHENTICATION & USER MANAGEMENT
# ============================================================================
print("📋 TEST SUITE 1: AUTHENTICATION & USER MANAGEMENT")
print("-" * 80)

# Test 1.1: Register New User
print("\n1.1 Testing User Registration...")
try:
    register_data = {
        "username": f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "email": f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}@test.com",
        "password": "testpass123",
        "password2": "testpass123"
    }
    response = requests.post(f"{API_BASE}/auth/register", json=register_data)
    if response.status_code in [200, 201]:
        data = response.json()
        user_token = data.get("access")
        log_test("User Registration", True, f"User created: {register_data['username']}")
    else:
        log_test("User Registration", False, f"Status: {response.status_code}, {response.text}")
except Exception as e:
    log_test("User Registration", False, str(e))

# Test 1.2: User Login
print("\n1.2 Testing User Login...")
try:
    login_data = {
        "username": "Maazith",  # Using existing superuser
        "password": "maazith2005"
    }
    response = requests.post(f"{API_BASE}/auth/login", json=login_data)
    if response.status_code == 200:
        data = response.json()
        user_token = data.get("access")
        log_test("User Login", True, "Successfully logged in")
    else:
        log_test("User Login", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("User Login", False, str(e))

# Test 1.3: Get Current User Info
print("\n1.3 Testing Get User Info...")
try:
    headers = {"Authorization": f"Bearer {user_token}"} if user_token else {}
    response = requests.get(f"{API_BASE}/auth/me", headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        user_id = user_data.get("id")
        log_test("Get User Info", True, f"User: {user_data.get('username')}")
    else:
        log_test("Get User Info", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Get User Info", False, str(e))

# Test 1.4: Admin Login (if user is admin)
print("\n1.4 Testing Admin Access...")
try:
    if user_token:
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            is_admin = user_data.get("is_staff", False)
            if is_admin:
                admin_token = user_token
                admin_id = user_data.get("id")
                log_test("Admin Access", True, "User has admin privileges")
            else:
                log_warning("Admin Access", "User is not an admin - admin tests may be skipped")
        else:
            log_test("Admin Access", False, "Could not verify admin status")
except Exception as e:
    log_warning("Admin Access", str(e))

# ============================================================================
# TEST SUITE 2: PRODUCTS & CATEGORIES
# ============================================================================
print("\n" + "=" * 80)
print("📋 TEST SUITE 2: PRODUCTS & CATEGORIES")
print("-" * 80)

# Test 2.1: Get Categories
print("\n2.1 Testing Get Categories...")
try:
    response = requests.get(f"{API_BASE}/categories/")
    if response.status_code == 200:
        categories = response.json()
        if categories and len(categories) > 0:
            category_id = categories[0].get("id")
            log_test("Get Categories", True, f"Found {len(categories)} categories")
        else:
            log_warning("Get Categories", "No categories found")
    else:
        log_test("Get Categories", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Get Categories", False, str(e))

# Test 2.2: Get Products
print("\n2.2 Testing Get Products...")
try:
    response = requests.get(f"{API_BASE}/products/")
    if response.status_code == 200:
        products = response.json()
        if products and len(products) > 0:
            product_id = products[0].get("id")
            log_test("Get Products", True, f"Found {len(products)} products")
        else:
            log_warning("Get Products", "No products found")
    else:
        log_test("Get Products", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Get Products", False, str(e))

# Test 2.3: Get Product by ID/Slug
print("\n2.3 Testing Get Product Detail...")
if product_id:
    try:
        response = requests.get(f"{API_BASE}/products/{product_id}/")
        if response.status_code == 200:
            product = response.json()
            log_test("Get Product Detail", True, f"Product: {product.get('title', 'N/A')}")
        else:
            log_test("Get Product Detail", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Get Product Detail", False, str(e))

# Test 2.4: Create Category (Admin Only)
print("\n2.4 Testing Create Category (Admin)...")
if admin_token:
    try:
        category_data = {
            "name": f"Test Category {datetime.now().strftime('%H%M%S')}",
            "description": "Test category description"
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{API_BASE}/categories/add", json=category_data, headers=headers)
        if response.status_code in [200, 201]:
            log_test("Create Category (Admin)", True, "Category created successfully")
        else:
            log_test("Create Category (Admin)", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Create Category (Admin)", False, str(e))
else:
    log_warning("Create Category (Admin)", "Skipped - no admin token")

# ============================================================================
# TEST SUITE 3: CART FUNCTIONALITY
# ============================================================================
print("\n" + "=" * 80)
print("📋 TEST SUITE 3: CART FUNCTIONALITY")
print("-" * 80)

# Test 3.1: Get Cart
print("\n3.1 Testing Get Cart...")
if user_token:
    try:
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{API_BASE}/cart/", headers=headers)
        if response.status_code == 200:
            cart = response.json()
            log_test("Get Cart", True, f"Cart has {cart.get('total_items', 0)} items")
        else:
            log_test("Get Cart", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Get Cart", False, str(e))
else:
    log_warning("Get Cart", "Skipped - no user token")

# Test 3.2: Add Item to Cart
print("\n3.2 Testing Add to Cart...")
if user_token and product_id:
    try:
        # First, get product variants
        product_response = requests.get(f"{API_BASE}/products/{product_id}/")
        if product_response.status_code == 200:
            product = product_response.json()
            variants = product.get("variants", [])
            if variants:
                variant_id = variants[0].get("id")
                cart_data = {
                    "variant": variant_id,
                    "quantity": 1
                }
                headers = {"Authorization": f"Bearer {user_token}"}
                response = requests.post(f"{API_BASE}/cart/add", json=cart_data, headers=headers)
                if response.status_code in [200, 201]:
                    log_test("Add to Cart", True, "Item added to cart")
                else:
                    log_test("Add to Cart", False, f"Status: {response.status_code}, {response.text}")
            else:
                log_warning("Add to Cart", "Product has no variants")
        else:
            log_test("Add to Cart", False, "Could not fetch product")
    except Exception as e:
        log_test("Add to Cart", False, str(e))
else:
    log_warning("Add to Cart", "Skipped - no user token or product")

# ============================================================================
# TEST SUITE 4: ORDERS & PAYMENT
# ============================================================================
print("\n" + "=" * 80)
print("📋 TEST SUITE 4: ORDERS & PAYMENT")
print("-" * 80)

# Test 4.1: Checkout (Create Order)
print("\n4.1 Testing Checkout...")
if user_token:
    try:
        checkout_data = {
            "shipping_address": "123 Test Street, Test City, Test State, 12345"
        }
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.post(f"{API_BASE}/orders/checkout", json=checkout_data, headers=headers)
        if response.status_code in [200, 201]:
            order = response.json()
            order_id = order.get("id")
            log_test("Checkout", True, f"Order created: {order.get('order_number', 'N/A')}")
        else:
            log_test("Checkout", False, f"Status: {response.status_code}, {response.text}")
    except Exception as e:
        log_test("Checkout", False, str(e))
else:
    log_warning("Checkout", "Skipped - no user token or empty cart")

# Test 4.2: Confirm Payment
print("\n4.2 Testing Confirm Payment...")
if user_token and order_id:
    try:
        payment_data = {
            "order": order_id,
            "reference_id": f"TEST_REF_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "notes": "Test payment confirmation"
        }
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.post(f"{API_BASE}/orders/confirm-payment", json=payment_data, headers=headers)
        if response.status_code in [200, 201]:
            log_test("Confirm Payment", True, "Payment confirmed")
        else:
            log_test("Confirm Payment", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Confirm Payment", False, str(e))
else:
    log_warning("Confirm Payment", "Skipped - no order created")

# Test 4.3: Get My Orders
print("\n4.3 Testing Get My Orders...")
if user_token:
    try:
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{API_BASE}/orders/my-orders", headers=headers)
        if response.status_code == 200:
            orders = response.json()
            log_test("Get My Orders", True, f"Found {len(orders)} orders")
        else:
            log_test("Get My Orders", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Get My Orders", False, str(e))
else:
    log_warning("Get My Orders", "Skipped - no user token")

# ============================================================================
# TEST SUITE 5: ADMIN FUNCTIONS
# ============================================================================
print("\n" + "=" * 80)
print("📋 TEST SUITE 5: ADMIN FUNCTIONS")
print("-" * 80)

# Test 5.1: Get All Orders (Admin)
print("\n5.1 Testing Get All Orders (Admin)...")
if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{API_BASE}/orders/", headers=headers)
        if response.status_code == 200:
            orders = response.json()
            log_test("Get All Orders (Admin)", True, f"Found {len(orders)} total orders")
        else:
            log_test("Get All Orders (Admin)", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Get All Orders (Admin)", False, str(e))
else:
    log_warning("Get All Orders (Admin)", "Skipped - no admin token")

# Test 5.2: Mark Order as Paid (Admin)
print("\n5.2 Testing Mark Order as Paid (Admin)...")
if admin_token and order_id:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{API_BASE}/orders/{order_id}/mark-paid", headers=headers)
        if response.status_code == 200:
            log_test("Mark Order as Paid (Admin)", True, "Order marked as paid")
        else:
            log_test("Mark Order as Paid (Admin)", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Mark Order as Paid (Admin)", False, str(e))
else:
    log_warning("Mark Order as Paid (Admin)", "Skipped - no admin token or order")

# Test 5.3: Update Order Status (Admin)
print("\n5.3 Testing Update Order Status (Admin)...")
if admin_token and order_id:
    try:
        status_data = {"status": "SHIPPED"}
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{API_BASE}/orders/{order_id}/status", json=status_data, headers=headers)
        if response.status_code == 200:
            log_test("Update Order Status (Admin)", True, "Order status updated")
        else:
            log_test("Update Order Status (Admin)", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Update Order Status (Admin)", False, str(e))
else:
    log_warning("Update Order Status (Admin)", "Skipped - no admin token or order")

# ============================================================================
# TEST SUITE 6: SITE SETTINGS & BANNERS
# ============================================================================
print("\n" + "=" * 80)
print("📋 TEST SUITE 6: SITE SETTINGS & BANNERS")
print("-" * 80)

# Test 6.1: Get Site Settings
print("\n6.1 Testing Get Site Settings...")
try:
    response = requests.get(f"{API_BASE}/settings/")
    if response.status_code == 200:
        settings = response.json()
        log_test("Get Site Settings", True, "Site settings retrieved")
    else:
        log_test("Get Site Settings", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Get Site Settings", False, str(e))

# Test 6.2: Get Banners
print("\n6.2 Testing Get Banners...")
try:
    response = requests.get(f"{API_BASE}/banners/")
    if response.status_code == 200:
        banners = response.json()
        log_test("Get Banners", True, f"Found {len(banners)} banners")
    else:
        log_test("Get Banners", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Get Banners", False, str(e))

# ============================================================================
# TEST SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("📊 TEST SUMMARY")
print("=" * 80)

total_tests = len(test_results["passed"]) + len(test_results["failed"])
passed_count = len(test_results["passed"])
failed_count = len(test_results["failed"])
warning_count = len(test_results["warnings"])

print(f"\nTotal Tests: {total_tests}")
print(f"✅ Passed: {passed_count}")
print(f"❌ Failed: {failed_count}")
print(f"⚠️  Warnings: {warning_count}")

if failed_count > 0:
    print(f"\n❌ FAILED TESTS:")
    for test in test_results["failed"]:
        print(f"   - {test['name']}: {test['message']}")

if warning_count > 0:
    print(f"\n⚠️  WARNINGS:")
    for warning in test_results["warnings"]:
        print(f"   - {warning['name']}: {warning['message']}")

# Save results to file
results_file = "test_results.json"
with open(results_file, "w") as f:
    json.dump(test_results, f, indent=2)

print(f"\n📄 Detailed results saved to: {results_file}")
print("\n" + "=" * 80)
print("END OF TEST SIMULATION")
print("=" * 80)


