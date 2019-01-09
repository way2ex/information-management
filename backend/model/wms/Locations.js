const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LocationsSchema = new mongoose.Schema({
  uniqueCode: String,
  line: String,
  shelf: String,
  col: String,
  layer: String,
  // 存储商品信息
  goodsUniqueCode: String,
  goodsName: String,
  amount: Number,
  // 0: 空闲 1: 使用中
  state: Number,
  stateText: String
});

mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('Locations', LocationsSchema);
