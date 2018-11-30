const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controller/User');
router.post('/', Ctrl.createOne);
router.get('/', Ctrl.findMany);
router.post('/delete', Ctrl.deleteMany);
router.post('/getUser', Ctrl.getUser);
router.post('/update', Ctrl.update);
module.exports = router;
