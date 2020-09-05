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
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="AddDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand" label>
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeDeletedAttrValue(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-row>
                  <!-- 编辑 -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button>
                  <!-- 删除 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeEditDialog((scope.row.attr_id))"
                  >删除-</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性表格 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="AddDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" stripe border>
            <el-table-column type="expand">
               <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeDeletedAttrValue(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-row>
                  <!-- 编辑 -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button>
                  <!-- 删除 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeEditDialog((scope.row.attr_id))"
                  >删除</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态和静态的对话框 -->
    <!-- :visible.sync定义变量用来控制显示与隐藏 -->
    <el-dialog
      :title="'添加'+ titleText"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 提示内容区域 -->
      <!-- rules验证规则 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="130px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'添加'+ titleText"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 提示内容区域 -->
      <!-- rules验证规则 -->
      <el-form :model="editForm" :rules="editRules" ref="editormRef" label-width="130px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      selectedParentCateKeys: [1, 3, 6],
      activeName: 'many',
      manyTableData: [],
      onlyData: [],
      AddDialogVisible: false,
      EditDialogVisible: false,
      addForm: { attr_name: '' },
      //   验证规则
      addRules: {
        attr_name: [
          { required: true, message: '"请输入名称"', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      editForm: { attr_name: '' },

      //   验证规则
      editRules: {
        attr_name: [
          { required: true, message: '"请输入名称"', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.cateList
      })
      this.cateList = res.data
    },
    async handleCascaderChange() {
      // 当用户在级联菜单中选择内容改变时触发
      //   选择1,2级
      if (this.selectedParentCateKeys.length < 3) {
        this.selectedParentCateKeys = []
        this.manyTableData = []
        this.onlyData = []
      }
      this.getParamsData()
    },
    async getParamsData() {
      const { data: res } = await this.$http.get(
        'categories/' + this.cateId + '/attributes',
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach((t) => {
        t.inputVisible = false
        t.inputValue = ''
        // split转换成数组
        t.attr_vals = t.attr_vals ? t.attr_vals.split(' ') : []
      })
      console.log('res', res)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    handleTabClick() {
      this.getParamsData()
    },
    // 监听添加用户对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addAttr() {
      this.$refs.addFormRef.validate(async (isvalid) => {
        if (!isvalid) return
        // 验证成功,发送请求
        // console.log(isvalid)
        console.log('this', this)
        const { data: res } = await this.$http.post(
          'categories/' + this.cateId + '/attributes',
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true
          })
        }
        this.$message.success(res.meta.msg)
        this.addForm = res.data
        this.AddDialogVisible = false
        // 刷新列表
        this.getParamsData()
      })
    },

    // 编辑功能区域

    // 页面展开,发送请求获取需要修改的那个参数的数据
    // 打开对话框获取数据
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { sel: this.activeName }
        }
      )
      this.editForm = res.data
      // 显示修改参数.属性对话框
      this.EditDialogVisible = true
    },
    editDialogClosed() {
      // 当关闭修改参数表单的时候,属性对话框里面的额输入框自动清空
      this.$refs.editormRef.resetFields()
    },
    // 点击修改按钮,发送请求,完成修改,并且退出对话框
    editAttr() {
      this.$refs.editormRef.validate(async (isvalid) => {
        if (!isvalid) return
        // 验证成功,发送请求
        // console.log(isvalid)
        console.log('this', this)
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_sel: this.activeName,
            attr_name: this.editForm
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改' + this.titleText + '数据成功')
        this.EditDialogVisible = false
        // 刷新列表
        this.getParamsData()
      })
    },
    // 点击删除按钮
    async removeEditDialog(attrId) {
      const confirmResult = await this.$confirm('确认删除该' + this.titleText, '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户点击的是取消按钮,则给出提示信息
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 如果用户点击的是确定 按钮,则执行删除操作,删除成功给予删除成功的提示信息,并且重新渲染页面
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`
      )
      console.log(res.data)

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数数据失败')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 鼠标失去焦点,将用户输入的数据put至后台进行修改添加
    async handleInputConfirm(row) {
      row.inputVisible = false
      // 判断有无内容,如没有内容则清空input
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        // 发起请求，并且保存这次操作

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            // join转换成字符串 然后再提交(因其返回的是一个字符串,而上边我们将其转换成数组)
            attr_vals: row.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) return this.$message.info('添加属性失败')
        this.$message.success('添加属性成功')
        console.log(res.data)
        this.getParamsData()
      }
    },
    // nextTick的作用
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除
    async removeDeletedAttrValue(row, index) {
      row.attr_vals.splice(index, 1)
      await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          // join转换成字符串 然后再提交(因其返回的是一个字符串,而上边我们将其转换成数组)
          attr_vals: row.attr_vals.join(' ')
        }
      )
    }
  },

  // 计算属性
  computed: {
    //   如果按钮需要被禁用  则返回true 否则返回false
    btnDisabled() {
      return this.selectedParentCateKeys.length !== 3
    },
    cateId() {
      return this.selectedParentCateKeys.length !== 3
        ? null
        : this.selectedParentCateKeys[2]
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
