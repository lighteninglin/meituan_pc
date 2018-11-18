<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name,item.active?'s-nav-active':'']"
        @click="navSelect"
      >{{ item.txt }}</dd>
    </dl>
    <ul>
      <Item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"/>
    </ul>
  </div>
</template>

<script>
import Item from './product.vue'
import {swap, partition, quickSort} from '@/assets/js/quicksort'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          active: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ]
    }
  },
  async asyncData({app}) {
    let { data } = await app.$axios.get('searchList')
    return { items: data.list }
  },
  methods: {
    navSelect: function () {
      switch(event.currentTarget.innerHTML){
        case '智能排序':
          window.location = window.location.href
          this.nav[0].active = true
          this.nav[1].active = false
          this.nav[2].active = false
          this.nav[3].active = false
          break
        case '价格最低':
          this.nav[0].active = false
          this.nav[1].active = true
          this.nav[2].active = false
          this.nav[3].active = false
          this.sortArray('price')
          break
        case '人气最高':
          this.nav[0].active = false
          this.nav[1].active = false
          this.nav[2].active = true
          this.nav[3].active = false
          this.sortArray('comment')
          this.list.reverse()
          break
        case '评价最高':
          this.nav[0].active = false
          this.nav[1].active = false
          this.nav[2].active = false
          this.nav[3].active = true
          this.sortArray('rate')
          this.list.reverse()
          break
      }
    },
    sortArray: function(kind){
      quickSort(this.list, 0, this.list.length - 1, kind)
    }
  }
}
</script>
