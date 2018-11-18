import Axios from 'axios'

const instance = Axios.create({
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  timeout: 2000,
  headers: {}
})

export default instance