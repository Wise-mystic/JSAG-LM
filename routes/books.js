const express = require('express');
const { body, validationResult } = require('express-validator');
const bookController = require('../controllers/bookController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateBook = [
    body('title').trim().isLength({ min: 1 }),
    body('author').trim().isLength({ min: 1 }),
    body('genre').trim().isLength({ min: 1 }),
    body('year').isInt({ min: 1800, max: new Date().getFullYear() })
];

const validateRemoval = [
    body('removalReason').trim().isLength({ min: 1 })
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Get all books (excluding removed ones)
router.get('/', isAuthenticated, bookController.getAllBooks);

// Get single book
router.get('/:id', isAuthenticated, bookController.getBookById);

// Add new book
router.post('/', isAuthenticated, validateBook, handleValidationErrors, bookController.createBook);

// Update book
router.put('/:id', isAuthenticated, validateBook, handleValidationErrors, bookController.updateBook);

// Toggle borrowed status
router.patch('/:id/borrow', isAuthenticated, bookController.toggleBorrowStatus);

// Remove book with reason
router.delete('/:id', isAuthenticated, validateRemoval, handleValidationErrors, bookController.removeBook);

// Get removed books
router.get('/removed/list', isAuthenticated, bookController.getRemovedBooks);

// Get genres for filter dropdown
router.get('/genres/list', isAuthenticated, bookController.getGenres);

module.exports = router; 