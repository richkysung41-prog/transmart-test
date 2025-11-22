# 🎯 TESTING GUIDE - Admin Panel Features

## ✅ Testing Checklist

### 1. **Products Management** ✅

**Create Product:**
```bash
curl -X POST http://localhost/transmart-project/api/products.php \
  -F "action=create" \
  -F "name=New Product" \
  -F "category_id=1" \
  -F "price=100000" \
  -F "stock=50" \
  -F "description=Test product"
```
Expected: `{"success": true, "product_id": "X"}`

**Update Product:**
```bash
curl -X POST http://localhost/transmart-project/api/products.php \
  -F "action=update" \
  -F "id=21" \
  -F "name=Updated Product" \
  -F "category_id=1" \
  -F "price=150000" \
  -F "stock=30"
```
Expected: `{"success": true, "message": "Produk berhasil diperbarui"}`

**Delete Product:**
```bash
curl -X POST http://localhost/transmart-project/api/products.php \
  -F "action=delete" \
  -F "id=21"
```
Expected: `{"success": true, "message": "Produk berhasil dihapus"}`

**Read Products:**
```bash
curl http://localhost/transmart-project/api/products.php?limit=5
```
Expected: List of products with pagination

---

### 2. **Categories Management** ✅

**Create Category:**
```bash
curl -X POST http://localhost/transmart-project/api/categories.php \
  -F "action=create" \
  -F "name=New Category" \
  -F "description=Category description"
```
Expected: `{"success": true, "category_id": "X"}`

**Update Category:**
```bash
curl -X POST http://localhost/transmart-project/api/categories.php \
  -F "action=update" \
  -F "id=8" \
  -F "name=Updated Category" \
  -F "description=Updated description"
```
Expected: `{"success": true, "message": "Kategori berhasil diperbarui"}`

**Delete Category:**
```bash
curl -X POST http://localhost/transmart-project/api/categories.php \
  -F "action=delete" \
  -F "id=8"
```
Expected: `{"success": true, "message": "Kategori berhasil dihapus"}`

---

### 3. **Orders Management** ✅

**Get All Orders:**
```bash
curl http://localhost/transmart-project/api/orders.php
```
Expected: List of orders with user details

**Update Order Status:**
```bash
curl -X POST http://localhost/transmart-project/api/orders.php \
  -F "action=update_status" \
  -F "order_id=1" \
  -F "status=shipped"
```
Expected: `{"success": true, "message": "Status pesanan berhasil diperbarui"}`

**Valid Statuses:**
- pending
- processing
- shipped
- delivered
- cancelled

---

### 4. **Customers/Users Management** ✅

**Get All Customers:**
```bash
curl http://localhost/transmart-project/api/users.php
```
Expected: List of all users (will filter in JS to show customers only)

---

## 🧪 Browser Testing

### Via Admin Panel UI:

#### 1. Products Page
1. Go to: `http://localhost/transmart-project/pages/admin/products.html`
2. Test:
   - [ ] Search products
   - [ ] Filter by category
   - [ ] Click "Tambah Produk"
   - [ ] Fill form and submit
   - [ ] Verify product appears in list
   - [ ] Click edit button
   - [ ] Modify and save
   - [ ] Delete product

#### 2. Categories Page
1. Go to: `http://localhost/transmart-project/pages/admin/categories.html`
2. Test:
   - [ ] View all categories
   - [ ] Click "Tambah Kategori"
   - [ ] Fill form and submit
   - [ ] Verify category appears
   - [ ] Edit category
   - [ ] Delete category

#### 3. Orders Page
1. Go to: `http://localhost/transmart-project/pages/admin/orders.html`
2. Test:
   - [ ] View all orders
   - [ ] Filter by status
   - [ ] Click "Lihat" on order
   - [ ] Verify order details shown
   - [ ] Change status
   - [ ] Click "Update Status"

#### 4. Customers Page
1. Go to: `http://localhost/transmart-project/pages/admin/customers.html`
2. Test:
   - [ ] View all customers
   - [ ] Search customers
   - [ ] Verify customer info displayed

#### 5. Promo Page
1. Go to: `http://localhost/transmart-project/pages/admin/promo.html`
2. Test:
   - [ ] View promos
   - [ ] Add new promo
   - [ ] Edit promo
   - [ ] Delete promo

