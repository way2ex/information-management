const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const UserScheme = new mongoose.Schema({
  nickname: String,
  username: String,
  password: {
    type: String,
    default: '123456'
  },
  department: String,
  position: String,
  phoneNumber: String,
  state: String
});
mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserScheme);
