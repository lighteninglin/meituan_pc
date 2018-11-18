<template>
  <Affix :offset-top="-32">
    <div :id="id" :style="{width:width+'px',height:height+'px'}" class="m-map" />
  </Affix>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 300
      },
      height: {
        type: Number,
        default: 300
      },
      point: {
        type: Array,
        default () {
          return [
            [116.46, 39.92]
          ]
        }
      },
      pointName:{
        type: Array,
        default() {
          return ['第一家']
        }
      },
      scrollVal: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    data() {
      return {
        id: `map`,
        key: '0dbc0dfd7c775f2a927174493eab8220'
      }
    },
    watch: {
      point: function(val, old) {
        this.map.setCenter(val[0])
      },
      scrollVal: function(val, old){
        if(val>=218&&val<500){
          this.infoWindow.setContent(this.pointName[0])
          this.infoWindow.open(this.map, this.point[0])
          this.map.setCenter(this.point[0])
        }else if(val>=500){
          let tempIndex = parseInt((val-500) / 172 + 1)
          this.infoWindow.setContent(this.pointName[tempIndex])
          this.infoWindow.open(this.map, this.point[tempIndex])
          this.map.setCenter(this.point[tempIndex])
        }
      }
    },
    mounted() {
      let self = this
      self.id = `map${Math.random().toString().slice(4, 6)}`
      let infoWindow = {}
      window.onmaploaded = () => {
        let map = new window.AMap.Map(self.id, {
          resizeEnable: true,
          zoom: 11,
          center: self.point[0]
        })
        self.map = map
        // 移动到指定点
        // map.panTo([116.405467, 39.907761]);
        window.AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
          let i = 1
          self.point.forEach(point => {
            new SimpleMarker({
              //设置节点属性
              iconLabel: {
                //普通文本
                innerHTML: `${i}`,
                //设置样式
                style: {
                  color: '#fff',
                  marginTop: '2px'
                }
              },
              iconStyle: {
                src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
              },
              map: map,
              position: point
            })
            i++
          })
        })

        window.AMap.plugin('AMap.ToolBar', () => {
          let toolbar = new window.AMap.ToolBar()
          map.addControl(toolbar)
        })

        self.infoWindow = new window.AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
      }
      const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onmaploaded`
      let jsapi = document.createElement('script')
      jsapi.charset = 'utf-8'
      jsapi.src = url
      document.head.appendChild(jsapi)
      const url2 = `https://webapi.amap.com/ui/1.0/main.js?v=1.0.11`
      let jsapi2 = document.createElement('script')
      jsapi2.charset = 'utf-8'
      jsapi2.src = url2
      document.head.appendChild(jsapi2)
    }
  }
</script>

<style lang="scss">
.ivu-affix{
  box-shadow: 0 5px 14px 0 rgba(0,0,0,.19);
}
.m-map{
  margin-top: 34px;
}
</style>
