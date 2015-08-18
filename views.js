var config = require('./config');
var send = require('koa-send')

module.exports = function(router, model, parser){

	var badgay = function(owner){
		owner.status = 403
		owner.body = {
			err: 1,
			msg: "You Bad Bad"
		}
	}

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

	router.put('/api/post', parser, function*(next){
		if(this.session.logined){
			var self = this
			var body = this.request.body
			if(body && body.title && body.content){
				yield model.Posts.create(body).then(function(result){
					self.body = {
						err: 0,
						msg: "Success",
						data: result
					}
				})
			}else{
				badgay(this);
			}
		}else{
			badgay(this);
		}
	})

	router.post('/api/post/:id', parser, function*(next){
		console.log('111')
		if(this.session.logined){
			var self = this
			var body = this.request.body
			console.log(this.params)
			if (body && body.title && body.content && body.published != undefined && this.params.id != undefined){
				yield model.Posts.findOne({
					where: {
						id: self.params.id
					}
				}).then(function(post){
					if(post){
						var data = {};
						['content', 'title'].forEach(function(key){
							data[key] = body[key]
						})
						data['published'] = body['published'] ? new Date() : null
						return post.updateAttributes(data).then(function(data){
							console.log('!')
							self.body = {
								err: 0,
								msg: "update success",
								data: data
							}
						})
					}else{
						badgay(self)
					}
				})
			}else{
				badgay(self)
			}
		}
	})

	router.post('/api/auth', parser, function* admin_user_auth(next){
		var self = this

		if (this.request.body && this.request.body.name && this.request.body.password){
			yield model.Users.findOne({
				where: {
					"name": self.request.body.name
				}
			}).then(function(user){
				if(user && model.encrypt(self.request.body.password, user.salt) == user.password){
					self.session.logined = Date.now()
					self.sessionOptions.maxAge = 86400 * 10 * 1000  // ten days
					self.body = {
						err: 0,
						msg: "Logined success"
					}
				}else{
					badgay(self);
				}
			})
		}else{
			this.status = 400
		}
	})
}