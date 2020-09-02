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
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
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
<<<<<<< HEAD
      </tree-table>
=======
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope>
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
>>>>>>> goods
    </el-card>
    <!-- 添加分类的对话框 -->
    <!-- :visible.sync定义变量用来控制显示与隐藏 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <!-- rules验证规则 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRuleForm"
        label-width="120px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedParentCateKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id',checkStrictly:true }"
            clearable
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
<<<<<<< HEAD
=======
      addCateDialogVisible: false,
>>>>>>> goods
      columns: [
        {
          label: '大家电',
          prop: 'cat_name'
        },

        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
<<<<<<< HEAD
        }
      ]
=======
        },
        // 排序
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      selectedParentCateKeys: []
>>>>>>> goods
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
    },
    // 改变每页多少条，触发方法   监听 pagesize 改变的事件
    handleSizeChange(size) {
      console.log(size)
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    // 点击具体的页面,触发方法  监听 页码值   改变的事件
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    },
    // 点击按钮,展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      // this.$refs.addFormRef.validate(async (isvalid) => {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.parentCateList = res.data
    },
    // 当关闭添加分类对话框时,重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRuleForm.resetFields()
      this.selectedParentCateKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    handleCascaderChange() {
      // 有没有选择,如果用户选择了父级分类
      if (this.selectedParentCateKeys.length > 0) {
        // 已选择
        // 则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid = this.selectedParentCateKeys[
          this.selectedParentCateKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedParentCateKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRuleForm.validate(async (isvalid) => {
        if (!isvalid) return
        // 验证成功,发送请求
        // console.log(isvalid)
        console.log('this', this)
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true
          })
        }
        this.$message.success(res.meta.msg)
        // 刷新列表
        this.addCateDialogVisible = false

        this.getCateList()
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
