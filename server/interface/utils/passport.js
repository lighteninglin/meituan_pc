import KoaPassport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/user'

KoaPassport.use(new LocalStrategy(async function (username, password, done) {
  let where = {
    username
  }
  let user = await UserModel.findOne(where)
  if (user != null) {
    if (user.password === password) {
      return done(null, user)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

KoaPassport.serializeUser(function (user, done) {
  done(null, user)
})

KoaPassport.deserializeUser(function (user, done) {
  return done(null, user)
})

export default KoaPassport