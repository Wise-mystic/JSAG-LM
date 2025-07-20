const bcrypt = require('bcryptjs');

// Password strength validation
const validatePasswordStrength = (password) => {
    const errors = [];
    
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
    }
    
    // Optional: Add more strength requirements
    // if (!/[A-Z]/.test(password)) {
    //     errors.push('Password must contain at least one uppercase letter');
    // }
    // if (!/[a-z]/.test(password)) {
    //     errors.push('Password must contain at least one lowercase letter');
    // }
    // if (!/\d/.test(password)) {
    //     errors.push('Password must contain at least one number');
    // }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Hash password with custom salt rounds
const hashPassword = async (password, saltRounds = 12) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

// Compare password with hash
const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Generate a secure random password (for admin creation if needed)
const generateSecurePassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

module.exports = {
    validatePasswordStrength,
    hashPassword,
    comparePassword,
    generateSecurePassword
}; 