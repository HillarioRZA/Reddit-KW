const mongoose = require('mongoose');

// Membuat schema untuk Topic
const topicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0, // Default view count adalah 0
  },
  isDeleted: {
    type: Boolean,
    default: false, // Default topic tidak dihapus
  },
  createdAt: {
    type: Date,
    default: Date.now, // Waktu pembuatan otomatis di-set
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Waktu update otomatis di-set
  },
  tags: {
    type: [String], // Array string untuk menyimpan tag
    validate: {
      validator: (tags) => tags.length <= 3, // Maksimal 3 tag
      message: 'You can add up to 3 tags only',
    },
  },
});

// Middleware untuk mengupdate `updatedAt` saat data diubah
topicSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Topic', topicSchema);
