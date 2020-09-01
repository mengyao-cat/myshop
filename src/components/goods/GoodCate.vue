<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3, // 分类
        pagenum: 1,
        pagesize: 2
      },
      // 商品分类的数据列表 默认为空
      // ceshi
      cateList: [],
      total: 0, // 总数据
      columns: [
        {
          label: '大家电',
          prop: 'cat_name'
        },

        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style scoped lang="less">
</style>
