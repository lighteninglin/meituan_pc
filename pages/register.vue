<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
              <em class="bold">已有美团账号？</em>
              <a href="/login">
                <el-button type="primary" size="small">登录</el-button>
              </a>
            </span>
      </header>
    </article>
    <section>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="ruleForm.email"></el-input>
          <el-button round size="mini" @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
  export default {
    layout: 'blank',
    methods: {
      sendMsg: function() {
        let self = this
        // 检查是否还在上一次发验证码开始的1分钟内
        if (this.timerid) {
          return false
        }
        let namePassBool = false
        let emailPassBool = false
        // element-ui验证表单方法,由于此处是发送验证码阶段而不是整个表单提交，故只进行name和邮箱的验证
        this.$refs["ruleForm"].validateField('nickName', (valid) => {
          if (valid) {
            // 错误消息如果存在
            namePassBool = false
          } else {
            namePassBool = true
            return false
          }
        })
        this.statusMsg = ''
        this.$refs["ruleForm"].validateField('email', (valid) => {
          if (valid) {
            // 错误消息如果存在
            emailPassBool = false
          } else {
            emailPassBool = true
            return false
          }
        })
        if (namePassBool && emailPassBool) {
          self.$axios.post('http://118.31.69.104/users/verify', {
            username: encodeURIComponent(self.ruleForm.nickName),
            email: self.ruleForm.email
          }).then(({
            status,
            data
          }) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60
              self.statusMsg = `验证码已发送，剩余${count--}秒`
              self.timerid = setInterval(() => {
                self.statusMsg = `验证码已发送，剩余${count--}秒`
                if (count < 0) {
                  clearInterval(self.timerid)
                  self.statusMsg = ''
                }
              }, 1000)
            } else {
              self.sendMsg = data.msg
            }
          })
        }
      },
      register: function() {
        let self = this
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            self.$axios.post('http://118.31.69.104/users/signup', {
                username: encodeURIComponent(self.ruleForm.nickName),
                password: CryptoJS.MD5(self.ruleForm.pass).toString(),
                email: self.ruleForm.email,
                code: self.ruleForm.code
              })
              .then(({
                status,
                data
              }) => {
                if (status === 200) {
                  if (data && data.code === 0) {
                    self.$router.push('/login')
                  } else {
                    self.error = data.msg
                  }
                } else {
                  slef.error = `服务器出错，错误码：${status}`
                }
                setTimeout(function() {
                  self.error = ''
                }, 3500)
              })
              .catch(err => console.log(err))
          } else {
            return false
          }
        })
      }
    },
    data() {
      return {
        statusMsg: '',
        error: '',
        ruleForm: {
          nickName: '',
          email: '',
          code: '',
          pass: '',
          checkPass: ''
        },
        rules: {
          nickName: [{
            required: true,
            type: 'string',
            message: '请输入昵称',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            type: 'string',
            message: '请输入验证码',
            trigger: 'blur'
          }],
          pass: [{
            required: true,
            message: '创建密码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }],
          checkPass: [{
            required: true,
            message: '确认密码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
        }
      }
    }
  }
</script>

<style lang="sass">
  @import '@/assets/css/register/index.scss'
</style>
