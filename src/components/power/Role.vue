<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRole">新增角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <!-- data对应数组 prop对应字段名 name对应列表的显示名-->
      <el-table :data="rolelist" stripe border>
        <!-- 展开列表 type="expand"-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- :class="{'bdbottom':i1===scope.row.children.length-1}"给最后一行加上底边框 -->
            <!-- 每一个二级权限占一行 -->
            <el-row
              class="bdtop vcenter"
              :class="{'bdbottom':i1===scope.row.children.length-1}"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->

              <el-col :span="5">
                <el-tag  closable  @close="removeRightById(scope.row,item.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->

              <el-col :span="19">
                <!-- 每一个二级权限占一行 -->
                <!-- 二级权限 -->
                <el-row
                  class="vcenter"
                  :class="{'bdtop':i2!==0}"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->

                  <el-col :span="6">
                    <el-tag  closable  @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三級權限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-row>
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog()">修改</el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeEditDialog()"
                size="mini"
              >删除</el-button>
              <!-- 分配角色 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >权限分配</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <!-- @close="setRightDialogClosed"绑定关闭事件 关闭对话框时将保存到dekeys里面的id数据清空 -->
    <el-dialog
      title="分配权限"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        ref="treeRef"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      ></el-tree>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 权限数据
      rightsList: [],
      // 是否显示对话框
      roleDialogVisible: false,
      // 树形控件的绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中节点Id的数组
      defkeys: [],
      roleId: undefined

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$mssage.error(res.data.msg)
      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    // 添加添加角色
    AddRole() {},
    // 编辑
    showEditDialog() {},
    // 删除
    removeEditDialog() {},
    // 通过点击事件删除权限标签
    removeRightById(role, rightid) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async (action) => {
          // console.log(action)
          if (action === 'confirm') {
            // 确定删除
            const { data: res } = await this.$http.delete(
              `roles/${role.id}/rights/${rightid}`
            )
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
            // children对应这个角色所用权限
            role.children = res.data // 重新赋值数据
            // 不能使用this.getRolesList获取数据
          }
        }
      })
    },
    // 权限区域
    // 展示分配权限的对话框
    async showSetRightDialog(row) {
      // 点击分配权限保存roleId
      this.roleId = row.id
      // 方法一
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defkeys.push(item3.id)
          })
        })
      })
      // this.getLeafKeys(row, this.defkeys)
      const { data: res } = await this.$http.get('rights/tree')
      this.rightsList = res.data
      this.roleDialogVisible = true
      console.log(res)
    }, // 通过递归形式,获取角色下所有三级权限的id,并保存到defkeys数组中
    // 方法二
    // getLeafKeys(node, arr) {
    //   // 如果当前node节点不包含children属性,则是三级节点
    //   if (!node.children) {
    //     arr.push(node.id)
    //   } else {
    //     // 一级和二级
    //     node.children.forEach(subItem => {
    //       this.getLeafKeys(subItem, arr)
    //     })
    //   }
    // }
    // 方法三
    // getLeafKeys(node) {
    //   // 如果当前node节点不包含children属性,则是三级节点
    //   if (!node.children) {
    //     arr.push(node.id)
    //   } else {
    //     // 一级和二级
    //     node.children.forEach(subItem => {
    //       this.getLeafKeys(subItem)
    //     })
    //   }
    // }
    // 关闭对话框时将保存到dekeys里面的id数据清空
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const rids = [
        ...this.$refs.treeRef.getCheckedKeys(), // 得到选中的id
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: rids.join(',') // 将id转换成字符串

      })
      this.$message.success('分配成功')
      this.roleDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
