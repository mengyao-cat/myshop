<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 页面渲染不出来tag标签 -->
          <template slot-scope="scope">
           <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取请求的数据
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    //   发送请求,获取数据
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      //  如果获取成功,将请求的数据保存在rightsList中
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
