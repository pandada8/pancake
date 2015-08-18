var Sequelize = require('sequelize')
var crypto = require('crypto')
var config = require('./config')
var prompt = require('prompt')

function randomStr(length){
    length = length == undefined ? 10 : length;
    return Math.round(Math.random()*Math.pow(36, length)).toString(36);
}

function encrypt(password, salt){
    return crypto.createHash('sha1').update(password + salt + "@").digest("hex")
}

var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: "postgres",
    pool:{
        max: 5,
        min: 0,
        idle: 2000,
    }
})

var Posts = sequelize.define('Post', {
    title: {
        type: Sequelize.STRING,
        unique: true
    },
    content: Sequelize.TEXT("long"),
    published: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

var Uploaded = sequelize.define('Uploaded', {
    path: Sequelize.STRING,
    size: Sequelize.INTEGER,
    mime: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

var Users = sequelize.define('Users', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: {
        set: function(password){
            var salt = randomStr(20)
            var password = encrypt(password, salt)
            this.setDataValue("password", password)
            this.setDataValue("salt", salt)
        },
        type: Sequelize.STRING
    },
    salt: Sequelize.STRING
})

module.exports = {
    "Users": Users,
    "Uploaded": Uploaded,
    "Posts": Posts,
    "encrypt": encrypt,
    "init": function(){
        sequelize.sync().then(function(){
            console.log('Finish init the datebase')
            prompt.start()
            prompt.get(['name', 'email', 'password'], function(err, result){
                if(result.name && result.email && result.password){
                    Users.build(result).save().then(function(){
                        console.log('Create the admin user successfully')
                    })
                }
            })

        })
    }
}