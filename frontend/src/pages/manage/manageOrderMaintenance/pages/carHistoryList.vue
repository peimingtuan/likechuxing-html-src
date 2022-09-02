<template>
    <div class="historyList">
        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="()=>{this.show_filter=true}"
                @tabRefresh="refresh"></HeaderTab>

        <PullDownRefresh
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
        show_filter:false,
        limit:10,
        offset:0
      }
    },
    computed:{
      ...mapState('history',['list_history'])
    },
    methods:{
      onChangeFilter(data){
        this.$store.commit('history/setFilter',data)
      },
      getList(append){
        return this.$store.dispatch('history/getListHistory',{
          append:Boolean(append),
          car_id:this.$route.query.car_id
        })
      },
      pullDown(){
        this.offset = 0
        this.getList().then(()=>{
          this.$refs.pullUpDown.update()
        })
      },
      pullUp(){
        let offset_old = this.offset
        this.getList().then(()=>{
          this.$refs.pullUpDown.update({
            noMore:(this.offset-offset_old)<this.limit
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

}
</style>