import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from "element-ui"

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import "element-ui/lib/theme-chalk/index.css"
import "animate.css"
import "@/assets/iconfont/iconfont.css"

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: "mini",
  zIndex: 3000
})

Vue.use(mavonEditor)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')