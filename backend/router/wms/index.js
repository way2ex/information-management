const Router = require('koa-router');
const router = new Router();
const StockInReqCtrl = require('../../controller/wms/StockinRequisition');
const GoodsCtrl = require('../../controller/wms/Goods');
const TranshipCtrl = require('../../controller/wms/Transship');
const Stocktaking = require('../../controller/wms/Stocktaking');
const Locations = require('../../controller/wms/Locations');
const Stockout = require('../../controller/wms/Stockout');

router.get('/stock-in-req', StockInReqCtrl.findMany);
router.post('/stock-in', StockInReqCtrl.stockIn);

router.get('/goods', GoodsCtrl.findMany);
router.post('/create-goods', GoodsCtrl.createOne);
router.get('/mini-goods-list', GoodsCtrl.findManyWithFuzzy);
router.post('/get-goods-arr', GoodsCtrl.findWithList);

router.get('/transship', TranshipCtrl.findMany);
router.post('/apply-transship', TranshipCtrl.createOne);
router.post('/check-transship', TranshipCtrl.check);
router.post('/execute-transship', TranshipCtrl.execute);
router.post('/finish-transship', TranshipCtrl.finish);

router.get('/stocktaking', Stocktaking.findMany);
router.post('/apply-stocktaking', Stocktaking.createOne);
router.post('/start-stocktaking', Stocktaking.start);
router.post('/enter-result', Stocktaking.enterResult);
router.post('/create-in-out', Stocktaking.createInAndOut);

router.get('/locations', Locations.findMany);
router.get('/lines', Locations.getLines);
router.post('/create-line', Locations.createLine);

router.get('/stockout', Stockout.findMany);
router.post('/create-stockout', Stockout.create);
router.post('/start-stockout', Stockout.start);
router.post('/enter-stockout', Stockout.enterStockout);

module.exports = router;
