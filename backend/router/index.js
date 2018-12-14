const Router = require('koa-router');
const User = require('./User');
const Purchase = require('./Purchase');
const router = new Router();
const UserCtrl = require('../controller/User');

router.post('/login', async (ctx) => {
  let user = await UserCtrl.findOne(ctx);
  if (user) {
    ctx.body = {
      result: 1,
      msg: '登陆成功',
      data: {
        username: user.username,
        nickname: user.nickname,
        department: user.department,
        position: user.position,
        phoneNumber: user.phoneNumber
      }
    };
  } else {
    ctx.body = {
      result: 0,
      msg: '用户名或密码错误！'
    };
  }
});
router.use('/user', User.routes(), User.allowedMethods());
router.use('/purchase', Purchase.routes(), Purchase.allowedMethods());
module.exports = router;
