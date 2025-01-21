const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Membuat schema untuk User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Menghindari email duplikat
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Validasi email
  },
  username: {
    type: String,
    required: true,
    unique: true, // Menghindari username duplikat
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimal panjang password
  },
  avatarUrl: {
    type: String, // URL untuk gambar avatar
    default: 'https://via.placeholder.com/150',
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Role bisa admin atau user
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // Status aktif akun
  },
  githubId: {
    type: String,
    unique: true, // Unik jika menggunakan login GitHub
  },
});

// Menambahkan hash password sebelum disimpan ke DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Lewati jika password tidak diubah
  const salt = await bcrypt.genSalt(10); // Membuat salt untuk enkripsi
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// Membuat method untuk membandingkan password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
