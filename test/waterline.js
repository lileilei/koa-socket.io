/**
 * 演示 waterilne 的使用
 */

var Waterline = require('waterline');
// var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');
// 适配器
var adapters = {
    mongo: mongoAdapter,
    default: 'mongo'
};
// 连接
var connections = {
    mongo: {
        adapter: 'mongo',
        url: 'mongodb://localhost/scms'
    }
};
// 数据集合
var User = Waterline.Collection.extend({
    identity: 'user',
    connection: 'mongo',
    schema:true,
    attributes: {
        title: {type: 'string'},
        content: {type: 'string'}
    }
});
var orm = new Waterline();
// 加载数据集合
orm.loadCollection(User);

var config = {
    adapters: adapters,
    connections: connections
}
//
orm.initialize(config, function(err, models){
    if(err) {
        console.error('orm initialize failed.', err);
        return;
    }
    models.collections.user.create({title: 'first datasouse',content:'fuck mongo and mysql'}, function(err, user){
        console.log('after user.create, err, user:', err, user);
    });
});