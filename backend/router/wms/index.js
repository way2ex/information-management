const Router = require('koa-router');
const router = new Router();
const StockInReqCtrl = require('../../controller/wms/StockinRequisition');
const GoodsCtrl = require('../../controller/wms/Goods');

router.get('/stock-in-req', StockInReqCtrl.findMany);
router.post('/stock-in', StockInReqCtrl.stockIn);

router.get('/goods', GoodsCtrl.findMany);
router.post('/create-goods', GoodsCtrl.createOne);

module.exports = router;
