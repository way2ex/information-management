const Stockout = require('../../model/wms/Stockout');
const Goods = require('../../model/wms/Goods');
const Locations = require('../../model/wms/Locations');
const { findManyGenerator } = require('../../common/utils');
const dateTime = require('date-time');
/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'applicant', 'state'], Stockout);

/**
 * 新建出库单
 */
async function create (ctx) {
  let { username, goodsList } = ctx.request.body;
  let uniqueCode = +new Date();
  let newData = new Stockout({
    uniqueCode, applicant: username, applicatingDate: dateTime(),
    goodsList,
    state: 0, stateText: '待处理',
    resource: '人工开单', resourceCode: 2,
    processor: ''
  });
  await newData.save();
  ctx.body = {
    result: 1,
    message: '创建出库单成功！'
  };
}
/**
 * 开始处理
 */
async function start (ctx) {
  let { uniqueCode, username } = ctx.request.body;
  await Stockout.update({ uniqueCode }, {
    state: 1,
    stateText: '正在处理',
    processor: username
  });
  ctx.body = {
    result: 1,
    message: '出库成功'
  };
}

/**
 * 录入出库数据
 */
async function enterStockout (ctx) {
  let { uniqueCode, goodsList } = ctx.request.body;

  // 更新商品信息
  // let updateProArr = [];
  goodsList.forEach(async (goods) => {
    let goodsFromDB = await Goods.findOne({ uniqueCode: goods.uniqueCode });
    goods.positions.forEach((pos) => {
      goodsFromDB.positions.find(v => v.uniqueCode === pos.uniqueCode).amount -= pos.outAmount;
    });
    goodsFromDB.amount -= goods.outAmount;
    console.log(goodsFromDB);
    await Goods.update({ uniqueCode: goods.uniqueCode },
      { amount: goodsFromDB.amount, positions: goodsFromDB.positions }
    );
  });

  // 更新位置信息

  goodsList.forEach((goods) => {
    goods.positions.forEach(async (pos) => {
      let posFromDB = await Locations.findOne({ uniqueCode: pos.uniqueCode });
      posFromDB.amount -= pos.outAmount;
      await Locations.update({ uniqueCode: pos.uniqueCode },
        { amount: posFromDB.amount });
    });
  });

  await Stockout.update({ uniqueCode }, {
    state: 2,
    stateText: '已完成',
    goodsList
  });
  ctx.body = {
    result: 1,
    message: '出库成功'
  };
}

module.exports = {
  findMany,
  create,
  start,
  enterStockout
};
