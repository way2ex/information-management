const dateTime = require('date-time');
const Purchase = require('../model/Purchase');
const StockinRequisition = require('../model/wms/StockinRequisition');
/**
 * 创建新的订购单''
 * goodsList: [{ id: 1, goodsName: '', amount: 10, price: '', totalPrice: '', state: 1, stateText: '' }]
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
  let { uniqueCode, id, username } = ctx.request.body;
  let data = await Purchase.findOne({ uniqueCode });
  let newRequisitionParams = {
    applicatingDate: dateTime(),
    state: 0,
    stateText: '未处理',
    processor: '',
    extra: ''
  };

  if (!id) {
    data.goodsList.forEach(v => {
      v.state = 2;
      v.stateText = '已签收';
    });
    await Purchase.update({ uniqueCode }, { state: 3, stateText: '全部签收', goodsList: data.goodsList });
    // 生成入库申请
    let goodsList = data.goodsList.map(v => ({ id: v.id, goodsName: v.goodsName, amount: v.amount }));
    let newUniqueCode = +new Date();
    const newRequisition = new StockinRequisition({
      uniqueCode: newUniqueCode, goodsList, applicant: username, ...newRequisitionParams
    });
    await newRequisition.save();
  } else {
    let goods = data.goodsList.find((v) => { return v.id === +id; });
    goods.state = 1;
    goods.stateText = '已签收';
    await Purchase.update({ uniqueCode }, { state: 2, stateText: '部分签收', goodsList: data.goodsList });

    // 生成入库申请
    let newUniqueCode = +new Date();
    let goodsList = [{ id: goods.id, goodsName: goods.name, amount: goods.amount }];
    const newRequisition = new StockinRequisition({
      uniqueCode: newUniqueCode, goodsList, applicant: username, ...newRequisitionParams
    });
    await newRequisition.save();
  }

  ctx.body = {
    result: 1,
    msg: '签收成功, 已生成入库单'
  };
}
module.exports = {
  createOne,
  findMany,
  check,
  sign
};
