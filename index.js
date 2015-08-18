var process = require('process')

if (process.argv.length == 3 && process.argv[2] == 'init'){
    var model = require('./model');
    model.init()
}else{
    var koa = require('koa')
    var logger = require("koa-logger")
    var router = require('koa-router')();
    var model = require('./model');
    var parser = require('koa-body');
    var qs = require('koa-qs');
    var session = require('koa-session');

    require('./views')(router, model, parser());
    var app = koa()
    qs(app);
    app.keys = [Math.round(Math.random()*Math.pow(36, 40)).toString('36')]
    app.use(session(app))
    app.use(logger())
       .use(router.routes())
       .use(router.allowedMethods())
    console.info("The server is listening in port 3000")
    app.listen(3000)
}