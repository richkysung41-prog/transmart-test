# Deployment Checklist & Troubleshooting

## ✅ Pre-Deployment Checklist

### Database
- [ ] Database `transmart_db` sudah created
- [ ] Semua tables sudah di-import dari `database.sql`
- [ ] MySQL username dan password benar
- [ ] Koneksi database tested dan OK

### Configuration
- [ ] `config/database.php` sudah dikonfigurasi dengan benar
- [ ] `config/config.php` sudah disesuaikan untuk environment
- [ ] `SITE_URL` sudah correct
- [ ] Security keys sudah di-update (ENCRYPTION_KEY, JWT_SECRET)

### Directories & Permissions
- [ ] Folder `assets/uploads/` sudah created
- [ ] Folder `logs/` sudah created
- [ ] `chmod 755 assets/uploads/`
- [ ] `chmod 755 logs/`

### Backend Files
- [ ] Semua API files ada di `/api/`
  - [ ] `auth.php`
  - [ ] `products.php`
  - [ ] `categories.php`
  - [ ] `cart.php`
  - [ ] `orders.php`
  - [ ] `users.php`
  - [ ] `homepage.php`
  - [ ] `api_helper.php`
- [ ] Config files ada
  - [ ] `config.php`
  - [ ] `database.php`
  - [ ] `functions.php`

### Frontend Files
- [ ] HTML files ada di `/pages/`
- [ ] CSS files ada di `/assets/css/`
- [ ] JavaScript files ada di `/assets/js/`
- [ ] Images ada di `/assets/img/`

### Testing
- [ ] Database connection tested: `php test_database.php`
- [ ] API endpoints tested: `./test_api.sh` atau Postman
- [ ] Login/Register working
- [ ] Products showing correctly
- [ ] Cart operations working
- [ ] Orders can be created

### Documentation
- [ ] `BACKEND_SETUP.md` reviewed
- [ ] `BACKEND_QUICK_REFERENCE.md` reviewed
- [ ] API endpoints documented
- [ ] `FRONTEND_BACKEND_INTEGRATION.md` for developers

---

## 🚀 Deployment Steps

### 1. Local Development
```bash
cd /home/dobot/dobot-project/transmart-test

# Make scripts executable
chmod +x start_backend.sh
chmod +x test_api.sh

# Test database
php test_database.php

# Start server
./start_backend.sh
# OR
php -S localhost:8000

# Access
# http://localhost:8000
```

### 2. Local Testing with Postman
```bash
# Import collection
1. Open Postman
2. Import > Select Transmart_API.postman_collection.json
3. Create Environment with base_url = http://localhost:8000
4. Test all endpoints
```

### 3. Production Deployment

#### Apache Setup
```bash
# Copy project to web root
sudo cp -r transmart-test /var/www/html/transmart-project

# Set permissions
sudo chown -R www-data:www-data /var/www/html/transmart-project
sudo chmod 755 /var/www/html/transmart-project
sudo chmod 755 /var/www/html/transmart-project/assets/uploads
sudo chmod 755 /var/www/html/transmart-project/logs

# Enable mod_rewrite
sudo a2enmod rewrite

# Create VirtualHost
sudo nano /etc/apache2/sites-available/transmart.conf
```

VirtualHost config:
```apache
<VirtualHost *:80>
    ServerName transmart.local
    ServerAlias www.transmart.local
    DocumentRoot /var/www/html/transmart-project
    
    <Directory /var/www/html/transmart-project>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/transmart_error.log
    CustomLog ${APACHE_LOG_DIR}/transmart_access.log combined
</VirtualHost>
```

Enable:
```bash
sudo a2ensite transmart.conf
sudo systemctl restart apache2
```

#### Nginx Setup (Alternative)
```nginx
server {
    listen 80;
    server_name transmart.local;
    root /var/www/html/transmart-project;
    
    index index.html index.php;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\. {
        deny all;
    }
}
```

### 4. Environment Variables (Production)
Update `config/config.php`:
```php
// Production
define('DEVELOPMENT', false);
define('SITE_URL', 'https://transmart.com');

// Use environment variables
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'transmart_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

### 5. SSL/HTTPS
```bash
# Using Let's Encrypt & Certbot
sudo apt install certbot python3-certbot-apache

