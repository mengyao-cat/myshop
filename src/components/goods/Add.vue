<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 步骤区域 -->
      <!-- active这是激活状态steps -->
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 因其后期数据是5个联动的功能,所以给他一个form表单,将其包裹,以便后期数据填写完毕,一起提交 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs
          :before-leave="handleTabLeave"
          @tab-click="handleTabClik"
          tab-position="left"
          v-model="activeIndex"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label prop>
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id',checkStrictly:true }"
                clearable
                @change="handleCascaChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="subItem"
                  border
                  v-for="(subItem, subIndex) in item.attr_vals"
                  :key="subIndex"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示要上传到后台的api接口 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="handelSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <!-- list-type根据不同的值显示这个上传图片的效果 -->
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button @click="addGoods" class="btnsTop" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片区域 -->
    <el-dialog title="预览图片" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewUrl" class="previewImg" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: 0,
      // 添加商品的表单验证对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: ''
        // attrs: []
      },
      // 商品分类列表
      cateList: [],
      // 添加表单的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ]
      },
      // 22
      fileList: [],
      manyTableDate: [],
      onlyTableDate: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对像/
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewUrl: '',
      previewDialogVisible: false
    }
  },
  // 生命周期函数
  // 准备数据
  created() {
    // 调用请求数据
    this.getCateList()
    // 测试/调试代码
    this.activeIndex = '3'
    this.addForm.goods_cat = [1, 3, 6]
    this.handleTabClik()
  },
  methods: {
    // 打开页面请求数据,获取到所有商品的表单数据对象
    async getCateList() {
      // 获取到商品分类的数据列表
      const { data: res } = await this.$http.get('categories')
      // 将获取到的数据添加到准备好的商品分类列表中
      this.cateList = res.data
      // console.log(res.data)
    },
    handleCascaChange() {
      // 判断选项的权限
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = []
      }
    },
    handleTabLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        return false
      }
    },
    async handleTabClik() {
      if (this.activeIndex === '1') {
        if (this.cateId === undefined || this.cateId === null) return
        const { data: res } = await this.$http.get(
          'categories/' + this.cateId + '/attributes',
          {
            params: { sel: 'many' }
          }
        )
        res.data.forEach((t) => {
          // split转换成数组
          t.attr_vals = t.attr_vals ? t.attr_vals.split(' ') : []
        })
        this.manyTableDate = res.data
      } else if (this.activeIndex === '2') {
        if (this.cateId === undefined || this.cateId === null) return
        const { data: res } = await this.$http.get(
          'categories/' + this.cateId + '/attributes',
          {
            params: { sel: 'only' }
          }
        )
        this.onlyTableDate = res.data
      }
    },
    // 预览 处理图片的预览效果
    handlePreview(file) {
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 删除,将要被移除的信息
    handleRemove(file) {
      // 1.获取要删除的图片的临时路径
      // 2.从pics数组中,找到这个图片对应的索引值
      // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
      console.log(file)
      // 获取路径
      const path = file.response.data.tmp_path
      // 获取到索引值
      const index = this.addForm.pics.findIndex((t) => t.pic === path)
      this.addForm.pics.splice(index, 1)
    },
    // 监听图片上传成功的事件
    handelSuccess(response) {
      // 1.拼接得到一个图片信息对象
      // 2.将图片信息对象,push到pics
      this.addForm.pics.push({ pic: response.data.tmp_path })
      console.log(response)
      console.log(arguments)
    },
    // 添加按钮操作
    addGoods() {
      this.$refs.addFormRef.validate(async isValue => {
        if (!isValue) return this.$message.error('请填写必要的表单项')
        // 执行添加的业务逻辑
        // 运用深拷贝来解决此项问题
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // console.log('form', form)
        const attrs = []
        // 处理动态参数
        this.manyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableDate.forEach((t) => {
          // 将循环出来id以及value值push给attr
          attrs.push({
            attr_id: t.attr_id,
            attr_value: t.attr_vals
          })
        })
        // 发送请求  添加商品
        // 商品的名称  必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.$router.push('/goods')
        }
      })
    }
  },
  // 计算属性
  computed: {
    cateId() {
      return this.addForm.goods_cat.length !== 3
        ? null
        : this.addForm.goods_cat[2]
    }
  }
}
</script>

<style scoped lang="less">
/deep/.el-step__title {
  font-size: 12px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
}
.btnsTop {
  margin-top: 15px !important;
}
</style>
