
var path = require('path');
var fs = require('fs');
var yargs = require('yargs').argv;
var gulp = require('gulp');
var clean = require('gulp-clean');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var server = require('gulp-develop-server');
var pkg = require('./package.json');

var option = {base: 'src'};
var dist = __dirname + '/public';
var banner = [
    '/*!',
    ' * simple-spa v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''].join('\n');

//清除目录文件
gulp.task("clear",function () {
    return gulp.src(['public/css', 'public/js'], {read: false})
        .pipe(clean())
});
//编译js
var b = yargs.w?browserify({
    entries: ['src/js/index.js'],
    cache: {},
    packageCache: {},
    debug:true,
    plugin: [watchify]
}):browserify({
    entries: ['src/js/index.js']
});
var bundle =yargs.w?function () {
    return b.bundle()
        .on('error', function (e) {
            console.log("js 编译错误！");
        })
        .pipe(source('simplesap.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js'));
}:function(){
    return b.bundle()
        .on('error', function (e) {
            console.log("js 编译错误！");
        })
        .pipe(source('simplesap.js'))
        .pipe(gulp.dest('./public/js'));
};
yargs.w && b.on('update', bundle);
gulp.task('build:script',bundle);
gulp.task('test',function () {
    browserify({
        entries: ['src/js/index.js'],
        cache: {},
        packageCache: {},
        debug:true,
        plugin: [watchify]
    }).bundle()
        .on('error', function (e) {
            console.log("js 编译错误！");
        })
        .pipe(source('simplesap.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
    browserify({
        entries: ['src/js/haha.js'],
        cache: {},
        packageCache: {},
        debug:true,
        plugin: [watchify]
    }).bundle()
        .on('error', function (e) {
            console.log("js 编译错误！");
        })
        .pipe(source('haha.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
})
//编译css
var buildLess=yargs.w?function (){
    gulp.src('src/style/*.less', option)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(less().on('error', function (e) {
            console.error("less 编译错误！"+e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano({
            zindex: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist));
}:function (){
    gulp.src('src/style/*.less', option)
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(less().on('error', function (e) {
            console.error("less 编译错误！"+e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(nano({
            zindex: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
};

gulp.task('build:style',buildLess );


// 启动服务
gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        proxy:"localhost",
        port: yargs.p,
        startPath: '/'
    });
});

gulp.task('server:start', function () {
    "use strict";
    server.listen({
        path: './app',
        env: {PORT: 80, NODE_ENV: 'development', DEBUG: 'hi~:'}
    },function (error) {
        if( ! error ) gulp.start('server');
    });
});
gulp.task('watch', ['release'], function () {
    gulp.watch('src/style/**/*', ['build:style']);
    gulp.watch(['src/view/*.html','src/js/**/*.js'], browserSync.reload);
    gulp.watch('./app.js', server.restart);
});

gulp.task('release', ['build:style', 'build:script','server:start'],function () {
    gulp.start('watch');
});

gulp.task('build', ['clear','build:style','build:script']);

// 参数说明
//  -w: 开发环境 实时监听
gulp.task('default', function () {
    if (yargs.w) {
        gulp.start('release');
    }else{
        gulp.start('build');
    }
});