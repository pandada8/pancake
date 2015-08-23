var a = require('./typo.css')
var Vue = require('vue')
var VueRouter = require('vue-router')
// require("typo.css")
Vue.use(VueRouter)
Vue.config.debug = true
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});
Vue.filter("markdown", function(value){
    return marked(value)
})
var router = new VueRouter({
	history: true,
	saveScrollPosition: true
})

router.map({
	"/": {
		component: require('./index.vue'),
		// subRoutes: {
			// "/": {
				// component: require('./index.vue')
			// }
			// "/post/:slug": {
			// 	component: require('./post.vue'),
			// },
			// "/page/:tag": {
			// 	component: require('./page.vue')
			// },
			// "*": {
			// 	component: require('./404.vue')
			// }
		// }
	},
})

router.redirect({
	"/about": "/page/about"
})
var App = Vue.extend({
    template: "<router-view></router-view>"
})
router.start(App, "#router-root")

window.router = router // expose the api for debugging

var target = document.querySelector('body')

window.addEventListener("mousewheel", function(e){
    if (e.deltaY > 0 && !target.classList.contains("small")) {
        // scroll down
        target.classList.add("small")
        e.preventDefault()
        return false
    }
})