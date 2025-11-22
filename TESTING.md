# TESTING GUIDE - Transmart

Panduan lengkap untuk menguji setiap fitur aplikasi Transmart dari awal login.

---

## 🔧 Prerequisites Check

Sebelum mulai testing, pastikan:

```bash
✓ PHP running (php -S localhost:8000)
✓ MySQL running
✓ Database imported (database.sql)
✓ Browser console open (F12)
```

---

## 📋 Test Cases

### TEST 1: Database Connection & Demo Data

**Goal**: Verify database properly setup dengan data sample

**Steps**:
```
1. Buka terminal/command prompt
2. Connect ke MySQL:
   mysql -u root -p transmart_db

3. Run queries:
   SELECT COUNT(*) FROM users;           // Should return 3
   SELECT COUNT(*) FROM categories;       // Should return 6
   SELECT COUNT(*) FROM products;         // Should return 10
   SELECT * FROM users WHERE email='admin@transmart.com';
```

**Expected Result**:
```
✓ 3 users exist (admin + 2 customers)
✓ 6 categories with data
✓ 10 products with data
✓ Admin account password is hashed
```

---

### TEST 2: Login Page Load

**Goal**: Verify login page loads correctly

**Steps**:
```
1. Open browser: http://localhost:8000/pages/auth/login.html
2. Check page elements:
   ✓ Logo & header present
   ✓ Email input field
   ✓ Password input field
   ✓ "Remember me" checkbox
   ✓ Submit button
   ✓ Demo account buttons
   ✓ Register link
```

**Expected Result**:
```
✓ Page loads without errors
✓ All form elements visible
✓ Styling looks good (Tailwind CSS applied)
✓ Browser console clean (no red errors)
```

**Check Console**:
```
F12 → Console tab → Should be empty or only info messages
```

---

### TEST 3: Form Validation - Email

**Goal**: Test email input validation

**Steps**:
```
1. Go to login page
2. Try submit with empty email:
   - Click "Masuk" without filling email
   ✓ Should show error: "Format email tidak valid"

3. Try invalid email format:
   - Type: "notanemail"
   - Click "Masuk"
   ✓ Should show error: "Format email tidak valid"

4. Try valid email:
   - Type: "admin@transmart.com"
   ✓ No error, proceed to next validation
```

**Expected Result**:
```
✓ Empty email shows error
✓ Invalid format shows error
✓ Valid email passes validation
```

---

### TEST 4: Form Validation - Password

**Goal**: Test password field

**Steps**:
```
1. On login page
2. Click password toggle icon:
   - Should show password text instead of dots
   - Click again should hide password

3. Try login with valid email but empty password:
   - Email: admin@transmart.com
   - Password: (empty)
   - Click "Masuk"
   ✓ Should show error

4. Try with valid credentials:
   - Email: admin@transmart.com
   - Password: admin123
```

**Expected Result**:
```
✓ Password toggle works (eye icon)
✓ Empty password shows error
✓ Valid credentials will be tested in next test
```

---

### TEST 5: Demo Login Buttons

**Goal**: Test demo account quick login

**Steps**:
```
1. Go to login page
2. Scroll to "Demo Account" section
3. Click first button: "Admin: admin@transmart.com / admin123"
   ✓ Email & password auto-filled
   ✓ Automatically submits
   
4. If login works:
   ✓ Should redirect to homepage
   ✓ User info saved in localStorage

5. Open F12 → Console:
   - Type: localStorage.getItem('user_id')
   - Should return user ID (like "1")
```

**Expected Result**:
```
✓ Demo button fills form
✓ Auto-submits login
✓ User logged in on success
✓ Redirects to homepage
```

---

### TEST 6: Login with Admin Account

**Goal**: Test successful admin login

**Steps**:
```
1. Go to login page (http://localhost:8000/pages/auth/login.html)
2. Fill form:
   - Email: admin@transmart.com
   - Password: admin123
3. Optional: Check "Remember me" checkbox
4. Click "Masuk" button
5. Monitor:
   - Button should show "Sedang memproses..."
   - Network tab should show POST to /api/auth.php?action=login
```

