const StockinRequisition = require('../../model/wms/StockinRequisition');
const { findManyGenerator } = require('../../common/utils');
/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'applicant', 'state'], StockinRequisition);
/**
 * 入库
 */
async function stockIn (ctx) {
  let body = ctx.request.body;
  await StockinRequisition.update({ uniqueCode: body.uniqueCode }, {
    processor: body.username,
    state: 1,
    stateText: '已入库',
    goodsList: body.goodsList
  });
  ctx.body = {
    result: 1,
    msg: '入库成功'
  };
}
module.exports = {
  findMany,
  stockIn
};