sudo certbot --apache -d transmart.com -d www.transmart.com
```

---

## 🔍 Troubleshooting

### ❌ Error: Database connection failed

**Symptoms:**
- API returns database connection error
- Cannot login or view products

**Solutions:**
```bash
# 1. Check MySQL is running
sudo service mysql status

# 2. Check credentials
mysql -u root -p transmart_db

# 3. Check database file
php test_database.php

# 4. Check config/database.php settings
cat config/database.php | grep "private"

# 5. Check MySQL user has correct permissions
mysql -u root -p
mysql> GRANT ALL PRIVILEGES ON transmart_db.* TO 'root'@'localhost';
mysql> FLUSH PRIVILEGES;
```

### ❌ Error: CORS Error in Browser Console

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...'
has been blocked by CORS policy
```

**Solution:**
The API headers are already set. If still getting CORS:

Update API headers (in each api file):
```php
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN'] ?? '*');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
```

### ❌ Error: 404 Not Found on API endpoints

**Symptoms:**
- API calls return 404
- Page not found error

**Solutions:**
```bash
# 1. Check API files exist
ls -la api/

# 2. Check .htaccess (if using Apache rewrite)
cat .htaccess

# 3. Create if missing
cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
</IfModule>
EOF

# 4. Enable mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### ❌ Error: File Upload Failed

**Symptoms:**
- Cannot upload product images
- Error: "Failed to upload file"

**Solutions:**
```bash
# 1. Check uploads directory exists
ls -la assets/uploads/

# 2. Create if missing
mkdir -p assets/uploads
chmod 755 assets/uploads

# 3. Check PHP upload settings
php -i | grep upload

# 4. Check max file size in config/config.php
# Default: 5MB (5242880 bytes)

# 5. If needed, update php.ini
sudo nano /etc/php/7.4/apache2/php.ini
# Find and update:
# upload_max_filesize = 50M
# post_max_size = 50M
```

### ❌ Error: Session Not Working / 401 Unauthorized

**Symptoms:**
- Login successful but then get 401 on other endpoints
- Cart operations fail with 401
- Orders cannot be created

**Solutions:**
```bash
# 1. Check sessions are enabled in php.ini
php -i | grep "Session Support"

# 2. Check session save path exists and writable
php -i | grep "session.save_path"
ls -la /var/lib/php/sessions/

# 3. Test with curl (include cookies)
curl -c /tmp/cookies.txt -b /tmp/cookies.txt \
  -X POST http://localhost:8000/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@example.com","password":"password123"}'

# 4. Verify config/config.php starts session
cat config/config.php | grep "session_start"
```

### ❌ Error: 500 Internal Server Error

**Symptoms:**
- API returns 500 error
- No useful error message

**Solutions:**
```bash
# 1. Check error log
tail -f logs/error.log
# Or
tail -f /var/log/apache2/error.log

# 2. Check PHP syntax
php -l config/functions.php
php -l api/products.php

# 3. Enable debug mode temporarily
nano config/config.php
# Set DEVELOPMENT = true

# 4. Check database query (use error_log)
# In functions.php, errors are logged
```

### ❌ Error: Products/Categories not showing

**Symptoms:**
- Get empty product list
- API returns success but no data
- Categories list empty

**Solutions:**
```bash
# 1. Check data in database
mysql -u root -p transmart_db
mysql> SELECT COUNT(*) FROM products;
mysql> SELECT COUNT(*) FROM categories;

# 2. If empty, import sample data
mysql -u root -p transmart_db < database.sql

# 3. Check API query
# Test with direct SQL
mysql -u root -p transmart_db << EOF
SELECT p.*, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id 
LIMIT 5;
EOF

# 4. Test API endpoint
curl "http://localhost:8000/api/products.php?action=get_all"
```

### ❌ Error: Cannot create order

**Symptoms:**
- Order creation fails
- Cart is empty when trying to checkout
- Error: "No items in order"

**Solutions:**
```bash
# 1. Check cart items exist
mysql -u root -p transmart_db
mysql> SELECT * FROM cart WHERE user_id = 2;

