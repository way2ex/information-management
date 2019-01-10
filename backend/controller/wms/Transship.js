const Transship = require('../../model/wms/Transship');
const Goods = require('../../model/wms/Goods');
const Locations = require('../../model/wms/Locations');
const { findManyGenerator } = require('../../common/utils');
const dateTime = require('date-time');

/**
 * 按条件查找
 */
const findMany = findManyGenerator(
  ['uniqueCode', 'goodsUniqueCode', 'goodsName', 'applicant',
    'processor', 'state', 'executor'],
  Transship);

/**
 * 新建调拨申请
 */
async function createOne (ctx) {
  let uniqueCode = +new Date();
  let { goodsUniqueCode, goodsName, amount, transshipAmount, details, username, extra } = ctx.request.body;
  let applicatingDate = dateTime();
  let newTransship = new Transship({
    uniqueCode, goodsUniqueCode, goodsName, amount, transshipAmount, applicatingDate,
    applicant: username, processor: '', state: 0, stateText: '待审核', extra, details
  });
  await newTransship.save();
  ctx.body = {
    result: 1,
    msg: '新建成功'
  };
}
/**
 * 审核
 */
async function check (ctx) {
  let { uniqueCode, extra, username, isApproved } = ctx.request.body;
  let checkDate = dateTime();

  await Transship.update({ uniqueCode }, {
    state: isApproved ? 1 : -1,
    stateText: isApproved ? '已通过待处理' : '审核未通过',
    processor: username,
    checkExtra: extra,
    checkDate
  });
  ctx.body = {
    result: 1,
    msg: '审核成功'
  };
}

/**
 * 执行
 */
async function execute (ctx) {
  let { uniqueCode, username } = ctx.request.body;
  await Transship.update({ uniqueCode }, {
    state: 2,
    stateText: '正在处理',
    executor: username,
    executingDate: dateTime()
  });
  ctx.body = {
    result: 1,
    msg: '更改状态成功'
  };
}
/**
 * 执行完成
 */
async function finish (ctx) {
  let { uniqueCode, username } = ctx.request.body;
  let result = await Transship.findOne({ uniqueCode });
  if (username !== result.executor) {
    ctx.body = {
      result: 0,
      msg: '调拨执行者需和完成人保持一致！'
    };
    return;
  }
  // 更新商品信息
  let { goodsUniqueCode, goodsName, details } = result;
  let targetGoods = await Goods.findOne({ uniqueCode: goodsUniqueCode });
  details.forEach(async (detail) => {
    let { amount, outLine, outShelf, outCol, outLayer, inLine, inShelf, inCol, inLayer } = detail;
    let outPosCode = outLine + outShelf + outCol + outLayer;
    let outPosIndex = targetGoods.positions.findIndex(v => v.uniqueCode === outPosCode);
    // 调出货位一定存在， 这里可以对调出数量进行校验和限制
    targetGoods.positions[outPosIndex].amount -= amount;
    if (targetGoods.positions[outPosIndex].amount === 0) {
      targetGoods.positions.splice(outPosIndex, 1);
    }

    let inPosCode = inLine + inShelf + inCol + inLayer;
    let inPosIndex = targetGoods.positions.findIndex(v => v.uniqueCode === inPosCode);
    if (inPosIndex === -1) {
      // 新位置
      targetGoods.positions.push({
        uniqueCode: inPosCode, line: inLine, shelf: inShelf, col: inCol, layer: inLayer, amount
      });
    } else {
      targetGoods.positions[inPosIndex].amount += amount;
    }

    // 更新位置信息
    let position = await Locations.findOne({ uniqueCode: outPosCode });
    // 这里可以对调出数量进行校验和限制
    position.amount -= amount;
    await Locations.update({ uniqueCode: outPosCode }, { amount: position.amount });
    position = await Locations.findOne({ uniqueCode: inPosCode });
    if (position.state === 0) {
      await Locations.update({ uniqueCode: inPosCode }, {
        amount, goodsUniqueCode, goodsName,
        state: 1, stateText: '使用中'
      });
    } else {
      await Locations.update({ uniqueCode: inPosCode }, { amount: position.amount + amount });
    }
  });
  await Goods.update({ uniqueCode: goodsUniqueCode }, { positions: targetGoods.positions });
  await Transship.update({ uniqueCode }, {
    state: 3,
    stateText: '已完成',
    executor: username,
    executingDate: dateTime()
  });
  ctx.body = {
    result: 1,
    msg: '更改状态成功'
  };
}

module.exports = {
  findMany,
  createOne,
  check,
  execute,
  finish
};
