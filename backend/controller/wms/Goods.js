const Goods = require('../../model/wms/Goods');
const { findManyGenerator } = require('../../common/utils');

/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'goodsName'], Goods);

/**
 * 新建商品
 */
async function createOne (ctx) {
  let uniqueCode = +new Date();
  let { goodsName, extra } = ctx.request.body;
  let newGoods = new Goods({ uniqueCode, goodsName, amount: 0, extra, position: [] });
  await newGoods.save();
  ctx.body = {
    result: 1,
    msg: '新建成功'
  };
}

/**
 * 模糊查询获取商品列表
 */
async function findManyWithFuzzy (ctx) {
  let { keyword } = ctx.request.query;
  let regex = new RegExp(keyword, 'i');
  let result = await Goods.find({
    $or: [
      { goodsName: { $regex: regex } },
      { uniqueCode: { $regex: regex } }
    ]
  });
  ctx.body = {
    result: 1,
    data: result
  };
}

module.exports = {
  findMany,
  createOne,
  findManyWithFuzzy
};
