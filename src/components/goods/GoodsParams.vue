<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedParentCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id',checkStrictly:true }"
            clearable
            @change="handleCascaderChange"
          ></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      selectedParentCateKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleCascaderChange() {}
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>
