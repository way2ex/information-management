const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const PurchaseScheme = new mongoose.Schema({
  uniqueCode: String,
  // goodsName: String,
  // packingSpec: String,
  // amount: String,
  // price: String,
  // provider: String,
  purchaser: String,
  purchasingDate: String,
  state: Number,
  stateText: String,
  extra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);
PurchaseScheme.plugin(autoIncrement.plugin, 'Purchase');

module.exports = mongoose.model('Purchase', PurchaseScheme);
