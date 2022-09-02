<template>
    <div class="hisDetail">
        <history
                @goIndex='goIndex()'
                ref='history'>
        </history>
    </div>
</template>

<script>
  import $ from 'jquery'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import history from '../components/history'

  export default {
    name: 'hisDetail',
    components: {
      history
    },

    destroyed () {
      $('html').css('height', 'auto');
      $('body').css('height', 'auto');
      $('body').css('background', '#FFFFFF');
    },
    mounted () {
      $('html').css('height', '100%');
      $('body').css('height', '100%');
    },
    methods: {
      noteTxt () {//判断输入框是否有内容
        this.textLen = $('#textarea').val().length;
      },
      goIndex () {
        var item_id = Number(this.$refs.history.item_id);

        switch (item_id) {//为了后续追加页面，此处不使用default
          case 2:
            this.$router.push({//维修前拍照
              path: '/checkPhoto',
              query: {
                type: 'end',
                item_id: this.$refs.history.item_id,
                order_id: this.$refs.history.order_id
              }
            })
            break;
          case 3:
            this.$router.push({//保养前信息
              path:'/infoPrevious?order_id='+ this.$refs.history.order_id+'&view=1',
            })
            break;
          case 4:
            this.$router.push({//保养信息
              path:'/infoMaintain?order_id='+ this.$refs.history.order_id+'&view=1',
            })
            break;
          case 5:
            this.$router.push({//费用信息
                path:'/infoFee?order_id='+ this.$refs.history.order_id+'&view=1',
            })
            break;
          case 6:
            this.$router.push({//还车验车单
              path: '/checkPhoto',
              query: {
                type: 'end',
                item_id: this.$refs.history.item_id,
                order_id: this.$refs.history.order_id
              },
            })
            break;
        }
      }
    }
  }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .fc33 {
        color: #333333;
    }

    .fc99 {
        color: #999999;
    }

    .fc66 {
        color: #666666;
    }

    .f15b {
        color: #F15B5B;
    }

</style>