const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 })
];

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register new admin user
router.post('/register', validateRegistration, handleValidationErrors, authController.register);

// Login
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Logout
router.post('/logout', authController.logout);

// Check authentication status
router.get('/status', authController.getAuthStatus);

// Check password strength (for frontend validation)
router.post('/check-password', (req, res) => {
    const { password } = req.body;
    const { validatePasswordStrength } = require('../utils/passwordUtils');
    
    const validation = validatePasswordStrength(password);
    res.json({
        isValid: validation.isValid,
        errors: validation.errors
    });
});

module.exports = router; 