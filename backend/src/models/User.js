const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password_hash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
