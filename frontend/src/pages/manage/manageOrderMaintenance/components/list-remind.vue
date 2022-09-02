<template>
    <div class="list-remind">
        <HeaderTab
                :module="headerTabModule"
                @tabSort="()=>{this.show_orderBy=true}"
                @tabSearch="toSearch"
                @tabFilter="()=>{this.show_filter=true}"
                @tabRefresh="refresh"></HeaderTab>

        <div class="empty" v-if="list_remind.length===0">
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
            <div class="remind-item" v-for="item in list_remind" :key="item.id" @click="tapRemind(item)">
                <CarBoxRemind :data="item"/>
            </div>

        </PullDownRefresh>

        <OrderBy
                v-if="show_orderBy"
                :list="orderBy_list"
                :current="orderBy"
                @select="orderBySelect"
                @close="()=>{this.show_orderBy=false}" />

        <FilterRightBox
                v-if="show_filter"
                :preData="filter_box_data"
                @close="()=>{this.show_filter=false}"
                @finish="updateFilter"
        />
    </div>
</template>

<script>
  import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  import {mapState} from 'vuex'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import OrderBy from './OrderBy'
  import FilterRightBox from './filterRightBox'
  import CarBoxRemind from "./CarBoxRemind";

  export default {
    name: "list-remind",
    components: {
      CarBoxRemind,
      HeaderTab,
      PullDownRefresh,
      OrderBy,
      FilterRightBox
    },
    data () {
      return {
        headerTabModule: [
          'sort',
          'search',
          'filter',
          'refresh'
        ],
        opt: {
          height: 300, // 容器高度
          usePullDown:true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },

        show_orderBy:false,
        orderBy_list:[
          {text:'已超保养里程从高到低',id:1},
          {text:'已超保养时间从长到短',id:2},
          {text:'剩余保养里程从低到高',id:3},
          {text:'剩余保养时间从短到长',id:4}
        ],
        orderBy:1,

        show_filter:false,

        filter_box_data:{
          distance_total: '',
          distance_pass: '',
          day_pass: '',
          day_remain: '',
          finish_times: 0,
          car_status: 0,
          car_model: 0
        }
      }
    },
    computed: {
      ...mapState('list', ['list_remind','limit_remind']),
      filter_result(){
        let data = {
          sort:this.orderBy,
        }

        if(this.filter_box_data.distance_total)data.total_km = this.filter_box_data.distance_total
        if(this.filter_box_data.distance_pass)data.over_km = this.filter_box_data.distance_pass
        if(this.filter_box_data.day_pass)data.over_day = this.filter_box_data.day_pass
        if(this.filter_box_data.day_remain)data.surplus_day = this.filter_box_data.day_remain
        if(this.filter_box_data.finish_times){
          if(this.filter_box_data.finish_times<3){
            data.maintain_number = this.filter_box_data.finish_times-1
          }else{
            data.maintain_number = '1+'
          }
        }
        if(this.filter_box_data.car_status)data.status = this.filter_box_data.car_status
        if(this.filter_box_data.car_model)data.car_model_id = this.filter_box_data.car_model
        console.log(data.maintain_number)
        return data
      }
    },
    methods:{
      getList(append){
        return this.$store.dispatch('list/getListRemind',Object.assign({
          append:Boolean(append)
        },this.filter_result)).catch(err=>{
          if(/code 500/.test(err.message)){
            this.$_LIKE_alert({
              msg:'服务器接口500错误，请联系开发'
            })
          }else{
            throw err
          }
        })
      },

      orderBySelect(id){
        this.orderBy=id
        this.refresh()
      },
      updateFilter(data){
        this.filter_box_data = data
        this.refresh()
      },

      toSearch(){
        this.$router.push('/search')
      },
      refresh(){
        this.getList().then(this.$refs.pullUpDown.update)
      },
      pullUp(){
        let length = this.list_remind.length
        this.getList(true).then(()=>{
          this.$refs.pullUpDown.update({
            noMore:(this.list_remind.length - length)<this.limit_remind
          })
        })
      },
      pullDown(){
        this.getList().then(()=>{
          this.$refs.pullUpDown.update()
        })
      },

      tapRemind(data){
        this.$router.push({
          path:'/carRemind',
          query:{
            id:data.id
          }
        })
      }
    },
    created () {
      this.opt.height = window.innerHeight - 46 - window.REM * 0.38
      this.getList()
    }
  }
</script>

<style lang=less scoped>
    .list-remind {
        background-color: #f6f6f6;

        .remind-item{
            margin-top: 0.1rem;
            &:nth-of-type(1){
                margin-top: 0;
            }
        }
        .empty{
            color:#999;
            text-align: center;
            padding: 1rem 0;
        }
    }
</style>