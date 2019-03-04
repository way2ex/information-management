const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const StockoutSchema = new mongoose.Schema({
  uniqueCode: String,
  resourceCode: Number,
  resource: String, // 来源：0-订单 1-盘点出库 2-人工开单
  applicant: String, // 开单人
  applicatingDate: String, // 开单日期
  processor: String, // 处理人
  state: Number, // 0-待处理 1-正在拣货 2-已出库
  stateText: String,
  extra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('Stockout', StockoutSchema);
