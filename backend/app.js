const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('./router/index');
const mongoose = require('mongoose');
const CONFIG = require('./config');

const app = new Koa();
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8081');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  await next();
});
app.use(bodyParser());
app
  .use(router.routes())
  .use(router.allowedMethods());

mongoose.set('debug', true);
mongoose.connect(CONFIG.DATABASE, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.on('error', () => {
  console.log('connection error.');
});
connection.on('open', () => {
  console.log('database has been opened.');
});

app.listen(CONFIG.SERVER_PORT);
console.log('The server has started at ' + CONFIG.SERVER_PORT);
