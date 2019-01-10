const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const StocktakingSchema = new mongoose.Schema({
  uniqueCode: String,
  applicant: String, // 开单人
  applicatingDate: String,
  executor: String, // 执行人
  executingDate: String, // 结果录入日期
  state: Number, // 0：未处理 1：正在处理 2：已录入结果 3：完成
  stateText: String,
  extra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('Stocktaking', StocktakingSchema);
