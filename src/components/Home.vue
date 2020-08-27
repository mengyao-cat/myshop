<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img
          src="../assets/timg (1).jpg"
          alt=""
        >
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      > 退出 </el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  props: [],
  data() {
    return {}
  },
  methods: {
    //   退出模块
    logout() {
      // 清空临时保存的token
      window.sessionStorage.clear()
      //   然后跳转至登录页面
      this.$router.push('/login')
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
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
