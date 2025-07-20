# 📚 Library Management System

A simple, admin-only library management application built with Node.js, Express, MongoDB, and vanilla JavaScript with Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Admin Authentication**: Secure login/registration system with session-based authentication
- **Book Management**: Complete CRUD operations for books
- **Borrowing System**: Toggle book availability with borrower tracking
- **Removal Tracking**: Soft delete books with reason logging
- **Search & Filter**: Find books by title, author, genre, or status
- **Dashboard Analytics**: Real-time statistics and book counts

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with status badges
- **Modal Dialogs**: Smooth interactions for adding, borrowing, and removing books
- **Pagination**: Efficient browsing of large book collections

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based with bcrypt password hashing
- **Frontend**: HTML + Tailwind CSS + Vanilla JavaScript
- **Validation**: Express-validator for input validation
- **Architecture**: MVC pattern with controllers for business logic

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `config.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library_management
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=development
```

**Note**: 
- For local MongoDB: Use `mongodb://localhost:27017/library_management`
- For MongoDB Atlas: Use your connection string
- Change the `SESSION_SECRET` to a secure random string

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Run the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 👤 First Time Setup

1. **Register an Admin Account**:
   - Visit `http://localhost:3000/register`
   - Create your first admin account
   - Use a strong password (minimum 6 characters)

2. **Login to Dashboard**:
   - Visit `http://localhost:3000/login`
   - Use your registered credentials
   - Access the full dashboard

## 📖 Usage Guide

### Adding Books
1. Click "Add New Book" button
2. Fill in the required fields:
   - Title, Author, Genre, Publication Year
   - Optional: ISBN, Description
3. Click "Add Book" to save

### Managing Book Status
- **Borrow Book**: Click "Borrow" → Enter borrower name → Confirm
- **Return Book**: Click "Return" → Book becomes available again
- **Remove Book**: Click "Remove" → Enter removal reason → Confirm

### Searching & Filtering
- **Search**: Type in the search box to find books by title, author, or ISBN
- **Genre Filter**: Select a genre from the dropdown
- **Status Filter**: Filter by Available or Borrowed books

### Dashboard Statistics
The dashboard shows real-time statistics:
- Total books in the library
- Available books
- Currently borrowed books
- Removed books (with reasons)

## 🗂️ Database Schema

### AdminUser Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date
}
```

### Books Collection
```javascript
{
  title: String (required),
  author: String (required),
  genre: String (required),
  year: Number (required, 1800-2024),
  isbn: String (optional),
  description: String (optional),
  isBorrowed: Boolean (default: false),
  borrowedBy: String (optional),
  borrowedDate: Date (optional),
  removed: Boolean (default: false),
  removalReason: String (optional),
  removedBy: ObjectId (ref: AdminUser),
  removedAt: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check authentication status

### Books Management
- `GET /api/books` - Get all books (with pagination & filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `PATCH /api/books/:id/borrow` - Toggle borrow status
- `DELETE /api/books/:id` - Remove book (soft delete)
- `GET /api/books/removed/list` - Get removed books
- `GET /api/books/genres/list` - Get available genres

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent` - Get recent books
- `GET /api/dashboard/borrowed` - Get borrowed books
- `GET /api/dashboard/status-chart` - Get books by status for charts
- `GET /api/dashboard/monthly-activity` - Get monthly activity data

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a strong `SESSION_SECRET`
3. Configure MongoDB Atlas or production MongoDB
4. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "library-app"
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds for secure password storage
- **Password Validation**: Real-time password strength checking with customizable requirements
- **Session Management**: Secure session handling with MongoDB store
- **Input Validation**: Express-validator for all user inputs with custom validation
- **Authentication Middleware**: Protected routes for admin-only access
- **CORS Configuration**: Cross-origin resource sharing setup
- **Controller Pattern**: Separation of concerns with dedicated controllers
- **Email Validation**: Server-side email format validation
- **Password Utilities**: Centralized password management with strength validation

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Status Badges**: Visual indicators for book availability
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Modal Dialogs**: Clean interaction patterns
- **Search & Filter**: Real-time search with debouncing

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check your connection string in `config.env`
   - Verify network connectivity

2. **Port Already in Use**:
   - Change the PORT in `config.env`
   - Kill existing processes on port 3000

3. **Session Issues**:
   - Clear browser cookies
   - Check SESSION_SECRET configuration
   - Restart the application

4. **Module Not Found Errors**:
   - Run `npm install` to install dependencies
   - Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the console logs for errors
3. Ensure all prerequisites are met
4. Create an issue with detailed error information

---

**Happy Library Management! 📚✨** 