const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const GoodsSchema = new mongoose.Schema({
  uniqueCode: String,
  goodsName: String,
  amount: Number,
  positions: Array
});

mongoose.plugin(mongoosePaginate);
GoodsSchema.plugin(autoIncrement.plugin, 'Goods');

module.exports = mongoose.model('Goods', GoodsSchema);
