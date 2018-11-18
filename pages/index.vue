<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <e-menu/>
      </el-col>
      <el-col :span="19">
        <e-life/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <e-artistic/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EMenu from '@/components/index/menu.vue'
  import ELife from '@/components/index/life.vue'
  import EArtistic from '@/components/index/artistic2.vue'
  export default {
    components: {
      EMenu,
      ELife,
      EArtistic
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/index/index.scss";
</style>
