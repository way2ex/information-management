const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const PurchaseScheme = new mongoose.Schema({
  uniqueCode: String,
  goodsName: String,
  packingSpec: String,
  amount: Number,
  price: Number,
  provider: String,
  purchaser: String,
  purchasingDate: String,
  state: String,
  extra: String
});

mongoose.plugin(mongoosePaginate);
PurchaseScheme.plugin(autoIncrement.plugin, 'Purchase');

module.exports = mongoose.model('Purchase', PurchaseScheme);
