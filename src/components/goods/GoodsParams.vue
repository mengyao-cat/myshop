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
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 将标签页改为many -->
        <el-tab-pane label="动态参数" name="many"></el-tab-pane>
        <!-- 静态属性表格 -->
        <el-table :data="onlyTableData" border stripe></el-table>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      selectedParentCateKeys: [],
      activeName: 'first'
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
    handleCascaderChange() {
      if (this.selectedParentCateKeys.length < 3) {
        this.selectedParentCateKeys = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>
