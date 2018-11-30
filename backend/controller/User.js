const User = require('../model/User');

/**
 * create a user
 * @param {Object} ctx ctx
 */
async function createOne (ctx) {
  let user = await findOne(ctx);
  if (user) {
    ctx.body = {
      result: 0,
      msg: '用户账号已存在！'
    };
    return;
  }
  // Create New Todo from payload sent and save to database
  const newUser = new User(ctx.request.body);
  const savedUser = await newUser.save();
  ctx.body = {
    result: 1,
    msg: '新建成功',
    data: {
      username: savedUser.username,
      nickname: savedUser.nickname
    }
  };
}

async function findOne (ctx) {
  let user = await User.findOne({ username: ctx.request.body.username });
  return user;
}
async function getUser (ctx) {
  let user = await findOne(ctx);
  if (!user) {
    ctx.body = {
      result: 0,
      msg: '无法找到该用户，请确认该用户账号存在！'
    };
    return;
  }
  ctx.body = {
    result: 1,
    msg: '获取用户信息成功',
    data: user
  };
}
/**
 * 根据条件查询
 */
async function findMany (ctx) {
  let filterKeys = ['nickname', 'username', 'department', 'position', 'state'];
  let query = ctx.request.query;
  let condition = {};
  for (let key of filterKeys) {
    query[key] && (condition[key] = query[key]);
  }
  // let users = await User.find(condition).skip(query.pageSize * (query.currentPage - 1)).limit(query.pageSize).count();
  let result = await User.paginate(condition, { page: +query.currentPage, limit: +query.pageSize });
  let users = result.docs.map(v => {
    delete v.password;
    return v;
  });
  ctx.body = {
    result: 1,
    msg: '查询成功',
    data: {
      data: users,
      total: result.total
    }
  };
}

// 批量删除
async function deleteMany (ctx) {
  let body = ctx.request.body;

  let result = await User.deleteMany({ _id: { $in: body.items } });
  // result : {n: 删除的数量， ok: 1}
  ctx.body = {
    result: 1,
    msg: `成功删除${result.n}项`
  };
}

// 更新用户信息
async function update (ctx) {
  let body = ctx.request.body;
  let condition = { username: body.username };
  let update = { $set: body };
  let result = await User.update(condition, update);
  if (result.n === 1) {
    ctx.body = {
      result: 1,
      msg: '更新成功'
    };
  } else {
    ctx.body = {
      result: 0,
      msg: '未更新任何数据，请检查输入是否正确'
    };
  }
}
module.exports = {
  createOne,
  findOne,
  findMany,
  deleteMany,
  update,
  getUser
};
