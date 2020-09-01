<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 网格布局 -->
      <!-- gutter为el-col之间的间隔大小 -->
      <!-- el-row一共14例 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- span为el-col占的实际列数 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="AddDialogVisible = true">添加用户</el-button>
        </el-col>
        <!-- 列表 -->
        <!-- data对应数组 prop对应字段名 name对应列表的显示名-->
        <el-table :data="userList" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!-- 作用域插槽 她是Users的自组件 v-model相当于:value="scope.row.mg_state @input="scope.row.mg_state=$event"-->
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-row>
                <!-- 修改 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeById(scope.row.id)"
                ></el-button>
                <!-- 分配角色 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <!-- @click="setRole(scope.row)"获取这一列的数据 -->
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                    @click="setRole(scope.row)"
                  ></el-button>
                </el-tooltip>
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
    <!-- 添加用户的对话框 -->
    <!-- :visible.sync定义变量用来控制显示与隐藏 -->
    <el-dialog title="添加用户" :visible.sync="AddDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 提示内容区域 -->
      <!-- rules验证规则 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed()"
    >
      <!-- 提示内容区域 -->
      <!-- rules验证规则 -->
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="removeSlectRole">
      <!-- 内容 -->
      <!-- //显示字段 渲染内容 -->
      <p>当前的用户名:{{userInfo.username}}</p>
      <p>当前的用户名:{{userInfo.role_name}}</p>
      <p>
        分配新角色:
        <el-select v-model="selectRole" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: [],
  data() {
    // rule  校验规则
    // value  值
    // callback 回调函数
    // 自定义验证邮箱
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号

    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 2 // 每页多少条
      },
      userList: [],
      total: 0, // 总条数
      AddDialogVisible: false, // 控制对话框显示与隐藏
      editDialogVisible: false,
      setRoleDialogVisible: false,
      // 定义userInfo,用于接收当前正在操作的角色分配这一行的数据
      userInfo: {},
      // rolesList,用于接收角色分配的动态,后台数据
      rolesList: [],
      selectRole: '',
      // 添加新用户
      addForm: {
        username: 'admin',
        password: '123456',
        email: '1490801829@qq.com',
        mobile: '18508141474'
      },
      // 添加表单的验证规则对象
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 查询到用户信息对象
      editForm: {
        username: '',
        email: '1490801829@qq.com',
        mobile: '18508141474'
      },
      // 修改用户表单的验证规则对象

      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      this.userList = res.data.users
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
    // 监听switch开关状态的改变
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) return this.$message.error('更新用户失败')
      this.$message.success('更新用户成功')
    },
    // 监听添加用户对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮 添加新用户 表单预验证
    addUser() {
      this.$refs.addFormRef.validate(async (isvalid) => {
        if (!isvalid) return
        // 验证成功,发送请求
        // console.log(isvalid)
        console.log('this', this)
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true
          })
        }
        this.$message.success(res.meta.msg)
        this.AddDialogVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      // 弹出对话框
      this.editDialogVisible = true
    },
    // 点击取消按钮 清空表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并且提交
    // 提交之前需要对表单进行表单预验证
    editUser() {
      this.$refs.editFormRef.validate(async (isvalid) => {
        if (!isvalid) return
        // 发起修改用户信息的数据请求
        // console.log(isvalid)
        console.log('this', this)
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        // 判断数据 如果错误给出一个错误提示信息
        if (res.meta.status !== 200) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true
          })
        }
        // 刷新列表,更新数据
        this.getUserList()
        // 关闭对话框
        this.editDialogVisible = false
        // 提示用户更新数据成功
        this.$message.success(res.meta.msg)
      })
    },
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
          const { data: res } = await this.$http.delete('users/' + id)
          this.$message({
            message: res.meta.msg,
            type: 'success',
            showClose: true
          })
          this.getUserList()
        }
      })
    },
    // 点击分配角色按钮显示对话框
    async setRole(userinfo) {
      this.userInfo = userinfo
      // 获取所有的角色列表数据
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRole() {
      await this.$http.put('users/' + this.userInfo.id + '/role', {
        rid: this.selectRole
      })
      this.$message.success('分配成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    removeSlectRole() {
      this.selectRole = ''
      this.userInfo = []
    }
  }
}
</script>
<style lang="less" scoped>
</style>
