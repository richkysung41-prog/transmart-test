<?php
require_once 'config/config.php';

// Test various phone number formats
$test_phones = [
    '08123456789',      // Valid: 08 + 9 digits
    '081234567890',     // Valid: 08 + 10 digits
    '0812345678901',    // Valid: 08 + 11 digits
    '+62812345678',     // Valid: +62 + 9 digits
    '+628123456789',    // Valid: +62 + 10 digits
    '6281234567890',    // Invalid: 62 without +
    '08',               // Invalid: too short
    '08123',            // Invalid: too short
    '081234567',        // Valid: 08 + 7 digits (minimum)
];

echo "Testing phone validation:\n";
echo str_repeat("=", 50) . "\n";

foreach ($test_phones as $phone) {
    $result = validatePhone($phone);
    $status = $result ? "✓ VALID" : "✗ INVALID";
    echo "$status: $phone\n";
}

echo str_repeat("=", 50) . "\n";
?>