**Expected API Response** (F12 → Network):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin Transmart",
    "email": "admin@transmart.com",
    "phone": "081234567890",
    "role": "admin"
  },
  "message": "Login berhasil"
}
```

**Expected Result**:
```
✓ API returns 200 OK status
✓ User data properly returned
✓ Green notification: "Login berhasil! Mengalihkan..."
✓ Redirects to http://localhost:8000/index.html
✓ localStorage contains user_id, user_name, user_email, user_role
```

**Verify with Console**:
```javascript
// In browser console (F12):
localStorage.getItem('user_id')     // Returns: "1"
localStorage.getItem('user_name')   // Returns: "Admin Transmart"
localStorage.getItem('user_role')   // Returns: "admin"
```

---

### TEST 7: Login with Customer Account

**Goal**: Test login with regular customer account

**Steps**:
```
1. First, logout (clear localStorage)
2. Go to login page
3. Use customer demo button or manually enter:
   - Email: budi@example.com
   - Password: password123
4. Click "Masuk"
```

**Expected Result**:
```
✓ Login successful
✓ Redirects to homepage
✓ localStorage shows user_role = "customer"
✓ No admin menu visible (if implemented)
```

---

### TEST 8: Logout Functionality

**Goal**: Test logout and session cleanup

**Steps**:
```
1. After login, logout by:
   - Open F12 → Console
   - Type: auth.logout()
   - Or click logout button (if exists on homepage)

2. Verify localStorage cleared:
   - Type: localStorage.getItem('user_id')
   - Should return: null
```

**Expected Result**:
```
✓ All user data removed from localStorage
✓ Redirects to login page
✓ Can login again successfully
```

---

### TEST 9: Invalid Login Credentials

**Goal**: Test error handling for wrong password

**Steps**:
```
1. Go to login page
2. Fill correct email but wrong password:
   - Email: admin@transmart.com
   - Password: wrongpassword
3. Click "Masuk"
4. Check API response in Network tab
```

**Expected API Response**:
```json
{
  "error": "Email atau password salah"
}
```

**Expected Result**:
```
✓ API returns 401 Unauthorized
✓ Error message displayed: "Email atau password salah"
✓ NOT redirected
✓ Button re-enabled for retry
```

---

### TEST 10: Non-existent Email Login

**Goal**: Test login with email not in system

**Steps**:
```
1. Go to login page
2. Fill:
   - Email: notexist@example.com
   - Password: anypassword
3. Click "Masuk"
```

**Expected Result**:
```
✓ API returns 401 Unauthorized
✓ Error message: "Email atau password salah"
✓ NOT redirected
```

---

### TEST 11: Register Form Validation

**Goal**: Test register page form validation

**Steps**:
```
1. Go to: http://localhost:8000/pages/auth/register.html

2. Test name field:
   - Leave empty and try submit → Error: "Nama minimal 3 karakter"
   - Type "ab" and try submit → Error: "Nama minimal 3 karakter"
   - Type "Budi Santoso" → Passes

3. Test email:
   - Type invalid email → Error appears
   - Type valid email → Passes

4. Test phone:
   - Type invalid format → Error appears
   - Type "0812345678" → Passes

5. Test password strength:
   - Type password and watch indicators update
   - Minimum 8 chars, uppercase, number, special char

6. Test confirm password:
   - Type different password → Error when mismatch
   - Match password → Passes

7. Test terms checkbox:
   - Try submit without checking → Alert shows
   - Check box and try submit → Allows proceed
```

**Expected Result**:
```
✓ All validations work correctly
✓ Password strength indicators update live
✓ Error messages display properly
✓ Submit button disabled until valid
```

---

### TEST 12: Register New User

**Goal**: Test complete registration flow

**Steps**:
```
1. Go to register page
2. Fill form:
   - Name: Test User 123
   - Email: testuser123@example.com
   - Phone: 08123456789
   - Password: Test@1234
   - Confirm: Test@1234
   - Check Terms checkbox
