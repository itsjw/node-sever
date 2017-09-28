// import mysql from 'mysql';
// var connection = mysql.createConnection({
// 	host: '127.0.0.1',
// 	user: 'root',
// 	password: '123456',
// 	database: 'test',
// 	port: '3306'
// });
// connection.connect();
export async function reg(ctx) {
	// ctx.body = { val: 'Hello World ok' }
	if (ctx.url == '/test') {
		let val = JSON.parse(ctx.request.body);
		console.log(ctx.request,val);
		ctx.body = { val: `test ok ${val.user}` }
	}
}
