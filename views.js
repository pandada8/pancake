var config = require('./config');
var send = require('koa-send')

module.exports = function(router, model, parser){
	router.get('/', function *(next){
		yield send(this, '/index.html', {root: "./static"})
		yield next
	})
	router.get('/static/:path', function* static(next){
		yield send(this, this.path.replace('/static', "", 1), {root: "./static"})
		yield next
	})

	router.get('/api/post/:id', function* post(next){
		var post = model.yield
	})



	router.post('/api/auth', parser, function* admin_user_auth(next){
		var self = this

		if (this.request.body && this.request.body.name && this.request.body.password){
			yield model.Users.findOne({
				where: {
					"name": self.request.body.name
				}
			}).then(function(user){
				if(user){
					self.session.logined = Date.now()
					self.sessionOptions.maxAge = 86400 * 10 * 1000  // ten days
					self.body = {
						err: 0,
						msg: "Logined success"
					}
				}else{
					self.body = {
						err: 1,
						msg: "You Bad Bad. Something happened"
					}
					self.status = 403;
				}
			})
		}else{
			this.status = 400
		}
	})
}