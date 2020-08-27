<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img
          src="../assets/timg (1).jpg"
          alt=""
        >
      </div>
      <!-- :model数据绑定 -->
      <!-- :rules是验证表单 -->
      <!-- 通过rules传入约定的验证规则 -->
      <!-- ref表单的实例对象 -->
      <el-form
        label-width="0px"
        ref="loginFormRef"
        :rules='loginFormRules'
        :model="loginForm"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item
          class="password"
          prop="password"
        >
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login()"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   这是表单的验证规则对象
      //   :model与:rules里面名需要一致
      //   loginFormRules是赋值给:rules的变量名
      loginFormRules: {
        //   验证用户名是否合法
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
        ]
      }
    }
  },
  methods: {
    //   这是点击重置按钮,重置表单
    resetLoginForm () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 登录模块
    login () {
      this.$refs.loginFormRef.validate(async (isvalid) => {
        if (!isvalid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status === 200) {
          this.$message({
            message: '登录成功',
            type: 'success',
            showClose: true
          })
          //   保存token(身份验证的凭证)到sessionStorage(临时存储)
          window.sessionStorage.setItem('token', res.data.token)
          // 导航至/home
          this.$router.push('/home')
        } else {
          // 失败
          this.$message({
            message: '登录失败',
            type: 'error',
            showClose: true
          })
        }
      })
    }
    // 登录成功之后的token,保存到客户端的sessionStorage中
    // 1.项目中出了登录之外的其他API接口,必须在登录之后才能访问
    // 2.token 只应在当前网站打开期间生效,所以讲token保存在sessionStorage中
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 130px;
  width: 130px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #dddddd;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
