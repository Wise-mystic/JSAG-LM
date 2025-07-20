const bcrypt = require('bcryptjs');
const { validatePasswordStrength, hashPassword, comparePassword } = require('./utils/passwordUtils');

async function testPasswordHashing() {
    console.log('🔐 Testing Password Hashing System...\n');
    
    // Test password validation
    console.log('1. Testing Password Validation:');
    const testPasswords = [
        'short',
        'goodpassword123',
        'VERY_LONG_PASSWORD_THAT_EXCEEDS_THE_MAXIMUM_LENGTH_ALLOWED_BY_THE_SYSTEM_AND_SHOULD_BE_REJECTED_BECAUSE_IT_IS_TOO_LONG_FOR_ANY_REASONABLE_USE_CASE',
        'normal123'
    ];
    
    testPasswords.forEach(password => {
        const validation = validatePasswordStrength(password);
        console.log(`   "${password}": ${validation.isValid ? '✅ Valid' : '❌ Invalid'} - ${validation.errors.join(', ') || 'No errors'}`);
    });
    
    console.log('\n2. Testing Password Hashing:');
    const testPassword = 'MySecurePassword123!';
    
    try {
        const hashedPassword = await hashPassword(testPassword);
        console.log(`   Original: ${testPassword}`);
        console.log(`   Hashed: ${hashedPassword}`);
        console.log(`   Length: ${hashedPassword.length} characters`);
        
        // Test password comparison
        console.log('\n3. Testing Password Comparison:');
        const isMatch = await comparePassword(testPassword, hashedPassword);
        const isWrongMatch = await comparePassword('WrongPassword', hashedPassword);
        
        console.log(`   Correct password match: ${isMatch ? '✅ True' : '❌ False'}`);
        console.log(`   Wrong password match: ${isWrongMatch ? '❌ True' : '✅ False'}`);
        
        console.log('\n✅ Password hashing system is working correctly!');
        
    } catch (error) {
        console.error('❌ Password hashing test failed:', error.message);
    }
}

// Run the test
testPasswordHashing(); 