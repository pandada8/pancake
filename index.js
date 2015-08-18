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
    require('./views')(router, model, parser());
    var app = koa()
    app.use(logger())
       .use(router.routes())
       .use(router.allowedMethods())
    console.info("The server is listening in port 3000")
    app.listen(3000)
}