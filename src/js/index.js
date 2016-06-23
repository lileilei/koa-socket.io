/**
 * Created by lilei on 2016/6/21.
 */
var io = require('socket.io-client');
var $ = require('jquery');
var socket = io('http://192.168.90.166');
socket.on('news', function (data) {
    document.getElementById('rect').innerHTML=100+data.num;
    document.getElementById('rect').style.width=100+data.num+"px";
    socket.emit('my other event', { my: 'data' });
});
console.log(document.getElementById('rect').style.width);
document.getElementById('rect').style.width=200+"px";