
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
      <!-- 网格布局 -->
      <!-- gutter为el-col之间的间隔大小 -->
      <!-- el-row一共14例 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- span为el-col占的实际列数 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <router-link to="/goods/add">
            <el-button type="primary">添加商品</el-button>
          </router-link>
        </el-col>
        <!-- table列表 -->
        <!-- data对应数组 prop对应字段名 name对应列表的显示名 -->
        <el-table :data="goodsList" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="180px">
            <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-row>
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeById(scope.row.goods_id)"
                ></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      goodsList: [],
      GoodsDialogVisible: false,
      //   查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 2 // 每页多少条
      },
      total: 0, // 总条数
      // 添加新用户
      addForm: {
        add_time: '',
        goods_name: '',
        goods_price: ''
      }
    }
  },
  created() {
    this.getGoodsList()
  },

  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.goodsList = res.data.goods
      console.log(res.data)
      this.total = res.data.total
    },
    // 每页显示多少条
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      //   更新数据
      this.getGoodsList()
    },
    // 当前页
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    // 当点击删除按钮的时候,弹出提示框,如果用户点击的是确定按钮,则根据Id执行删除操作
    removeById(id) {
      // const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }.catch(res => res)
      // )
      // 通过代码片段,elmecon
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async (action) => {
          console.log(action)
          if (action !== 'confirm') {
            // 删除操作
            return this.$message.info('已取消删除')
          }
          const { data: res } = await this.$http.delete('goods/' + id)
          this.$message({
            message: res.meta.msg,
            type: 'success',
            showClose: true
          })
          this.getGoodsList()
        }
      })
    },
    //   点击添加按钮 添加新用户
    GoodsAddPage() {}
  }
}
</script>

<style scoped lang="less">
</style>
