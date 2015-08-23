var config = require('./config');
var send = require('koa-send');
var fse = require('fs-extra');
var Promise = require('promise');
var koaBody = require('koa-body');

var move = Promise.denodeify(fse.move)

module.exports = function(router, model){

	var badgay = function(owner){
		owner.status = 403
		owner.body = {
			err: 1,
			msg: "You Bad Bad"
		}
	}
	var checkLogin = function*(next){
		if(this.session.logined){
			yield next
		}else{
			badgay(this)
		}
	}

	router.get('/', function *(next){
		yield send(this, '/index.html', {root: "./static"})
	})

	router.get('/static/:path', function* static(next){
		yield send(this, this.path.replace('/static', "", 1), {root: "./static"})
	})

	router.get('/api/post', function*(){
		var page = parseInt(this.query.page)
		var self = this
		page = page > 0 ? page : 1
		yield model.Posts.findAll({
			where: {
				published: {
					$ne: null
				},
			},
			offset: (page - 1) * 10,
			limit: 10
		}).then(function(result){
			self.body = {
				err: 0,
				data: result
			}
		})
	})

	router.get('/api/post/:id', function* post(next){
		var self = this
		yield model.Posts.findOne({
			where: {
				id: parseInt(this.params.id),
				published: {
					$ne: null
				}
			}
		}).then(function(data){
			self.body = {
				data: data,
				err: 0
			}
		})
	})

	router.put('/api/post', checkLogin, koaBody(), function*(next){
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
	})

	router.post('/api/post/:id', checkLogin, koaBody(), function*(next){
		var self = this
		var body = this.request.body
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
	})

	router.post('/api/upload', checkLogin, koaBody({multipart: true}), function*(next){
		var promises = [],
			datas = [],
			self = this;
		for(var key in this.request.body.files){
			var file = this.request.body.files[key];
			var p = Promise.resolve(file).then(function(file){
				return model.Uploaded.create({
					name: file.name,
					size: file.size,
					mime: file.type,
				}).then(function(data){
					datas.push(data)
					return move(file.path, config.upload.path + data.id).then(function(){
						console.log('moved file', file.path)
					})
				})
			})
			promises.push(p)
		}
		yield Promise.all(promises).then(function(){
			self.body = {
				err: 0,
				data: datas
			}
		});
	})

	router.post('/api/auth', koaBody(), function* admin_user_auth(next){
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

	router.get('/api/logout', function*(){
		this.session = null
		this.body = {
			err: 0,
			msg: 'Logout success'
		}
	})

	router.get('/api/status', function*(){
		this.body = {
			logined: this.session.logined ? this.session.logined : false,
		}
	})
}