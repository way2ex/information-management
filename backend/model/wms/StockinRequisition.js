const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const StockinRequisitionSchema = new mongoose.Schema({
  uniqueCode: String,
  applicant: String,
  applicatingDate: String,
  processor: String,
  state: Number,
  stateText: String,
  extra: String,
  goodsList: Array
});

mongoose.plugin(mongoosePaginate);
StockinRequisitionSchema.plugin(autoIncrement.plugin, 'StockinRequisition');

module.exports = mongoose.model('StockinRequisition', StockinRequisitionSchema);
