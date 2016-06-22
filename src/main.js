import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from './components/Menu'
import Graphjson from './components/Graphjson'
import Frequentation from './components/Frequentation'
import Accueil from './components/Accueil'
import Fluxmonetaire from './components/Fluxmonetaire'

/* eslint-disable no-new */

export default {
  components: {
    Graphjson,
    Accueil,
    Frequentation,
    Fluxmonetaire
  }
}

// Tell Vue to use view-router
Vue.use(VueRouter)

// Router options
var router = new VueRouter({
  history: false,
  root: '/'
})

// router.map for defining components
router.map({
// not found template => 404
  '*': {
    component: Accueil
  },
  '/': {
    component: Accueil
  },
  '/frequentation': {
    component: Frequentation
  },
  '/audience': {
    component: Graphjson
  },
  '/fluxmonetaire': {
    component: Fluxmonetaire
  }
})

var App = Vue.extend()

router.start({ components: { App, Menu } }, '#app')
