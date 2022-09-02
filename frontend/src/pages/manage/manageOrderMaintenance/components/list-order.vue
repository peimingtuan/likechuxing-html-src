<template>
    <div class="list-order">
        <HeaderTab
                :module="headerTabModule"
                @tabSort="()=>{this.show_orderBy=true}"
                @tabSearch="toSearch"
                @tabFilter="()=>{this.show_filter=true}"
                @tabRefresh="refresh"
        />

        <div class="empty" v-if="list_maintain.length===0">
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
            <div class="maintain-item" v-for="item in list_maintain" :key="item.id" @click="tapMaintain(item)">
                <CarBoxMaintain  :data="item"/>
            </div>

        </PullDownRefresh>

        <OrderBy
                v-if="show_orderBy"
                :list="orderBy_list"
                :current="orderBy"
                @select="orderBySelect"
                @close="()=>{this.show_orderBy=false}"/>

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
  import FilterRightBox from './filterRightBox2'
  import CarBoxMaintain from "./CarBoxMaintain";

  export default {
    name: "list-order",
    components: {
      CarBoxMaintain,
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
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },

        show_orderBy: false,
        orderBy_list: [
          {text: '创建时间由近到远', id: 1},
          {text: '创建时间由远到近', id: 2},
          {text: '保养次数从低到高', id: 3},
          {text: '保养次数从高到低', id: 4}
        ],
        orderBy: 1,

        show_filter: false,

        filter_box_data: {
          order_type: 0,
          history_times: 0
        }
      }
    },
    computed: {
      ...mapState('list', ['list_maintain','limit_maintain']),
      filter_result () {
        let data = {
          is_mine: 0,
          sort:this.orderBy
        }

        if(this.filter_box_data.history_times)data.number = this.filter_box_data.history_times
        if(this.filter_box_data.order_type)data.status =this.filter_box_data.order_type

        return data
      }
    },
    methods: {
      getList (append) {
        return this.$store.dispatch('list/getListMaintain', Object.assign({
          append: Boolean(append)
        }, this.filter_result)).catch(err => {
          if (/code 500/.test(err.message)) {
            this.$_LIKE_alert({
              msg: '服务器接口500错误，请联系开发'
            })
          } else {
            throw err
          }
        })
      },
      updateFilter (data) {
        this.filter_box_data = data
        this.refresh()
      },
      orderBySelect(id){
        this.orderBy=id
        this.refresh()
      },
      toSearch () {
        this.$router.push('/search')
      },
      refresh () {
        this.getList().then(this.$refs.pullUpDown.update())
      },
      pullUp () {
        let length = this.list_maintain.length
        this.getList(true).then(()=>{
          this.$refs.pullUpDown.update({
            noMore:(this.list_maintain.length - length)<this.limit_maintain
          })
        })
      },
      pullDown () {
        this.getList().then(()=>{
          this.$refs.pullUpDown.update()
        })
      },

      tapMaintain(item){
        if(Number(item.status)===3){
          // 已完成
          this.$router.push({
            path:'/finishOrder',
            query:{
              order_id:item.id
            }
          })
        }else{
          this.$router.push({
            path:'/edit',
            query:{
              order_id:item.id
            }
          })
        }

      }
    },
    created () {
      this.opt.height = window.innerHeight - 46 - window.REM * 0.38
      this.getList()
    }
  }
</script>

<style lang=less scoped>
    .list-order{
        .list {
            background-color: #f6f6f6;
        }
        .maintain-item{
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