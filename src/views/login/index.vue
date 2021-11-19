<template>
  <div class="login flex-justify-center">
    <div class="title">水运工程仿真实验系统</div>
    <div class="login-box order">
      <div class="login-title">账户登录</div>
      <div class="form-box">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-position="left"
          label-width="50px"
          class="demo-ruleForm"
          label-suffix=":"
          :hide-required-asterisk="true"
        >
          <el-form-item label="学号" prop="id">
            <el-input
              v-model="ruleForm.id"
              type="text"
              autocomplete="off"
              autofocus
              placeholder="请输入学号"
              clearable
            >
              <template #prefix>
                <el-icon class="el-input__icon"
                  ><UserFilled
                /></el-icon> </template
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              clearable
              @click.enter="submitForm('ruleForm')"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Unlock /></el-icon> </template
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="flex-between">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >登录</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { UserFilled, Unlock } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
export default {
  name: 'Login',
  data() {
    const validateId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入学号.'))
      } else {
        if (this.ruleForm.id !== '') {
          this.$refs.ruleForm.validateField('id')
        }
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码.'))
      } else {
        if (this.ruleForm.password !== '') {
          this.$refs.ruleForm.validateField('password')
        }
        callback()
      }
    }
    return {
      ruleForm: {
        // 学号
        id: '',
        // 密码
        password: '',
      },
      rules: {
        id: [{ validator: validateId, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  components: {
    UserFilled,
    Unlock
  },
  mounted() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证登录
          const params = this.ruleForm
          this.$api.login(params).then((res) => {
            if (res.status === 200) {
              window.localStorage.setItem('_token_', res.token)
              window.localStorage.setItem('_login_status_', true)
              window.localStorage.setItem('_user_Info_', JSON.stringify(res.data))
              this.setLogin_Status(true)
              this.setUserInfo(res.data)
              ElMessage({
                message: res.msg,
                type: "success"
              })
              this.$router.replace({
                name: 'home'
              })
            }
          }).catch((err) => {
            console.log('error', err)
          });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 提交状态
    ...mapMutations('user', { setLogin_Status: 'LOGIN_STATUS', setUserInfo: 'USER_INFO', setLogin: 'LOGIN' })
  }
}
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  min-height: 76vh;
  .title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  .login-box {
    padding: 16px;
    box-shadow: -1px 1px 10px rgb(0, 0, 0, 0.6);
    width: 20%;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    .login-title {
      margin-bottom: 16px;
      font-size: 1rem;
      text-align: center;
    }
  }
}
</style>
