const Stocktaking = require('../../model/wms/Stocktaking');
const StockinRequisition = require('../../model/wms/StockinRequisition');
const Stockout = require('../../model/wms/Stockout');
const { findManyGenerator } = require('../../common/utils');
const dateTime = require('date-time');

/**
 * 按条件查找
 */
const findMany = findManyGenerator(
  ['uniqueCode', 'applicant', 'state', 'executor'],
  Stocktaking);

/**
 * 新建盘点申请
 */
async function createOne (ctx) {
  let uniqueCode = +new Date();
  let { goodsList, username, extra } = ctx.request.body;
  let applicatingDate = dateTime();
  let newStocktaking = new Stocktaking({
    uniqueCode, applicatingDate, goodsList,
    applicant: username, executor: '', executingDate: '', state: 0, stateText: '待处理', extra
  });
  await newStocktaking.save();
  ctx.body = {
    result: 1,
    msg: '新建成功'
  };
}

/**
 * 开始盘点
 */
async function start (ctx) {
  let { uniqueCode, username } = ctx.request.body;
  await Stocktaking.update({ uniqueCode }, {
    state: 1,
    stateText: '正在盘点',
    executor: username,
    executingDate: dateTime()
  });
  ctx.body = {
    result: 1,
    msg: '更改状态成功'
  };
}
/**
 * 录入结果
 */
async function enterResult (ctx) {
  let { uniqueCode, username, goodsList } = ctx.request.body;
  let result = await Stocktaking.findOne({ uniqueCode });
  if (username !== result.executor) {
    ctx.body = {
      result: 0,
      msg: '调拨执行者需和完成人保持一致！'
    };
    return;
  }
  await Stocktaking.update({ uniqueCode }, {
    state: 2,
    stateText: '已录入结果',
    executor: username,
    executingDate: dateTime(),
    goodsList
  });
  ctx.body = {
    result: 1,
    msg: '更改状态成功'
  };
}
/**
 * 生成出入库单
 */
async function createInAndOut (ctx) {
  let { uniqueCode, username } = ctx.request.body;
  let dataFromDB = await Stocktaking.findOne({ uniqueCode: uniqueCode });
  let goodsList = dataFromDB.goodsList;

  let baseUniqueCode = +new Date();
  let stockinGoodsList = goodsList
    .filter(v => v.gap > 0)
    .map(v => ({
      id: v.id,
      uniqueCode: v.uniqueCode,
      goodsName: v.goodsName,
      amount: v.gap
    }));
  let stockoutGoodsList = goodsList
    .filter(v => v.gap < 0)
    .map(v => ({
      id: v.id,
      uniqueCode: v.uniqueCode,
      goodsName: v.goodsName,
      amount: v.amount,
      outAmount: -v.gap
    }));
  if (stockinGoodsList.length) {
    let newStockin = new StockinRequisition({
      uniqueCode: baseUniqueCode,
      goodsList: stockinGoodsList,
      applicant: username,
      applicatingDate: dateTime(),
      state: 0,
      stateText: '待处理',
      processor: '',
      extra: ''
    });
    await newStockin.save();
  }
  if (stockoutGoodsList.length) {
    let newStockout = new Stockout({
      uniqueCode: baseUniqueCode,
      applicant: username,
      applicatingDate: dateTime(),
      goodsList: stockoutGoodsList,
      state: 0,
      stateText: '待处理',
      resource: '盘点出库', resourceCode: 1,
      processor: ''
    });
    await newStockout.save();
  }

  // await Stocktaking.update({ uniqueCode }, {
  //   state: 3,
  //   stateText: '已生成出入库申请'
  // });
  ctx.body = {
    result: 1,
    msg: '生成出入库申请已完成'
  };
}
module.exports = {
  findMany,
  createOne,
  start,
  enterResult,
  createInAndOut
};
