<template>
  <div class="m-iselect">
    <span class="name">按省份选择：</span>
    <el-select v-model="pvalue" placeholder="省份">
      <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item" />
    </el-select>
    <el-select @change="changeCity" v-model="cvalue" :disabled="!city.length" placeholder="城市">
      <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-autocomplete v-model="input" :fetch-suggestions="querySearchAsync" placeholder="请输入城市中文或拼音" @select="handleSelect" />
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        pvalue: '',
        province: [],
        cvalue: '',
        city: [],
        input: '',
        cities: []
      }
    },
    watch: {
      pvalue: async function(newPvalue) {
        let self = this
        let {
          status,
          data: {
            city
          }
        } = await self.$axios.get(`http://118.31.69.104/geo/province/${newPvalue}`)
        if (status === 200) {
          self.city = city.map(item => ({
            value: item.id,
            label: item.name
          }))
          self.cvalue = ''
        }
      }
    },
    mounted: async function() {
      let self = this
      let {
        status,
        data: {
          province
        }
      } = await self.$axios.get('http://118.31.69.104/geo/province')
      if (status === 200) {
        self.province = province.map(item => ({
          value: item.id,
          label: item.name
        }))
      }
    },
    methods: {
      querySearchAsync: _.debounce(async function(query, cb) {
        let self = this
        if (self.cities.length) {
          cb(self.cities.filter(item => item.value.indexOf(query) > -1))
        } else {
          let {
            status,
            data: {
              city
            }
          } = await self.$axios.get('http://118.31.69.104/geo/city')
          if (status === 200) {
            self.cities = city.map(item => ({
              value: item.name
            }))
            cb(self.cities.filter(item => item.value.indexOf(query) > -1))
          } else {
            cb([])
          }
        }
      }, 200),
      handleSelect: function(item) {
        let city = item.value
        this.$store.dispatch('setPositionCity', city)
        this.$router.push({path:'/'})
      },
      changeCity: function(item) {
        let city = item.label
        this.$store.dispatch('setPositionCity', city)
        this.$router.push({path:'/'})
      }
    }
  }
</script>

<style lang="sass">
  @import '@/assets/css/changecity/iselect.scss';
</style>
