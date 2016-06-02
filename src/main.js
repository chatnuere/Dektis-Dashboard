import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from './components/Menu'
import Graphjson from './components/Graphjson'
import Frequentation from './components/Frequentation'
import Hello from './components/Hello'

/* eslint-disable no-new */

export default {
  components: {
    Graphjson,
    Hello,
    Frequentation
  }
}

// Tell Vue to use view-router
Vue.use(VueRouter)

// Router options
var router = new VueRouter({
  history: false,
  root: '/'
})

// Router map for defining components
router.map({
// For Not Found template (404)
  '*': {
    component: Hello
  },
  '/': {
    component: Hello
  },
  '/frequentation': {
    component: Frequentation
  },
  '/audience': {
    component: Graphjson
  }
})

var App = Vue.extend()

router.start({ components: { App, Menu } }, '#app')
