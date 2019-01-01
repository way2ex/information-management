const StockinRequisition = require('../../model/wms/StockinRequisition');
const Goods = require('../../model/wms/Goods');
const { findManyGenerator } = require('../../common/utils');
/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'applicant', 'state'], StockinRequisition);
/**
 * 入库
 * goodsList: [{ goodsName, uniqueCode, id, amount, startLine, startShelf, startCol, startLayer, end... }]
 */
async function stockIn (ctx) {
  let body = ctx.request.body;
  await StockinRequisition.update({ uniqueCode: body.uniqueCode }, {
    processor: body.username,
    state: 1,
    stateText: '已入库',
    goodsList: body.goodsList
  });

  let goodsList = body.goodsList;
  // 对数据进行合并处理
  let helperObj = {};
  let helper = (goods) => {
    let keys = ['startLine', 'startShelf', 'startCol', 'startLayer', 'endLine', 'endShelf', 'endCol', 'endLayer', 'amount'];
    let result = {};
    keys.forEach((v) => {
      result[v] = goods[v];
    });
    return result;
  };

  goodsList.forEach((v) => {
    if (helperObj[v.uniqueCode]) {
      helperObj[v.uniqueCode].amount += +v.amount;
      helperObj[v.uniqueCode].positions.push(helper(v));
    } else {
      helperObj[v.uniqueCode] = {
        uniqueCode: v.uniqueCode,
        amount: 0,
        positions: []
      };
      helperObj[v.uniqueCode].amount += +v.amount;
      helperObj[v.uniqueCode].positions.push(helper(v));
    }
  });

  let promises = Object.values(helperObj).map((v) => {
    return Goods.findOne({ uniqueCode: v.uniqueCode });
  });
  let result = await Promise.all(promises);
  let arr = [];

  for (let i = 0; i < result.length; i++) {
    result[i].positions.push(...helperObj[result[i].uniqueCode].positions);
    arr.push(Goods.update({ uniqueCode: result[i].uniqueCode }, {
      amount: result[i].amount + helperObj[result[i].uniqueCode].amount,
      positions: result[i].positions
    }));
  }
  await Promise.all(arr);

  ctx.body = {
    result: 1,
    msg: '入库成功'
  };
}
module.exports = {
  findMany,
  stockIn
};
