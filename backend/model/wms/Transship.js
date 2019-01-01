const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// const autoIncrement = require('mongoose-auto-increment');

// autoIncrement.initialize(mongoose.connection);

const TransshipSchema = new mongoose.Schema({
  uniqueCode: String,
  goodsUniqueCode: String,
  goodsName: String,
  amount: Number,
  transshipAmount: Number,
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
  details: Array
});

mongoose.plugin(mongoosePaginate);
// TransshipSchema.plugin(autoIncrement.plugin, 'Transship');

module.exports = mongoose.model('Transship', TransshipSchema);
