<style lang="less">
    body::before{
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        content: " ";
        display: block;
        background-image: url("/static/bg.jpg");
        background-attachment: fixed;
        background-size: cover;
        background-position: center;
        z-index: -2;
    }
	body{
        .header {
            height: 100vh;
            text-align: center;
            color: #333;
            position: relative;
            width: 100%;
            transition: height 0.5s;
            display: block;
        }
        transition: all .5s;
        background-color: rgba(0, 0, 0, 0.1);
        .display-wrapper{
            position: absolute;
            height: auto;
            width: 100%;
            margin-top: 100px;
            transition: margin-top .5s;
        }
        h1{
            span{
                padding: 0em 10/28em;
                display: inline-block;
                border-radius: 1/28em;
                font-family: "Dosis";
                text-transform: capitalize;
                -webkit-text-stroke: 1/28em #eee;
                color: transparent;
                font-size: 3em;
                border: solid 1/28em #eee;
                transition: all .5s;
            }
        }
        &.small{
            background-color: rgba(0, 0, 0, 0.5);    
            .header{
                height: 280px;
            }
            h1 span{
                font-size: 2em;
            }
            a{
                font-size: 1.5em;
            }
            .display-wrapper{
                margin-top: 50px;
            }
        }
        ul{
            display: block;
            margin: 0;
            padding: 0;
        }
        li{
            display: inline-block;
            margin: 0;
            padding: 0;
            a{
                font-family: "Dosis";
                font-size: 2em;
                color: white;
                &:hover, &:visited, &:focus {
                    color: white;
                }
            }
        }
    }
    .container{
        max-width: 1200px;
        padding: 40px 0;
        margin: auto;
    }
    .post{
        background: white;
        margin: 0px 100px;
        border-radius: 5px;
        padding: 2em 1em;
        box-shadow: 0px 1px 3px #ccc;
        h2.title {
            border-bottom: solid 1px #eee;
        }
    }
</style>
<template>
    <div class="header">
        <div class="display-wrapper">
            <h1><span>{{Title}}</span></h1>
            <ul class="links">
                <li>
                    <a v-link="/posts/">Posts</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="container">
        <div class="posts">
            <div class="post" v-repeat="post in posts">
                <h2 class="title">{{post.title}}</h2>
                <div class="content">{{{post.content | markdown}}}</div>
            </div>
        </div>
    </div>
</template>

<script>
var request = require('superagent');
module.exports = {
    data: function(){
        return {
            Title: "pancake",
            posts: []
        }
    },
    created: function(){
        request.get("/api/post")
            .end(function(errs, resp){
                console.log(resp)
                console.log("load ", resp.body.data.length, " posts")
                this.$set("posts", resp.body.data)
            }.bind(this))
    }
}
</script>