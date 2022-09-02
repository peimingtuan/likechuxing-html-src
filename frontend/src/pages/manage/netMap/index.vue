<template>
    <div class="main">

        <Map />

        <router-view></router-view>
    </div>

</template>

<script>
  import Map from './components/map'

  export default {
    name: "net-map",
    components: {
      Map
    },
    created(){

      if (!window.CITY_LIST || window.CITY_LIST.length === 0) {
        this.$notify({
          title: '提示',
          message: '当前账号无权查看任何城市，请联系相关人员开放权限',
          type: 'info',
          duration: 0
        });
        return
      }

      // 存身份信息、城市列表
      this.$store.commit('setInit', {
        //uuid: window.uuid,
        //sign: window.sign,
        city_list: window.CITY_LIST.concat([{
          "id": 197202,
          "lat": 23.12908,
          "lng": 113.26436,
          "name": "广佛同城"
        }])
      })

    }
  }
</script>

<style lang=less scoped>

    .Control {
        position: fixed;
        background-color: #fff;
        border-radius: 3px;
        top: 20px;
        left: 20px;
        overflow: hidden;
        .header {
            background-color: #333;
            color: #fff;
            padding: 5px 20px;
        }

        .control {
            padding: 5px 20px;

        }

        .count {
            margin: 5px 0;
            padding: 5px 20px;
            .table {
                background: #000000;
                td, th {
                    background: #FFFFFF;
                    padding: 4px 6px
                }
            }
        }

    }

    .switchBox {
        margin: 5px 0;
        width: 130px;
        .point {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #222;
            &.blue {
                background-color: #0a8cff;
            }
        }
        .title {
            color: #999;
        }
        .item, .title {
            margin: 3px 0;
        }
    }

    .view {
        position: fixed;
        background-color: #fff;
        border-radius: 3px;
        top: 20px;
        right: 20px;
        padding: 5px 20px;
        box-shadow: 0 0 0 1px #999;
        .back {
            width: 100%;
            height: 32px;
            border-radius: 3px;
            margin: 5px 0 10px;
            font-size: 15px;
            outline: none;
        }
    }

</style>