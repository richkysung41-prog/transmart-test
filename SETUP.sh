#!/bin/bash
# Testing Setup Guide untuk Transmart

echo "🚀 TRANSMART - SETUP & TESTING GUIDE"
echo "====================================="
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="MacOS"
elif [[ "$OSTYPE" == "msys" ]]; then
    OS="Windows"
fi

echo "📱 Detected OS: $OS"
echo ""

# Step 1: Check PHP
echo "✅ Step 1: Checking PHP Installation..."
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1)
    echo "   ✓ PHP found: $PHP_VERSION"
else
    echo "   ✗ PHP not found. Please install PHP 7.4+"
    exit 1
fi

# Step 2: Check MySQL
echo ""
echo "✅ Step 2: Checking MySQL Installation..."
if command -v mysql &> /dev/null; then
    echo "   ✓ MySQL found"
else
    echo "   ⚠ MySQL not found in PATH (but might be running)"
fi

# Step 3: Database Setup
echo ""
echo "✅ Step 3: Database Setup"
echo ""
echo "   Manual steps:"
echo "   1. Open MySQL:"
echo "      mysql -u root -p"
echo ""
echo "   2. Import database:"
echo "      source /home/rahao/transmart-project/database.sql"
echo ""
echo "   3. Verify:"
echo "      USE transmart_db;"
echo "      SHOW TABLES;"
echo "      SELECT COUNT(*) FROM users;"
echo ""

# Step 4: Start PHP Server
echo "✅ Step 4: Starting PHP Development Server..."
echo ""
echo "   Run in terminal:"
echo "   cd /home/rahao/transmart-project"
echo "   php -S localhost:8000"
echo ""

# Step 5: Access Application
echo "✅ Step 5: Access Application"
echo ""
echo "   Open browser and go to:"
echo "   http://localhost:8000"
echo ""
echo "   or if using Apache:"
echo "   http://localhost/transmart-project"
echo ""

# Test Credentials
echo "✅ Test Credentials"
echo ""
echo "   Admin Account:"
echo "   - Email: admin@transmart.com"
echo "   - Password: admin123"
echo ""
echo "   Customer Account:"
echo "   - Email: budi@example.com"
echo "   - Password: password123"
echo ""

echo "====================================="
echo "✨ Setup complete!"
echo "====================================="
