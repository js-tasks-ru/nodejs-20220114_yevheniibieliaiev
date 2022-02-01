const path = require('path');
const Koa = require('koa');
const app = new Koa();
const events = require('events');//не сразу я пришел к мысли использовать EventEmitter :)

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const eventEmitter = new events.EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise(resolve => eventEmitter.once('userMessage', msg => resolve(msg)));
  ctx.status = 200;
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;
  if (msg) {
    await new Promise(resolve => resolve(eventEmitter.emit('userMessage', msg)));
    ctx.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
