import Koa from 'koa';
import compose from 'koa-compose';
import logger from 'koa-logger';
import koaBody from 'koa-body';


import { reg } from './components';

const app = new Koa();

const all = compose([
  logger(),
  koaBody(),
  reg
])

app.use(all);

app.listen(7899, () => console.log('server started 7899'));