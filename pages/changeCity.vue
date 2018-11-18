<template>
  <div class="page-changeCity">
    <el-row>
      <el-col :span="24">
        <i-select/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <hot/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <category/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ISelect from '@/components/changeCity/iselect.vue'
import Hot from '@/components/changeCity/hot.vue'
import Category from '@/components/changeCity/category.vue'
export default {
  components:{
    ISelect,
    Hot,
    Category
  }
}
</script>

<style>
</style>
