import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store';
import ElementUI from "element-ui"

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// import 'reset-css'
import "element-ui/lib/theme-chalk/index.css"
import "@/assets/css/monokai-sublime.css"
import "@/assets/css/prism.css"

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: "mini",
  zIndex: 3000
})

Vue.use(mavonEditor)

// 配置畅言评论模块
Vue.prototype.$loadScript = (url, callback) => {
  let script = document.createElement('script');
  if (script.readyState) {
    // IE浏览器
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback && callback();
      }
    };
  } else {
    // 其他浏览器
    script.onload = function () {
      callback && callback();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

Vue.prototype.$loadStyle = (url, callback) => {
  let link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
  callback && callback();
};

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')