const Book = require('../models/Book');

class DashboardController {
    // Get dashboard statistics
    async getStats(req, res) {
        try {
            const totalBooks = await Book.countDocuments({ removed: false });
            const borrowedBooks = await Book.countDocuments({ removed: false, isBorrowed: true });
            const availableBooks = await Book.countDocuments({ removed: false, isBorrowed: false });
            const removedBooks = await Book.countDocuments({ removed: true });

            // Get genre distribution
            const genreStats = await Book.aggregate([
                { $match: { removed: false } },
                { $group: { _id: '$genre', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            // Get recent activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const recentAdded = await Book.countDocuments({
                removed: false,
                createdAt: { $gte: sevenDaysAgo }
            });

            const recentRemoved = await Book.countDocuments({
                removed: true,
                removedAt: { $gte: sevenDaysAgo }
            });

            res.json({
                totalBooks,
                borrowedBooks,
                availableBooks,
                removedBooks,
                genreStats,
                recentActivity: {
                    added: recentAdded,
                    removed: recentRemoved
                }
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
        }
    }

    // Get recent books
    async getRecentBooks(req, res) {
        try {
            const recentBooks = await Book.find({ removed: false })
                .sort({ createdAt: -1 })
                .limit(5);

            res.json(recentBooks);
        } catch (error) {
            console.error('Recent books error:', error);
            res.status(500).json({ error: 'Failed to fetch recent books' });
        }
    }

    // Get borrowed books
    async getBorrowedBooks(req, res) {
        try {
            const borrowedBooks = await Book.find({ 
                removed: false, 
                isBorrowed: true 
            })
            .sort({ borrowedDate: -1 });

            res.json(borrowedBooks);
        } catch (error) {
            console.error('Borrowed books error:', error);
            res.status(500).json({ error: 'Failed to fetch borrowed books' });
        }
    }

    // Get books by status for charts
    async getBooksByStatus(req, res) {
        try {
            const statusStats = await Book.aggregate([
                { $match: { removed: false } },
                {
                    $group: {
                        _id: '$isBorrowed',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const formattedStats = {
                available: statusStats.find(stat => stat._id === false)?.count || 0,
                borrowed: statusStats.find(stat => stat._id === true)?.count || 0
            };

            res.json(formattedStats);
        } catch (error) {
            console.error('Books by status error:', error);
            res.status(500).json({ error: 'Failed to fetch books by status' });
        }
    }

    // Get monthly activity
    async getMonthlyActivity(req, res) {
        try {
            const currentYear = new Date().getFullYear();
            const monthlyStats = await Book.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(currentYear, 0, 1),
                            $lt: new Date(currentYear + 1, 0, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        added: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Fill in missing months with 0
            const monthlyData = Array.from({ length: 12 }, (_, i) => {
                const monthData = monthlyStats.find(stat => stat._id === i + 1);
                return {
                    month: i + 1,
                    added: monthData ? monthData.added : 0
                };
            });

            res.json(monthlyData);
        } catch (error) {
            console.error('Monthly activity error:', error);
            res.status(500).json({ error: 'Failed to fetch monthly activity' });
        }
    }
}

module.exports = new DashboardController(); 