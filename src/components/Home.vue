<template>
  <div class="">
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
    }
  },
  methods: {
    //   退出模块
    logout () {
      // 清空临时保存的token
      window.sessionStorage.clear()
      //   然后跳转至登录页面
      this.$router.push('/login')
    }
  }
}
</script>
    <style lang="less" scoped>
</style>
