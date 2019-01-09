const Locations = require('../../model/wms/Locations');
const { findManyGenerator } = require('../../common/utils');
// const dateTime = require('date-time');
/**
 * 按条件查找
 */
const findMany = findManyGenerator(['uniqueCode', 'line', 'shelf'], Locations);

/**
 * 新建通道
 */
async function createLine (ctx) {
  const { line } = ctx.request.body;
  let curTime = +new Date() + '';
  let shelfArr = ['A', 'B'];
  let colArr = ['1', '2', '3', '4', '5'];
  let layerArr = ['1', '2', '3', '4'];
  let insertedArr = [];
  let basedLineData = {
    line,
    state: 0,
    stateText: '空闲',
    goodsName: '',
    goodsUniqueCode: ''
  };
  shelfArr.forEach((shelf) => {
    let basedShelfData = {
      ...basedLineData,
      shelf
    };
    colArr.forEach((col) => {
      let basedColData = {
        ...basedShelfData,
        col
      };
      layerArr.forEach((layer) => {
        insertedArr.push({
          ...basedColData,
          uniqueCode: line + shelf + col + layer,
          layer
        });
      });
    });
  });
  await Locations.insertMany(insertedArr);
  ctx.body = {
    result: 1,
    message: '创建成功'
  };
}

/**
 * 获取通道列表
 */
async function getLines (ctx) {
  let results = await Locations.distinct('line');
  ctx.body = {
    result: 1,
    data: results
  };
}

module.exports = {
  findMany,
  createLine,
  getLines
};
