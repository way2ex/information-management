import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from './common/ajax';
import './assets/css/common.less';

Vue.config.productionTip = false;

window.ajax = ajax;
Vue.use(ElementUI);
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
