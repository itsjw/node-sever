import Koa from 'koa';
import compose from 'koa-compose';
import logger from 'koa-logger';
import koaBody from 'koa-body';
import Router from 'koa-router';
import cors from 'koa-cors';

const WebSocket = require('ws');
// import WebSocket from 'ws';

// import { reg } from './components';

const app = new Koa();
const route = new Router();

const ws = new WebSocket.Server({ port: 7890 });

ws.on('connection', async (socket) => {
  //获取的socket对象，在这里可理解为一个连接，一般来说，你需要把它存起来，一般是存进一个数组，以便于对连接的管理
  console.log(`开始连接`);

  let s = '';

  socket.onopen = () => {
    console.log(`连接成功`)
  }

  socket.onmessage = async (msg) => {
    s = msg.data;
    console.log(`收到消息`, msg.data);
    socket.send(JSON.stringify({ msg: `来了！` }));
  }

  socket.onerror = (err) => {
    console.log(err);
  };

  socket.onclose = (e) => {
    console.log('连接关闭', s)
  }

});


const main = async function (ctx) {
  ctx.body = 'ok index';
}

route.post('/test', async function (ctx) {
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Access-Control-Allow-Origin', '*');
  // this.body = { msg: 'ok le' };
  console.log('post ok')
  ctx.body = { ok: 'post ok' };
})

const all = compose([
  logger(),
  // cors(),
  koaBody(),
  route.routes(),
  route.allowedMethods(),
  main,
])

app.use(all);


app.listen(7899, () => console.log('server started 7899'));