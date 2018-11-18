<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd v-for="item in list" :key="item.id">{{item.name==='市辖区'?item.province:item.name}}</dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: []
      }
    },
    async mounted() {
      let {
        status,
        data: {
          hots
        }
      } = await this.$axios.get('http://118.31.69.104/geo/hotCity')
      if (status === 200) {
        this.list = hots
      }
    }
  }
</script>

<style lang="sass">
  @import '@/assets/css/changecity/hot.scss';
</style>