# 2. Check product stock
mysql> SELECT id, name, stock FROM products WHERE stock > 0;

# 3. Check order creation logic
tail -f logs/error.log

# 4. Test via API
curl -X POST http://localhost:8000/api/orders.php?action=create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "shipping_address": "Test Address",
    "payment_method": "bank_transfer",
    "items": [{"product_id": 1, "quantity": 1}]
  }'
```

---

## 📊 Performance Optimization

### 1. Database Indexing
```sql
-- Check indexes
SHOW INDEXES FROM products;

-- Add indexes if missing
ALTER TABLE products ADD INDEX idx_category (category_id);
ALTER TABLE cart ADD INDEX idx_user (user_id);
ALTER TABLE orders ADD INDEX idx_user (user_id);
```

### 2. Query Optimization
```php
// Instead of N+1 queries
// ❌ WRONG:
$products = getAllResults("SELECT * FROM products");
foreach ($products as $p) {
    $cat = getSingleResult("SELECT * FROM categories WHERE id = ?", [$p['category_id']]);
}

// ✅ RIGHT:
$products = getAllResults("
    SELECT p.*, c.name as category_name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
");
```

### 3. Pagination
```php
// Always paginate large result sets
$limit = 12;
$page = (int)($_GET['page'] ?? 1);
$offset = ($page - 1) * $limit;

$sql = "SELECT * FROM products LIMIT :limit OFFSET :offset";
```

### 4. Caching (Optional)
```php
// Simple caching with file
function getCachedProducts($cache_key, $duration = 3600) {
    $cache_file = "cache/$cache_key.json";
    
    if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $duration) {
        return json_decode(file_get_contents($cache_file), true);
    }
    
    // Fetch fresh data
    $data = getAllResults("SELECT * FROM products");
    
    // Cache it
    @mkdir('cache', 0755);
    file_put_contents($cache_file, json_encode($data));
    
    return $data;
}
```

---

## 🔐 Security Checklist

- [ ] SQL Injection protected (using prepared statements) ✅
- [ ] XSS protected (using htmlspecialchars) ✅
- [ ] CSRF protection implemented
- [ ] Password hashing using bcrypt ✅
- [ ] Input validation on all endpoints ✅
- [ ] Rate limiting implemented
- [ ] HTTPS enabled in production
- [ ] Environment variables used for secrets
- [ ] File upload validation ✅
- [ ] Authentication required for sensitive operations ✅

---

## 📈 Monitoring & Logs

### Check Application Logs
```bash
# Application errors
tail -f logs/error.log

# Activity log
tail -f logs/activity.log

# Web server errors
tail -f /var/log/apache2/error.log

# Web server access
tail -f /var/log/apache2/access.log
```

### Monitor Database
```bash
# Connection logs
mysql -u root -p -e "SHOW PROCESSLIST;"

# Slow queries (if enabled)
tail -f /var/log/mysql/slow.log

# Check database size
mysql -u root -p transmart_db -e "
  SELECT 
    TABLE_NAME,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = 'transmart_db';
"
```

---

## 🔄 Backup & Recovery

### Backup Database
```bash
# Full backup
mysqldump -u root -p transmart_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with gzip compression
mysqldump -u root -p transmart_db | gzip > backup.sql.gz

# Automated backup (cron job)
# 0 2 * * * /usr/bin/mysqldump -u root -pPASSWORD transmart_db > /backups/transmart_$(date +\%Y\%m\%d).sql
```

### Restore Database
```bash
# From uncompressed backup
mysql -u root -p transmart_db < backup.sql

# From compressed backup
gunzip < backup.sql.gz | mysql -u root -p transmart_db
```

---

## 📋 Useful Commands

```bash
# Test PHP syntax
php -l api/products.php

# Clear logs
> logs/error.log

# Check open connections
lsof -i :8000

# Kill process on port 8000
kill -9 $(lsof -t -i :8000)

# Check disk space
df -h

# Check memory usage
free -h

# Server uptime
uptime
```

---

**Last Updated:** 25 November 2024
