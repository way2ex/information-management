const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const StocktakingSchema = new mongoose.Schema({
  uniqueCode: String,
  applicant: String,
  applicatingDate: String,
  processor: String,
  checkDate: String,
  executor: String,
  executingDate: String,
  state: Number,
  stateText: String,
  extra: String,
  checkExtra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('Stocktaking', StocktakingSchema);
