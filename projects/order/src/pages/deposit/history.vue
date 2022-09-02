<template>
  <div class="history">
    <div v-if="gotData">
      <empty-list-icon v-if="data.length === 0" :type="'note'" :text="'当前暂无押金记录'"></empty-list-icon>
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
  import myaxios from '../../common/myaxios'
  import API from '../../common/apiAddress'
  import format from '../../common/Format'
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
    	this.$store.commit('Loading/show', {
    		kind: 1
      })
      myaxios.post(API.deposit.history, {
      	uuid: this.$store.state.user.uuid,
        sign: this.$store.state.user.sign
      }).then(function (res) {
      	if (+res.data.status === 0 && res.data.data.length > 0) {
      		res.data.data.forEach(item => {
            this.data.push({
              title: item.title,
              deposit: item.sign + ' ' + item.deposit,
              time: format.time(item.time, 0),
              method: item.method
            })
          })
        }
        this.gotData = true
        this.$store.commit('Loading/hide')
      }.bind(this))
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
