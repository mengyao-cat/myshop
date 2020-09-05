import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/css/global.css'
// import './components/Login.vue'
// import './components/Home.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)
// 全局注册组件
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 的请求拦截器
axios.interceptors.request.use(config => {
  // 给请求头添加token字段Authorization
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, error => {
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
// 时间过滤器组件
Vue.filter('dateFormat', (date) => {
  return moment.unix(date).format('YYYY-MM-DD HH:mm:ss')
})
// 原生js时间过滤器
// Vue.filter('deteFormat', (originVal) => {
//   const dt = new Date(originVal)
//   const y = dt.getFullYear()
//   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//   const d = (dt.getDate() + '').padStart(2, '0')
//   const hh = (dt.getHours() + '').padStart(2, '0')
//   const mm = (dt.getMinutes() + '').padStart(2, '0')
//   const ss = (dt.getSeconds() + '').padStart(2, '0')
//   return y + '-' + m + '-' + d + ':' + ' ' + hh + ':' + mm + ':' + ss
// })
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
