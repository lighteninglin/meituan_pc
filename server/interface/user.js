import KoaRouter from 'koa-router'
import KoaRedis from 'koa-redis'
import NodeMailer from 'nodemailer'
import User from '../dbs/models/user'
import Passport from './utils/passport'
import EmailConfig from '../dbs/config'
import Axios from './utils/axios'

const router = new KoaRouter({
  prefix: '/users'
})

const Store = new KoaRedis().client

router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  let user = await User.findOne({
    username
  })
  if (user) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  let newUser = await User.create({ username, password, email })
  if (newUser) {
    let res = await Axios.post('/users/signin', { username, password })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire + 4 * 60 * 1000 < 0) {
    ctx.body = {
      code: -1,
      msg: '请求过于频繁，1分钟内1次'
    }
    return false
  }
  let transporter = NodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: EmailConfig.smtp.user,
      pass: EmailConfig.smtp.pass
    }
  })
  let ko = {
    code: EmailConfig.smtp.code(),
    expire: EmailConfig.smtp.expire(),
    email: ctx.request.body.email,
    username: ctx.request.body.username
  }
  let mailOptions = {
    from: `[认证邮件]<${EmailConfig.smtp.user}>`,
    to: ko.email,
    subject: `XX网系统用户注册邮箱验证码`,
    html: `您在XX网系统中注册，您的验证码是${ko.code}`
  }
  // send mail with defined transport object
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    Store.hmset(`nodemail:${ko.username}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期5分钟'
  }
})

router.get('/exit', async (ctx) => {
  await ctx.logOut()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getuser', async (ctx) => {
  if(ctx.isAuthenticated()){
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      user:username,
      email
    }
  }else{
    ctx.body={
      user:'',
      email:''
    }
  }
})

export default router