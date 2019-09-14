// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')



//引入自定义全局变量
import global_ from '@/js/global.js'
Vue.prototype.GLOBAL = global_
 // 使用全局变量console.log(this.GLOBAL.BASE_URL)

//引入axios
import axios from 'axios'
Vue.prototype.$http= axios
axios.defaults.baseURL = global_.MOCK_URL



// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入 v-calendar & v-date-picker components
import VCalendar from 'v-calendar';
Vue.use(
    VCalendar, {componentPrefix: 'vc',} // Use <vc-calendar /> instead of <v-calendar />
);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
