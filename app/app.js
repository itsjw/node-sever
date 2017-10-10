import Koa from 'koa';
import compose from 'koa-compose';
import logger from 'koa-logger';
import koaBody from 'koa-body';
import Router from 'koa-router';
import cors from 'koa-cors';

import WebSocket from 'ws';

// import { reg } from './components';

const app = new Koa();
const route = new Router();

const ws = new WebSocket.Server({ port: 7890 });

let socketStore = {};

ws.on('connection', async (socket) => {
  //获取的socket对象，在这里可理解为一个连接，一般来说，你需要把它存起来，一般是存进一个数组，以便于对连接的管理
  console.log(`开始连接`);

  let userId;

  socket.onopen = () => {
    console.log(`连接成功`)
  }

  socket.onmessage = async (e) => {
    // console.log(e)
    let sendData = JSON.parse(e.data);
    console.log(`收到消息`);

    if (sendData.init) {
      // 初始化连接，将成功连接的客户端推入 socketStore
      userId = `socet_${sendData.init}`
      socketStore[userId] = socket;
      console.log(`在线`, userId);
    } else if (sendData.data) {
      const { data, type } = sendData;
      if (type == 'user_qrcode') {
        const id = `socet_${data.kh}`;
        // console.log(socketStore[id], id, userId);
        if (socketStore[id]) {
          console.log(id + '扫码成功');
          socketStore[id].send(JSON.stringify({
            type, data: {
              ok: true,
            }
          }));
        } else {
          socket.send(JSON.stringify({
            type, data: {
              errmsg: `目标用户不在线`,
            }
          }));
        }
      } else if (type == 'jg_settle') {
        const id = `socet_${data.kh}`;
        console.log(id);
        if (socketStore[id]) {
          console.log(id + '交易成功');
          socketStore[id].send(JSON.stringify({
            type, data
          }));
        } else {
          socket.send(JSON.stringify({
            type, data: {
              errmsg: `目标用户不在线`,
            }
          }));
        }
      }
    }
  }

  socket.onerror = (err) => {
    console.log(err);
  };

  socket.onclose = (e) => {
    // 将断开的客户端推出 socketStore
    if (socketStore[userId]) delete socketStore[userId];
    console.log('离线', userId)
  }

});


const main = async function (ctx) {
  ctx.body = 'ok index';
}

route.post('/test', async function (ctx) {
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Access-Control-Allow-Origin', '*');
  // this.body = { msg: 'ok le' };
  let val = JSON.parse(ctx.request.body);
  console.log('post')
  ctx.body = { msg: `post is ${val.msg}` };
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