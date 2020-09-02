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

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
