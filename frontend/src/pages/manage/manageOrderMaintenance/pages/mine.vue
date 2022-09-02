<template>
    <div class="historyList">
        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="()=>{this.show_filter=true}"
                @tabRefresh="refresh"></HeaderTab>

        <div class="empty" v-if="list_history.length===0">
            当前列表为空
        </div>
        <PullDownRefresh
                v-else
                class="list"
                :opt="opt"
                @pullDown="pullDown"
                @pullUp="pullUp"
                ref="pullUpDown"
        >
            <CarBoxHistory v-for="item in list_history" :key="item.id" :data="item"/>
        </PullDownRefresh>

        <FilterRightBox
                v-if="show_filter"
                @close="()=>{this.show_filter=false}"

                @search="onChangeFilter"
        />
    </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  import {mapState} from 'vuex'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import CarBoxHistory from '../components/CarBoxHistory'
  import FilterRightBox from '../components/filterRightBox3'

  export default {
    name: "historyList",
    components: {
      HeaderTab,
      PullDownRefresh,
      CarBoxHistory,
      FilterRightBox
    },
    data(){
      return {
        headerTabModule: [
          'search',
          'filter',
          'refresh'
        ],
        opt: {
          height: 300, // 容器高度
          usePullDown:true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        show_filter:false
      }
    },
    computed:{
      ...mapState('mine',['list_history','limit'])
    },
    methods:{
      toSearch(){
        this.$router.push('/search?is_mine=1')
      },
      refresh(){
        Indicator.open()
        this.getList().then(()=>{
          Indicator.close()
        }).catch(err=>{
          Indicator.close()
        })
      },
      onChangeFilter(data){
        this.$store.commit('mine/setFilter',data)
        this.getList(false)
      },
      getList(append){
        return this.$store.dispatch('mine/getListHistory',{
          append:Boolean(append)
        })
      },
      pullDown(){
        this.getList().then(()=>{
          this.$refs.pullUpDown.update()
        })
      },
      pullUp(){
        let length = this.list_history.length
        this.getList(true).then(()=>{
          this.$refs.pullUpDown.update({
            noMore:(this.list_history.length-length)<this.limit
          })
        })
      }
    },
    created () {
      this.opt.height = window.innerHeight - window.REM * 0.38
      this.getList()
    }
  }
</script>

<style lang=less scoped>
    .historyList{
        background-color: #f6f6f6;
        min-height: 100vh;
        .empty{
            width: 100%;
            text-align: center;
            padding: 1rem 0;
            color:#999;
        }
    }
</style>