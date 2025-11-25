# Backend Development Quick Reference

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Clone/Navigate to project
cd /home/dobot/dobot-project/transmart-test

# Make script executable
chmod +x start_backend.sh
chmod +x test_api.sh

# Start server
./start_backend.sh
# OR manually
php -S localhost:8000
```

### 2. Test Database
```bash
php test_database.php
```

### 3. Run API Tests
```bash
./test_api.sh
```

---

## 📁 Directory Structure

```
project/
├── api/                          # REST API Endpoints
│   ├── api_helper.php           # Helper functions (CORS, response, validation)
│   ├── auth.php                 # Auth endpoints (login, register, logout)
│   ├── cart.php                 # Cart operations
│   ├── categories.php           # Category management
│   ├── homepage.php             # Homepage data
│   ├── orders.php               # Order management
│   ├── products.php             # Product management
│   ├── users.php                # User profile
│   └── admin/
│       └── dashboard.php        # Admin dashboard
│
├── config/
│   ├── config.php              # Global configuration
│   ├── database.php            # Database connection class
│   └── functions.php           # TransmartFunctions class (business logic)
│
├── assets/
│   └── uploads/                # User-uploaded files
│
├── logs/                        # Application logs
│
└── includes/                    # Reusable templates
    ├── header.html
    ├── footer.html
    └── navigation.html
```

---

## 🔌 API Endpoints Overview

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints
```
POST /api/auth.php?action=register     # Create new account
POST /api/auth.php?action=login        # Login user
POST /api/auth.php?action=logout       # Logout user
```

### Product Endpoints
```
GET  /api/products.php?action=get_all        # All products with pagination
GET  /api/products.php?action=detail&id=1   # Single product detail
GET  /api/products.php?action=by_category   # Filter by category
GET  /api/products.php?action=search        # Search products
```

### Category Endpoints
```
GET  /api/categories.php?action=get_all     # All categories
```

### Cart Endpoints
```
GET  /api/cart.php?action=get&user_id=2    # Get cart items
POST /api/cart.php?action=add               # Add item to cart
PUT  /api/cart.php?action=update            # Update quantity
DELETE /api/cart.php?action=remove          # Remove item
```

### Order Endpoints
```
POST /api/orders.php?action=create          # Create order
GET  /api/orders.php?action=get_user_orders # User's orders
GET  /api/orders.php?action=detail          # Order detail
```

### Homepage Endpoints
```
GET  /api/homepage.php?section=all          # All homepage data
GET  /api/homepage.php?section=featured     # Featured products
GET  /api/homepage.php?section=categories   # Categories
```

### User Endpoints
```
GET  /api/users.php                         # Current user profile
GET  /api/users.php?id=2                    # Specific user (admin only)
PUT  /api/users.php                         # Update profile
DELETE /api/users.php                       # Delete account
```

---

## 💾 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | id, email, password, role |
| products | Product catalog | id, name, price, stock, category_id |
| categories | Product categories | id, name, description |
| cart | Shopping cart items | id, user_id, product_id, quantity |
| orders | Customer orders | id, user_id, order_number, status |
| order_items | Items in orders | id, order_id, product_id, quantity |
| banners | Homepage banners | id, title, image_url |
| discounts | Discount codes | id, code, discount_percent |

---

## 🔐 Authentication

### Login Flow
```bash
curl -X POST http://localhost:8000/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "customer"
  }
}
```

### Session Management
- Uses PHP Sessions (`$_SESSION`)
- Sessions stored server-side
- Cookies sent automatically
- Expires on browser close or timeout

---

## 🛒 Common API Calls

### Get Featured Products
```bash
curl "http://localhost:8000/api/homepage.php?section=featured"
```

### Search for Products
```bash
curl "http://localhost:8000/api/products.php?action=search&keyword=headphone"
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/orders.php?action=create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "shipping_address": "Jl. Budi No. 123",
    "payment_method": "bank_transfer",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 1}
    ]
  }'
