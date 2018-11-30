const Purchase = require('../model/Purchase');

/**
 * 创建新的订购单
 */
async function createOne (ctx) {
  let { goodsName, packingSpec, amount, price, provider, purchaser,
    pruchasingDate, state, extra } = ctx.request.body;
  let id = Purchase.count();
  let uniqueCode = id.toString().paddingLeft(10);
  const newPurchase = new Purchase({
    uniqueCode, goodsName, packingSpec, amount, price, provider, purchaser, pruchasingDate, state, extra
  });
  await newPurchase.save();
  ctx.body = {
    result: 1,
    msg: '新建成功'
  };
}
