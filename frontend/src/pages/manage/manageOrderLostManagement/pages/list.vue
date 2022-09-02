<template>
    <div class="List">

        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="filterShow"
                @tabRefresh="refresh"
        />

        <div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="list.length === 0">
            列表为空
        </div>
        <PullDownRefresh
                v-else
                :opt="opt"
                @pullDown="pullDown"
                @pullUp="pullUp"
                ref="pullUpDown"
        >
            <div class="orderBox"
                 v-for="item in list"
                 :key="item.id"
                 @click="()=>toDetail(item.id)"
            >
                <div>
                    <span>{{item.plate_no}}（</span>
                    <span class="gray">{{item.vin_front}}</span>
                    <span>{{item.vin_end}}）</span>
                    <span class="float-right status">{{item.statusDesc}}</span>
                </div>
                <div class="des ">
                    遗失物品：{{item.lost}}
                </div>
                <div class="des">
                    时长：{{item.update_time_d}}
                </div>
            </div>
        </PullDownRefresh>

        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">

            <div class="FilterBox" v-if="search">
                <div class="filter-title">车牌号：</div>
                <div class="filter-list">
                    <div class="filter-item active">{{search.name}}</div>
                </div>
            </div>

            <FilterMultiple
                title="遗失物品状态"
                :options="options"
                :preselect="status"
                ref="filter"
            />

            <div class="box-footer">
                <LikeButton
                        text="重置"
                        type="gray"
                        @click="filterReset"
                        class="btn"
                />
                <LikeButton
                        text="确定"
                        type="primary"
                        @click="filterSearch"
                        class="btn float-right"
                />
            </div>
        </SlideUpBox>

    </div>
</template>

<script>
  import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import LostOrder from '../js/class.LoatOrder'
  const OrderStatus = require('../js/orderStatus')
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  require('../css/orderBox.less')

  export default {
    name: "list",
    components: {
      HeaderTab,
      SlideUpBox,
      FilterMultiple,
      PullDownRefresh,
      LikeButton
    },
    data () {
      return {
        headerTabModule: [
          'search',
          'filter',
          'refresh'
        ],
        filter_show: false,
        options:OrderStatus.map(item=>{
          item.id = item.status
          return item
        }),
        status:[],
        page:1,
        opt: {
          height: 300, // 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        dataReady:false,
        list:[],

        // 是否是搜索来的
        search:false
      }
    },
    methods: {
      click(){
        console.log('click')
      },
      getList(){
        return myAjax.post(getOspApiUrl('/lost-record/list'),{
          status:this.status.join(','),
          car_id:this.search ? this.search.id : '',
          page:this.page,
          limit:10,
          mobile:userData.state.mobile
        }).then(res=>{
          this.dataReady = true
          if(res.status !== 0){
            throw res
          }else{
            return res.data.map(item=>new LostOrder(item))
          }
        })
      },

      pullDown(){
        this.page = 1
        this.getList().then(res=>{
          this.list = res
          this.$nextTick(()=>{
            this.$refs.pullUpDown.update()
          })
        }).catch(this.handleError)
      },
      pullUp(){
        this.page++
        this.getList().then(res=>{
          this.list = this.list.concat(res)
          if(res.length === 0){
            this.$nextTick(()=>{
              this.$refs.pullUpDown.update({noMore:true})
            })
          }else{
            this.$nextTick(()=>{
              this.$refs.pullUpDown.update()
            })
          }
        }).catch(this.handleError)
      },

      toSearch () {
        window.location.href = '../manageOrderMain/index.html#/searchPlate?type=1'
      },
      filterShow () {
        this.filter_show = true
      },
      refresh () {
        this.list = []
        this.dataReady = false
        this.pullDown()
      },

      filterClose () {
        this.filter_show = false
      },
      filterReset(){
        this.$refs.filter.reset()
      },
      filterSearch(){
        this.filter_show = false
        this.status = this.$refs.filter.getResult()
        this.pullDown()
      },

      toDetail(id){
        this.$router.push({
          path:'/detail',
          query:{
            order_id:id
          }
        })
      },

      handleError(err){
        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          console.log(err)
        }
      }
    },
    created(){
      // 计算列表容器高度
      this.opt.height = window.innerHeight - window.REM * 0.4 - 1

      if(this.$route.query.search_id){
        // 从搜索回来的
        this.search = {
          id:this.$route.query.search_id,
          name:this.$route.query.search_name
        }
      }
      this.getList().then(res=>{
        this.list = res
      }).catch(this.handleError)
    }
  }
</script>

<style lang=less scoped>

.List{
    .status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }

    .box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
        .btn {
            width: 47%;
        }
    }
}
</style>