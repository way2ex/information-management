const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controller/Purchase');

router.get('/', Ctrl.findMany);
router.post('/add', Ctrl.createOne);
router.post('/check', Ctrl.check);
router.post('/sign', Ctrl.sign);

module.exports = router;
