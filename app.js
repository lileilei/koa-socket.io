/** Created by lilei on 2016/6/21.*/
var app = require('koa')()
    , koa = require('koa-router')()
    , logger = require('koa-logger')
    , json = require('koa-json')
    , views = require('koa-views');

// global middlewares
app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname+"/src/view"));
app.use(logger())

koa.get('/',function* (next){
     yield this.render('index.html');
});
koa.get('/user',function* (next){
    this.body= "我是用户页面"
});
app.use(koa.routes());


var server = require('http').Server(app.callback()),
    io = require('socket.io')(server);

io.on('connection', function (socket) {
    setInterval(function () {
        socket.emit('news', { num: parseInt(Math.random()*100) });
    },500);

    socket.on('my other event', function (data) {
    });
});
app.on('error', function (err, ctx) {
    logger.error('server error', err, ctx);
});
server.listen(process.env.PORT);