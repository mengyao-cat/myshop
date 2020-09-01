import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/Users.vue'
<<<<<<< HEAD
import Rights from '../components/power/Rights.vue'
=======
>>>>>>> 7eabcf1... 完成了用户管理功能

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
<<<<<<< HEAD
      { path: '/users', component: User },
      { path: '/rights', component: Rights }
=======
      { path: '/users', component: User }
>>>>>>> 7eabcf1... 完成了用户管理功能
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to将要访问的路径
  // form 代表从哪个路径跳转而来
  // next是一个函数 表示放行
  // next()  放行 next('/login')  强制跳转
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