3. Click "Daftar Sekarang"
4. Monitor Network tab for API call
```

**Expected API Request**:
```json
POST /api/auth.php?action=register
{
  "name": "Test User 123",
  "email": "testuser123@example.com",
  "phone": "08123456789",
  "password": "Test@1234"
}
```

**Expected Result**:
```
✓ API returns 201 Created
✓ Success message: "Pendaftaran berhasil! Silakan login."
✓ Redirects to login page after 1.5 seconds
✓ Can login with new email
```

**Verify in Database**:
```sql
SELECT * FROM users WHERE email='testuser123@example.com';
```

---

### TEST 13: Register Duplicate Email

**Goal**: Test registration with existing email

**Steps**:
```
1. Go to register page
2. Try register with existing email:
   - Name: Another User
   - Email: admin@transmart.com (already exists!)
   - Phone: 08123456789
   - Password: Password123
3. Click "Daftar Sekarang"
```

**Expected Result**:
```
✓ API returns 400 Bad Request
✓ Error message: "Email sudah terdaftar"
✓ NOT redirected
✓ Can retry with different email
```

---

### TEST 14: Remember Me Function

**Goal**: Test remember email feature

**Steps**:
```
1. Go to login page
2. Clear localStorage first:
   - Console: localStorage.clear()
3. Check "Remember me" checkbox
4. Type email: admin@transmart.com
5. Wait for successful login
6. Manually go back to login page
7. Check if email is pre-filled
```

**Expected Result**:
```
✓ Email saved in localStorage as "remember_email"
✓ Email pre-filled on next login page visit
✓ Not showing password (security)
```

---

### TEST 15: Browser Security Tests

**Goal**: Test security practices

**Steps**:
```
1. Check password never shown in console:
   - Type password in password field
   - Open F12 → Elements/Inspector
   - Right-click on password input
   - Check "value" attribute → Should be empty or dots

2. Check localStorage doesn't store password:
   - Console: localStorage
   - Should see user_id, user_name, user_email, user_role
   - Should NOT see password

3. Check HTTPS readiness (for production):
   - Note: localhost uses HTTP, that's OK for dev
```

**Expected Result**:
```
✓ Password not visible in DOM
✓ Password not stored in localStorage
✓ Password not logged in console
```

---

## 🔍 Debugging Tips

### If Login API fails:

1. **Check browser console** (F12):
   ```javascript
   // You should see no red errors
   // Check Network tab → auth.php request
   ```

2. **Check API endpoint** in `assets/js/auth.js`:
   ```javascript
   const API_URL = 'http://localhost/transmart-project/api/auth.php';
   // Make sure this matches your setup
   ```

3. **Check database connection** (config/database.php):
   ```php
   // Test with: php -r "require 'config/database.php'; $db = new Database(); var_dump($db->getConnection());"
   ```

4. **Test API directly with curl**:
   ```bash
   curl -X POST http://localhost/transmart-project/api/auth.php?action=login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@transmart.com","password":"admin123"}'
   ```

---

## 📊 Test Summary Checklist

- [ ] Database connection OK
- [ ] Login page loads correctly
- [ ] Email validation works
- [ ] Password field works with toggle
- [ ] Admin login successful
- [ ] Customer login successful  
- [ ] Invalid credentials rejected
- [ ] Register form validates
- [ ] Register new user works
- [ ] Duplicate email rejected
- [ ] Remember me saves email
- [ ] Logout clears session
- [ ] Password not exposed
- [ ] API errors handled gracefully
- [ ] Redirects work correctly

---

## 🎯 Next Phase

After login flow is working:
1. Implement Products API
2. Implement Product Pages (catalog & detail)
3. Implement Cart functionality
4. Implement Checkout flow

---

## 💡 Notes

- All timestamps use `CURRENT_TIMESTAMP` in database
- Passwords are hashed with `password_hash()` (bcrypt)
- Session stored in localStorage for persistence
- API returns JSON for all responses
- Errors include HTTP status codes

---

**Last Updated**: 2024
**Status**: ✅ Ready for Testing
