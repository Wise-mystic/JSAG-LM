const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  isbn: {
    type: String,
    trim: true,
    sparse: true
  },
  description: {
    type: String,
    trim: true
  },
  isBorrowed: {
    type: Boolean,
    default: false
  },
  borrowedBy: {
    type: String,
    default: null
  },
  borrowedDate: {
    type: Date,
    default: null
  },
  removed: {
    type: Boolean,
    default: false
  },
  removalReason: {
    type: String,
    default: null
  },
  removedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  removedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ isBorrowed: 1 });
bookSchema.index({ removed: 1 });

module.exports = mongoose.model('Book', bookSchema); 