#### 6. Settings Page
1. Go to: `http://localhost/transmart-project/pages/admin/settings.html`
2. Test:
   - [ ] Switch between tabs
   - [ ] Edit general settings
   - [ ] Edit store settings
   - [ ] Edit payment settings
   - [ ] Edit email settings

---

## 🔐 Security Testing

### Authentication:
- [ ] Verify non-admin cannot access admin pages
- [ ] Verify session is required
- [ ] Verify redirect to login if not authenticated
- [ ] Test logout functionality

### Authorization:
- [ ] Verify customer cannot access admin APIs
- [ ] Verify only admin can create/edit/delete resources
- [ ] Verify role-based access control

### Input Validation:
- [ ] Try empty fields in forms
- [ ] Try very long strings
- [ ] Try special characters
- [ ] Verify validation messages shown

---

## 📊 Data Validation Testing

### Product Form:
- [ ] Name: Required
- [ ] Category: Required (must be > 0)
- [ ] Price: Required, must be > 0
- [ ] Stock: Optional, defaults to 0
- [ ] Description: Optional
- [ ] Image URL: Optional

### Category Form:
- [ ] Name: Required
- [ ] Description: Optional
- [ ] Verify duplicate names are prevented

### Promo Form:
- [ ] Code: Required
- [ ] Discount Type: Percentage or Fixed
- [ ] Value: Required, must be > 0
- [ ] Min Purchase: Optional
- [ ] Valid From/Until: Required

---

## 🎨 UI/UX Testing

- [ ] Sidebar highlights current page
- [ ] Modals open/close smoothly
- [ ] Forms clear after submit
- [ ] Notifications appear and disappear
- [ ] Search/filter updates in real-time
- [ ] Pagination buttons work correctly
- [ ] Responsive on mobile (720px)
- [ ] Responsive on tablet (1024px)
- [ ] Responsive on desktop (1920px)

---

## ⚡ Performance Testing

- [ ] Products page loads < 2 seconds
- [ ] Categories page loads < 1 second
- [ ] Search results < 500ms
- [ ] Filters work smoothly without lag
- [ ] No memory leaks in browser console

---

## 🔄 Integration Testing

### Product → Category:
- [ ] When category is deleted, verify products can still be viewed
- [ ] When adding product, all categories in dropdown

### Orders → Products:
- [ ] Order items display product names correctly
- [ ] Order items show correct prices

### Orders → Customers:
- [ ] Order shows customer name and email
- [ ] Customer page shows order count correctly

---

## 📋 Database Testing

### Check Data Integrity:
```sql
-- Verify products
SELECT COUNT(*) FROM products;

-- Verify categories
SELECT COUNT(*) FROM categories;

-- Verify orders
SELECT COUNT(*) FROM orders;

-- Verify order items
SELECT COUNT(*) FROM order_items;

-- Check foreign keys
SELECT * FROM products WHERE category_id NOT IN (SELECT id FROM categories);
```

---

## ❌ Error Handling Testing

- [ ] Try delete category with products → Should show error
- [ ] Try create duplicate category → Should show error
- [ ] Try update non-existent product → Should show error
- [ ] Try delete non-existent order → Should show error
- [ ] Network timeout → Should show error message
- [ ] Server error (500) → Should show error message

---

## 📝 Test Report Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Feature: ___________ 
Status: [ ] PASS [ ] FAIL [ ] PARTIAL

Issues Found:
1. _________________________________
2. _________________________________

Notes:
_________________________________
```

---

## ✅ Current Status

### Working Features:
- ✅ Admin Dashboard
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management (Read + Update Status)
- ✅ Customer Management (Read)
- ✅ Promo Management (CRUD - local)
- ✅ Settings Page
- ✅ Responsive Design
- ✅ Authentication & Authorization
- ✅ Error Handling
- ✅ Notifications
- ✅ Search & Filter
- ✅ Pagination

### Database Tables Used:
- users (for admin auth)
- products (CRUD operations)
- categories (CRUD operations)
- orders (Read + Update status)
- order_items (with orders)

---

## 🚀 Deployment Checklist

Before going live:
- [ ] Test all features thoroughly
- [ ] Check error logs are minimal
- [ ] Verify all API endpoints working
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Enable HTTPS in production
- [ ] Setup automated backups
- [ ] Setup error logging service
- [ ] Document all custom configurations
- [ ] Train team on admin features

---

**Last Updated**: November 19, 2025
**Version**: 1.0
**Status**: ✅ READY FOR TESTING
