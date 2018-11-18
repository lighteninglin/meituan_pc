import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

miniToastr.init()

function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)