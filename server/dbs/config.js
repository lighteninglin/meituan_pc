export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return 'xxx@qq.com'
    },
    get pass() {
      return '12342534657'
    },
    get code() {
      return () => {
        return Math.random().toString(32).slice(2, 6).toUpperCase()
      }
    },
    get expire() {
      return () => {
        return new Date().getTime() + 5 * 60 * 1000
      }
    }
  }
}