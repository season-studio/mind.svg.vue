import Vue from 'vue'

import {translate, lang, default as mindSvgVue} from "./lib";

import App from './demo.vue'

translate.map(lang.zhCN);

Vue.config.productionTip = false

Vue.use(mindSvgVue);

new Vue({
  render: h => h(App),
}).$mount('#app')
