// Dashboard JavaScript functionality
class LibraryDashboard {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {
            search: '',
            genre: '',
            status: ''
        };
        this.currentBookId = null;
        this.init();
    }

    async init() {
        // Check authentication
        const authStatus = await this.checkAuth();
        if (!authStatus.authenticated) {
            window.location.href = '/login';
            return;
        }

        // Set user name
        document.getElementById('user-name').textContent = authStatus.user.name;

        // Load initial data
        await this.loadStats();
        await this.loadBooks();

        // Set up event listeners
        this.setupEventListeners();
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/auth/status');
            return await response.json();
        } catch (error) {
            console.error('Auth check failed:', error);
            return { authenticated: false };
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const stats = await response.json();
            
            document.getElementById('total-books').textContent = stats.totalBooks;
            document.getElementById('available-books').textContent = stats.availableBooks;
            document.getElementById('borrowed-books').textContent = stats.borrowedBooks;
            document.getElementById('removed-books').textContent = stats.removedBooks;
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async loadBooks() {
        const loading = document.getElementById('loading');
        const booksContainer = document.getElementById('books-container');
        const noBooks = document.getElementById('no-books');

        loading.classList.remove('hidden');
        booksContainer.classList.add('hidden');
        noBooks.classList.add('hidden');

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: 10,
                ...this.currentFilters
            });

            const response = await fetch(`/api/books?${params}`);
            const data = await response.json();

            loading.classList.add('hidden');

            if (data.books.length === 0) {
                noBooks.classList.remove('hidden');
                return;
            }

            this.renderBooks(data.books);
            this.updatePagination(data.pagination);
            booksContainer.classList.remove('hidden');
        } catch (error) {
            console.error('Failed to load books:', error);
            loading.classList.add('hidden');
            noBooks.classList.remove('hidden');
        }
    }

    renderBooks(books) {
        const tbody = document.getElementById('books-tbody');
        tbody.innerHTML = '';

        books.forEach(book => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            const statusBadge = book.isBorrowed 
                ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Borrowed</span>'
                : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>';

            const borrowButton = book.isBorrowed
                ? `<button onclick="dashboard.returnBook('${book._id}')" class="text-blue-600 hover:text-blue-900 text-sm font-medium">Return</button>`
                : `<button onclick="dashboard.borrowBook('${book._id}')" class="text-blue-600 hover:text-blue-900 text-sm font-medium">Borrow</button>`;

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${book.title}</div>
                            <div class="text-sm text-gray-500">${book.author}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.genre}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.year}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    ${borrowButton}
                    <button onclick="dashboard.editBook('${book._id}')" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onclick="dashboard.removeBook('${book._id}')" class="text-red-600 hover:text-red-900">Remove</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updatePagination(pagination) {
        const pageInfo = document.getElementById('page-info');
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        const prevPageMobile = document.getElementById('prev-page-mobile');
        const nextPageMobile = document.getElementById('next-page-mobile');

        pageInfo.textContent = `Page ${pagination.current} of ${pagination.total}`;
        
        prevPage.disabled = !pagination.hasPrev;
        nextPage.disabled = !pagination.hasNext;
        prevPageMobile.disabled = !pagination.hasPrev;
        nextPageMobile.disabled = !pagination.hasNext;

        prevPage.classList.toggle('opacity-50', !pagination.hasPrev);
        nextPage.classList.toggle('opacity-50', !pagination.hasNext);
        prevPageMobile.classList.toggle('opacity-50', !pagination.hasPrev);
        nextPageMobile.classList.toggle('opacity-50', !pagination.hasNext);
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn').addEventListener('click', this.logout.bind(this));

        // Add book
        document.getElementById('add-book-btn').addEventListener('click', this.showAddBookModal.bind(this));
        document.getElementById('add-book-form').addEventListener('submit', this.addBook.bind(this));
        document.getElementById('cancel-add').addEventListener('click', this.hideAddBookModal.bind(this));

        // Remove book
        document.getElementById('remove-book-form').addEventListener('submit', this.confirmRemoveBook.bind(this));
        document.getElementById('cancel-remove').addEventListener('click', this.hideRemoveBookModal.bind(this));

        // Borrow book
        document.getElementById('borrow-book-form').addEventListener('submit', this.confirmBorrowBook.bind(this));
        document.getElementById('cancel-borrow').addEventListener('click', this.hideBorrowBookModal.bind(this));

        // Search and filters
        document.getElementById('search-input').addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        document.getElementById('genre-filter').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('status-filter').addEventListener('change', this.handleFilterChange.bind(this));

        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
        document.getElementById('prev-page-mobile').addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page-mobile').addEventListener('click', () => this.changePage(1));
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    showAddBookModal() {
        document.getElementById('add-book-modal').classList.remove('hidden');
    }

    hideAddBookModal() {
        document.getElementById('add-book-modal').classList.add('hidden');
        document.getElementById('add-book-form').reset();
    }

    async addBook(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            genre: document.getElementById('book-genre').value,
            year: parseInt(document.getElementById('book-year').value),
            isbn: document.getElementById('book-isbn').value,
            description: document.getElementById('book-description').value
        };

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.hideAddBookModal();
                await this.loadStats();
                await this.loadBooks();
            } else {
                const error = await response.json();
                alert('Failed to add book: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Add book failed:', error);
            alert('Failed to add book');
        }
    }

    removeBook(bookId) {
        this.currentBookId = bookId;
        document.getElementById('remove-book-modal').classList.remove('hidden');
    }

    hideRemoveBookModal() {
        document.getElementById('remove-book-modal').classList.add('hidden');
        document.getElementById('remove-book-form').reset();
        this.currentBookId = null;
    }

    async confirmRemoveBook(e) {
        e.preventDefault();
        
        const reason = document.getElementById('removal-reason').value;
        
        try {
            const response = await fetch(`/api/books/${this.currentBookId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ removalReason: reason })
            });

            if (response.ok) {
                this.hideRemoveBookModal();
                await this.loadStats();
                await this.loadBooks();
            } else {
                const error = await response.json();
                alert('Failed to remove book: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Remove book failed:', error);
            alert('Failed to remove book');
        }
    }

    borrowBook(bookId) {
        this.currentBookId = bookId;
        document.getElementById('borrow-book-modal').classList.remove('hidden');
    }

    hideBorrowBookModal() {
        document.getElementById('borrow-book-modal').classList.add('hidden');
        document.getElementById('borrow-book-form').reset();
        this.currentBookId = null;
    }

    async confirmBorrowBook(e) {
        e.preventDefault();
        
        const borrowedBy = document.getElementById('borrowed-by').value;
        
        try {
            const response = await fetch(`/api/books/${this.currentBookId}/borrow`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ borrowedBy })
            });

            if (response.ok) {
                this.hideBorrowBookModal();
                await this.loadStats();
                await this.loadBooks();
            } else {
                const error = await response.json();
                alert('Failed to borrow book: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Borrow book failed:', error);
            alert('Failed to borrow book');
        }
    }

    async returnBook(bookId) {
        try {
            const response = await fetch(`/api/books/${bookId}/borrow`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ borrowedBy: '' })
            });

            if (response.ok) {
                await this.loadStats();
                await this.loadBooks();
            } else {
                const error = await response.json();
                alert('Failed to return book: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Return book failed:', error);
            alert('Failed to return book');
        }
    }

    editBook(bookId) {
        // TODO: Implement edit functionality
        alert('Edit functionality coming soon!');
    }

    handleSearch(e) {
        this.currentFilters.search = e.target.value;
        this.currentPage = 1;
        this.loadBooks();
    }

    handleFilterChange(e) {
        const filterType = e.target.id === 'genre-filter' ? 'genre' : 'status';
        this.currentFilters[filterType] = e.target.value;
        this.currentPage = 1;
        this.loadBooks();
    }

    changePage(delta) {
        this.currentPage += delta;
        this.loadBooks();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new LibraryDashboard();
}); 