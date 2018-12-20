const findManyGenerator = (filterKeys, Model) => {
  return async function (ctx) {
    let query = ctx.request.query;
    let condition = {};
    for (let key of filterKeys) {
      query[key] && (condition[key] = query[key]);
    }
    let result = await Model.paginate(condition, { page: +query.currentPage, limit: +query.pageSize });
    ctx.body = {
      result: 1,
      msg: '查询成功',
      data: {
        data: result.docs,
        total: result.total
      }
    };
  };
};

module.exports = {
  findManyGenerator
};
