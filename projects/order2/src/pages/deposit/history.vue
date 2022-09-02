<template>
  <div class="history">
    <div v-if="gotData">
      <empty-list-icon v-if="data.length === 0" :type="'note'" :text="'当前暂无保证金记录'" />
      <ul class="deposit_list" v-if="data.length > 0">
        <li v-for="item in data">
          <div class="row row_1">
            <span>{{item.title}}</span>
            <span>{{item.deposit}}</span>
          </div>
          <div class="row row_2">
            <span>{{item.time}}</span>
            <span>{{item.method}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import EmptyListIcon from '../../components/emptyListIcon/index.vue'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import format from '../../common/Format'
  import {Alert,Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    data () {
      return {
      	// 是否请求过数据
      	gotData: false,
        data: []
      }
    },
    components: {
    	EmptyListIcon
    },
    computed: {},
    methods: {
    },
    created: function () {
      let loading = Loading()
      myAjax.post(API.deposit.history).then(res=>{
        if(res.data.length > 0){
          res.data.forEach(item => {
            this.data.push({
              title: item.title,
              deposit: item.sign + ' ' + item.deposit,
              time: format.time(item.time, 0),
              method: item.method
            })
          })
        }
        this.gotData = true
        loading.close()
      })
    }
  }
</script>

<style lang="less" scoped>
  .history{
    background-color: #F7f7f7;
  }
  .deposit_list{
    position: relative;
    top:0.2rem;
    background-color: #fff;
    border-top: solid 1px #DFDFDF;
    border-bottom: solid 1px #DFDFDF;
    li{
      border-bottom:solid 1px #DFDFDF;
      margin-left: 0.2rem;
      padding: 0.1rem 0;
      &:nth-last-of-type(1){
        border:none
      }
      .row_1{
        font-size: 0.14rem;
        color:#111;
      }
      .row_2{
        font-size: 0.12rem;
        color:#999
      }
      .row{
        text-align: left;
        span:nth-of-type(2){
          float: right;
          margin-right: 0.2rem;
        }
      }
    }
  }

</style>
