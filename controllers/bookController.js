const Book = require('../models/Book');

class BookController {
    // Get all books with pagination and filters
    async getAllBooks(req, res) {
        try {
            const { page = 1, limit = 10, search = '', genre = '', status = '' } = req.query;
            
            let query = { removed: false };
            
            // Search functionality
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                    { isbn: { $regex: search, $options: 'i' } }
                ];
            }
            
            // Filter by genre
            if (genre) {
                query.genre = { $regex: genre, $options: 'i' };
            }
            
            // Filter by status
            if (status === 'borrowed') {
                query.isBorrowed = true;
            } else if (status === 'available') {
                query.isBorrowed = false;
            }
            
            const skip = (page - 1) * limit;
            
            const books = await Book.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));
            
            const total = await Book.countDocuments(query);
            
            res.json({
                books,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Get books error:', error);
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    }

    // Get single book by ID
    async getBookById(req, res) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            console.error('Get book error:', error);
            res.status(500).json({ error: 'Failed to fetch book' });
        }
    }

    // Create new book
    async createBook(req, res) {
        try {
            const { title, author, genre, year, isbn, description } = req.body;
            
            const book = new Book({
                title,
                author,
                genre,
                year,
                isbn,
                description
            });

            await book.save();
            res.status(201).json({ message: 'Book added successfully', book });
        } catch (error) {
            console.error('Add book error:', error);
            res.status(500).json({ error: 'Failed to add book' });
        }
    }

    // Update book
    async updateBook(req, res) {
        try {
            const { title, author, genre, year, isbn, description } = req.body;
            
            const book = await Book.findByIdAndUpdate(
                req.params.id,
                { title, author, genre, year, isbn, description },
                { new: true, runValidators: true }
            );

            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            res.json({ message: 'Book updated successfully', book });
        } catch (error) {
            console.error('Update book error:', error);
            res.status(500).json({ error: 'Failed to update book' });
        }
    }

    // Toggle borrowed status
    async toggleBorrowStatus(req, res) {
        try {
            const { borrowedBy } = req.body;
            const book = await Book.findById(req.params.id);
            
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            book.isBorrowed = !book.isBorrowed;
            book.borrowedBy = book.isBorrowed ? borrowedBy : null;
            book.borrowedDate = book.isBorrowed ? new Date() : null;

            await book.save();
            res.json({ message: 'Book status updated', book });
        } catch (error) {
            console.error('Toggle borrow error:', error);
            res.status(500).json({ error: 'Failed to update book status' });
        }
    }

    // Remove book with reason
    async removeBook(req, res) {
        try {
            const { removalReason } = req.body;
            const book = await Book.findById(req.params.id);
            
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            book.removed = true;
            book.removalReason = removalReason;
            book.removedBy = req.session.userId;
            book.removedAt = new Date();

            await book.save();
            res.json({ message: 'Book removed successfully' });
        } catch (error) {
            console.error('Remove book error:', error);
            res.status(500).json({ error: 'Failed to remove book' });
        }
    }

    // Get removed books
    async getRemovedBooks(req, res) {
        try {
            const removedBooks = await Book.find({ removed: true })
                .populate('removedBy', 'name email')
                .sort({ removedAt: -1 });
            
            res.json(removedBooks);
        } catch (error) {
            console.error('Get removed books error:', error);
            res.status(500).json({ error: 'Failed to fetch removed books' });
        }
    }

    // Get books by genre for filter dropdown
    async getGenres(req, res) {
        try {
            const genres = await Book.distinct('genre', { removed: false });
            res.json(genres);
        } catch (error) {
            console.error('Get genres error:', error);
            res.status(500).json({ error: 'Failed to fetch genres' });
        }
    }
}

module.exports = new BookController(); 