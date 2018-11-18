<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left"><img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团"></el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input v-model="search" @focus="focus" @blur="blur" @input="input" placeholder="搜索商家或地点" />
          <button @click="searchContent" class="el-button el-button--primary"><i class="el-icon-search"/></button>
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item,index) in $store.state.home.hotPlace.slice(0,5)" :key="index"><a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a></dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd
              v-for="(item,idx) in searchList"
              :key="idx">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
            :key="idx"
            :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li><i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li><i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li><i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        search: '',
        isFoucus: false,
        hotPlace: [],
        searchList: []
      }
    },
    computed: {
      isHotPlace: function() {
        return !this.search && this.isFoucus
      },
      isSearchList: function() {
        return this.isFoucus && this.search
      }
    },
    methods: {
      focus: function() {
        this.isFoucus = true
      },
      blur: function() {
        setTimeout(() => {
          this.isFoucus = false
        }, 200)
      },
      input: _.debounce(async function() {
        let self = this
        let city = self.$store.state.geo.position.city.replace('市', '')
        self.searchList = []
        let {
          status,
          data: {
            top
          }
        } = await self.$axios.get('http://118.31.69.104/search/top', {
          params: {
            input: self.search,
            city
          }
        })
        self.searchList = top.slice(0, 10)
      }, 300),
      searchContent: function(){
        window.location = `/products?keyword=${encodeURIComponent(this.search)}`
      }
    }
  }
</script>

<style lang="sass">
@import "@/assets/css/public/header/search.scss";
</style>
