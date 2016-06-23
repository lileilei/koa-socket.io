/**
 * Created by lilei on 2016/6/22.
 */
var app = require('koa')()
    , koa = require('koa-router')()
    , logger = require('koa-logger')
    , json = require('koa-json')
    , views = require('koa-views');

// normal route
app.use(function* (next) {
    if (this.path !== '/') {
        return yield next
    }

    this.body = 'hello world'
});

// /404 route
app.use(function* (next) {
    if (this.path !== '/404') {
        return yield next;
    }

    this.body = 'page not found'
});

// /500 route
app.use(function* (next) {
    if (this.path !== '/500') {
        return yield next;
    }

    this.body = 'internal server error'
});


app.listen(80);