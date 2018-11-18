import mongoose from 'mongoose'

const ProvinceSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true
  },
  value:{
    type: Array,
    required: true
  }
})

export default mongoose.model('Province', ProvinceSchema)