const mongoose = require('mongoose');
const SessionScheme = new mongoose.Schema({
  username: String,
  password: String,
  updateTime: Date
});

module.exports = mongoose.Model('Session', SessionScheme);
