const StockinRequisition = require('../../model/wms/StockinRequisition');
const Goods = require('../../model/wms/Goods');
const Locations = require('../../model/wms/Locations');
const { findManyGenerator } = require('../../common/utils');
/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'applicant', 'state'], StockinRequisition);
/**
 * 入库
 * goodsList: [{ goodsName, uniqueCode, amount, positions: [{ id: 1, line: '1', amount: 3 }] }]
 * 1. 更新商品信息
 * 2. 更新货位信息
 */
async function stockIn (ctx) {
  let body = ctx.request.body;
  let goodsList = body.goodsList;

  // 更新商品信息
  let queryGoodsProArr = goodsList.map((goods) => {
    return Goods.findOne({ uniqueCode: goods.uniqueCode });
  });
  let goodsFromDB = await Promise.all(queryGoodsProArr);
  for (let i = 0; i < goodsList.length; i++) {
    goodsFromDB[i].amount += goodsList[i].amount;
    goodsList[i].positions.forEach((position) => {
      let indexOfPos = goodsFromDB[i].positions.findIndex((v) => { return v.uniqueCode === position.uniqueCode; });
      if (indexOfPos === -1) {
        goodsFromDB[i].positions.push({
          uniqueCode: position.uniqueCode,
          line: position.line,
          shelf: position.shelf,
          col: position.col,
          layer: position.layer,
          amount: position.amount
        });
      } else {
        goodsFromDB[i].positions[indexOfPos].amount += +position.amount;
      }
    });
    goodsFromDB[i].positions = goodsFromDB[i].positions.sort((pre, cur) => {
      return +pre.line < +cur.line ? -1
        : +pre.line > +cur.line ? 1
          : pre.shelf < cur.shelf ? -1
            : pre.shelf > cur.shelf ? 1
              : +pre.col < +cur.col ? -1
                : +pre.col > +cur.col ? 1
                  : +pre.layer < +cur.layer ? -1
                    : +pre.layer > +cur.layer ? 1
                      : 0;
    });
  }
  let updateGoodsProArr = goodsFromDB.map((item) => {
    return Goods.update({ uniqueCode: item.uniqueCode }, {
      positions: item.positions, amount: item.amount
    });
  });
  await Promise.all(updateGoodsProArr);

  // 更新位置信息
  goodsList.forEach((goods) => {
    goods.positions.forEach(async (position) => {
      let positionFromDB = await Locations.findOne({ uniqueCode: position.uniqueCode });
      let obj = {};
      if (positionFromDB.state === 0) {
        obj.state = 1;
        obj.stateText = '使用中';
        obj.amount = position.amount;
        obj.goodsName = goods.goodsName;
        obj.goodsUniqueCode = goods.uniqueCode;
      } else {
        obj.amount = positionFromDB.amount + +position.amount;
      }
      await Locations.update({ uniqueCode: position.uniqueCode }, { ...obj });
    });
  });
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
