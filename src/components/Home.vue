<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img src="../assets/heima.png" style="height:'20px'" alt />
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <!-- unique-opened唯一展开一级菜单 -->
        <!-- 通过collapse控制菜单的展开或折叠 -->
        <!-- collapse-transition关闭动画 -->
        <el-menu background-color="#333744" text-color="#fff"  :collapse="isCollapse" unique-opened router :collapse-transition="false" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <!-- 点击菜单保存路径 -->
            <el-menu-item :index="'/'+subItem.path+''" v-for="(subItem) in item.children" :key="subItem.id" @click="saveActivePath('/'+subItem.path)">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 刷新获取 sessionStorage中的数据
      activePath: sessionStorage.activePath
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    //   退出模块
    logout() {
      // 清空临时保存的token
      window.sessionStorage.clear()
      //   然后跳转至登录页面
      this.$router.push('/')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      this.menuList = res.data
      console.log(res)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse // 控制展开/折叠
    },
    // 保存链接的激活状态
    // 保存数据到sessionStorage
    saveActivePath(path) {
      this.activePath = path
      sessionStorage.activePath = this.activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;

  >div{
    display: flex;
    align-items: center;
  }
}
.el-header span{
  display: inline-block;
  color: #ffffff;
  text-align: center;
  font-size: 25px;
}
.el-aside {
  background-color: #333744;
.el-menu{
  // 取消右边距
  border-right: none;
}
}
.el-main {

  background-color: #eaedf1;
}
.iconfont{
padding-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

}
</style>
