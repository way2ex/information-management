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
  state: Number, // -1：已回绝 0: 未审核 1：未签收 2：部分签收 3: 全部签收
  stateText: String,
  extra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);
PurchaseScheme.plugin(autoIncrement.plugin, 'Purchase');

module.exports = mongoose.model('Purchase', PurchaseScheme);
