const Router = require('koa-router');
const router = new Router();
const StockInReqCtrl = require('../../controller/wms/StockinRequisition');
const GoodsCtrl = require('../../controller/wms/Goods');
const TranshipCtrl = require('../../controller/wms/Transship');
const Stocktaking = require('../../controller/wms/Stocktaking');

router.get('/stock-in-req', StockInReqCtrl.findMany);
router.post('/stock-in', StockInReqCtrl.stockIn);

router.get('/goods', GoodsCtrl.findMany);
router.post('/create-goods', GoodsCtrl.createOne);
router.get('/mini-goods-list', GoodsCtrl.findManyWithFuzzy);

router.get('/transship', TranshipCtrl.findMany);
router.post('/apply-transship', TranshipCtrl.createOne);
router.post('/check-transship', TranshipCtrl.check);
router.post('/execute-transship', TranshipCtrl.execute);
router.post('/finish-transship', TranshipCtrl.finish);

router.get('/stocktaking', Stocktaking.findMany);
router.post('/apply-stocktaking', Stocktaking.createOne);

module.exports = router;
