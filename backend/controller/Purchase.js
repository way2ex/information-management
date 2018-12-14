const Purchase = require('../model/Purchase');

/**
 * 创建新的订购单
 */
async function createOne (ctx) {
  let { purchaser, purchasingDate, state, stateText, extra, goodsList } = ctx.request.body;
  let uniqueCode = +new Date();
  const newPurchase = new Purchase({
    uniqueCode, purchaser, purchasingDate, state, stateText, extra, goodsList
  });
  await newPurchase.save();
  ctx.body = {
    result: 1,
    msg: '新建成功'
  };
}

/**
 * 按条件查询
 */
async function findMany (ctx) {
  let filterKeys = ['uniqueCode', 'purchaser', 'state'];
  let query = ctx.request.query;
  let condition = {};
  for (let key of filterKeys) {
    query[key] && (condition[key] = query[key]);
  }
  let result = await Purchase.paginate(condition, { page: +query.currentPage, limit: +query.pageSize });
  ctx.body = {
    result: 1,
    msg: '查询成功',
    data: {
      data: result.docs,
      total: result.total
    }
  };
}
/**
 * 审核采购
 */
async function check (ctx) {
  let uniqueCode = ctx.request.body.uniqueCode;
  let data = await Purchase.findOne({ uniqueCode });
  data.goodsList.forEach(v => {
    v.state = 1;
    v.stateText = '未签收';
  });
  await Purchase.update({ uniqueCode }, { state: 1, stateText: '未签收', goodsList: data.goodsList });
  ctx.body = {
    result: 1,
    msg: '审核成功'
  };
}
/**
 * 签收采购
 */
async function sign (ctx) {
  let uniqueCode = ctx.request.body.uniqueCode;
  await Purchase.update({ uniqueCode }, { state: 2, stateText: '已签收' });
  ctx.body = {
    result: 1,
    msg: '签收成功'
  };
}
module.exports = {
  createOne,
  findMany,
  check,
  sign
};
