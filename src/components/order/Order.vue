<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- span为el-col占的实际列数 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <!-- 作用域插槽 她是Users的自组件 v-model相当于:value="scope.row.mg_state @input="scope.row.mg_state=$event"-->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tag
              type="danger"
              v-if="scope.row.pay_status === 1"
              @change="oriderStateChanged(scope.row)"
            >已付款</el-tag>
            <el-tag type="danger" @change="oriderStateChanged(scope.row)">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope>
            <el-row>
              <!-- 修改地址 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDizhiDialog"></el-button>
              <!-- 物流信息 -->
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProcessDialog()"
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
    </el-card>
    <!-- 修改地址对话框 -->

    <el-dialog
      title="修改地址"
      :visible.sync="orderDialogVisible"
      width="50%"
      @close="orderCloseRemove"
    >
      <el-form
        :model="orderRessForm"
        :rules="oriderRessFormRules"
        ref="addRessFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="orderRessForm.address1" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="地址" prop="address2">
          <el-input v-model="orderRessForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <!-- before-close  仅仅在当前用户点击关闭图标或者对话框的时候起效 -->
    <el-dialog title="物流进度信息" :visible.sync="proressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../citydata.js'

export default {
  data() {
    return {
      // 修改地址的数据
      orderRessForm: {
        address1: [],
        address2: ''
      },

      // 修改地址的验证规则
      oriderRessFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },

      // 导入的地址信息
      cityData: cityData,
      // 物流信息
      reswuliu: [

        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }

      ],
      // 物流进度所有信息
      progressInfo: [],
      // 查询对象
      queryInfo: {
        // 查询
        query: '',
        // 当前页面
        pagenum: 1,
        // 一页显示多少
        pagesize: 5
      },

      // 总页数
      total: 0,

      orderList: [],
      //  是否显示 修改地址对话框

      orderDialogVisible: false,
      //  是否显示 物流信息对话框
      proressDialogVisible: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //   获取数据所有角色数据
    async getOrderList() {
      // 请求数据 获取所有订单数据列表
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.orderList = res.data.goods
      console.log(res)
      this.total = res.data.total
    },
    // input搜索功能

    // 改变每一页多少条  size-change监听页数的改变 监听的是pagesize
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      // 更新数据  重新渲染页面
      this.getOrderList()
    },
    // 点击页数,跳转至相应的页面  监听的是页码值
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      // 然后再重新更新数据  渲染页面 num
      this.getOrderList()
    },
    // 点击修改地址的关闭按钮,清空对话框
    orderCloseRemove() {
      // resetField() 对该表单进行重置,将其值重置为初始值并且移除校验效果
      this.$refs.addRessFormRef.resetFields()
    },
    oriderStateChanged() {},
    // 编辑操作 点击编辑按钮,显示对话框,根据id值修改订单数据
    showEditDialog() {},
    // 关闭修改对话框的时候,发送请求
    showDizhiDialog() {
      this.orderDialogVisible = true
    },

    // 点击物流图标按钮 显示物流对话框
    async showProcessDialog() {
      // 显示查询地址对话框
      this.proressDialogVisible = true
      //  请求物流数据,并且保存至自己定义的物流数组中
      const { data: res } = await this.$http.get(
        '/kuaidi/804909574412544580'
      )
      if (res.meta.status !== 200) return this.$message.error('获取物流状态失败')
      //  将数据保存到自己定义的数组身上
      this.progressInfo = this.reswuliu
      console.log(res)
    },
    xiugGaihandleClose() {},
    wuLiuhandleClose() {}
  }
}
</script>

<style scoped lang="less">

.el-cascader {
  width: 100%;
}
</style>