```

---

## 🛠️ Development Tips

### 1. Add New API Endpoint
```php
// 1. Create method in config/functions.php (TransmartFunctions class)
public static function newFunction($param) {
    $data = getSingleResult("SELECT * FROM table WHERE id = :id", ['id' => $param]);
    return $data;
}

// 2. Create API file at api/newfeature.php
require_once '../config/config.php';
require_once '../config/functions.php';

$action = $_GET['action'] ?? 'default';

switch($action) {
    case 'get':
        $result = TransmartFunctions::newFunction($_GET['id']);
        jsonResponse(['success' => true, 'data' => $result]);
        break;
}
```

### 2. Validate Input
```php
// Use these functions from api_helper.php
sanitizeInput($data);           // Remove HTML/scripts
validateEmail($email);          // Validate email format
validatePhone($phone);          // Validate phone number
```

### 3. Handle Errors
```php
jsonResponse(['error' => 'Message'], 400);  // 400 Bad Request
jsonResponse(['error' => 'Unauthorized'], 401);  // 401 Unauthorized
jsonResponse(['error' => 'Forbidden'], 403);  // 403 Forbidden
jsonResponse(['error' => 'Not Found'], 404);  // 404 Not Found
jsonResponse(['error' => 'Server Error'], 500);  // 500 Server Error
```

### 4. Database Queries
```php
// Get single result
$user = getSingleResult(
    "SELECT * FROM users WHERE email = :email",
    ['email' => $email]
);

// Get multiple results
$products = getAllResults(
    "SELECT * FROM products WHERE category_id = :cat",
    ['cat' => $category_id]
);

// Insert data
$user_id = insertRecord('users', [
    'name' => $name,
    'email' => $email,
    'password' => $password_hash
]);

// Update data
updateRecord(
    'users',
    ['name' => $new_name],
    'id = :id',
    ['id' => $user_id]
);
```

### 5. Debug
```php
// Log to file
error_log("Debug message: " . print_r($data, true));

// Log activity
logActivity('user_login', 'User logged in successfully', $user_id);

// Check file for logs
tail -f logs/activity.log
tail -f logs/error.log
```

---

## 🧪 Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Transmart_API.postman_collection.json`

2. **Set Environment Variables:**
   - Click gear icon > Manage Environments
   - Create "Development" environment
   - Add: `base_url = http://localhost:8000`

3. **Test Endpoints:**
   - Click on endpoint
   - Modify parameters as needed
   - Click Send

---

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
```bash
# Check MySQL is running
sudo service mysql status

# Check credentials in config/database.php
# Test connection
php test_database.php
```

### Issue: "CORS Error"
**Solution:**
- Headers already set in `api_helper.php`
- Update `Access-Control-Allow-Origin` for production

### Issue: File upload fails
**Solution:**
```bash
# Create uploads directory
mkdir -p assets/uploads

# Set permissions
chmod 755 assets/uploads

# Check server has write permission
touch assets/uploads/test.txt && rm assets/uploads/test.txt
```

### Issue: Session not working
**Solution:**
```php
// Make sure session_start() is called first
// In config/config.php, it's already done
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
```

---

## 📊 Sample Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@transmart.com | admin123 | Admin |
| budi@example.com | password123 | Customer |
| siti@example.com | password123 | Customer |

---

## 📝 Useful Commands

```bash
# Start server
php -S localhost:8000

# Test database connection
php test_database.php

# Run API tests
./test_api.sh

# View error log
tail -f logs/error.log

# View activity log
tail -f logs/activity.log

# Create backup
mysqldump -u root transmart_db > backup.sql

# Restore backup
mysql -u root transmart_db < backup.sql
```

---

## 🔗 Related Files

- **Setup Guide:** `BACKEND_SETUP.md`
- **API Postman Collection:** `Transmart_API.postman_collection.json`
- **Database Schema:** `database.sql`
- **Test Database:** `test_database.php`
- **Run Tests:** `test_api.sh`

---

## 📞 Support

For issues or questions:
1. Check logs in `logs/` directory
2. Run `test_database.php` to verify database
3. Run `test_api.sh` to test all endpoints
4. Check `BACKEND_SETUP.md` for detailed setup

**Last Updated:** November 25, 2024
