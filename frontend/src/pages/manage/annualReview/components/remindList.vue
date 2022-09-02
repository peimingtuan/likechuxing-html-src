<template>
    <div class="list-wrap">
        <div class="list" >
            <scroller :on-refresh="refreshList" :on-infinite="loadMore" ref="scroller1" :noDataText="emptyText">      
                <ListItem v-for="(item,index) in tipListData" :key="index" 
                    :id="item.id"
                    :plate_no="item.plate_no" 
                    :vin="item.vin" 
                    :status="item.car_status_name"
                    :model_name="item.model_name" 
                    :color="item.car_color"
                    :peccancy_num="item.peccancy_num"
                    :branch="item.branch.name"
                    :time="item.last_examine_time"
                    :parking_no="item.branch.parking_no" 
                    :parking_floor="item.branch.parking_floor"
                    :car_id="item.car_id"
                    @press="handleListItem(item)"
                /> 
            </scroller>
        </div>
    </div>
</template>
<script>
import ListItem from './indexPageTipListItem.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    name:'remindList',
    components:{
        ListItem
    },
    data(){
        return{
            emptyText:'',
        }
    },
    computed:{
        ...mapState('workList',[
            "tipListData",
            "isNoMoreTipData",
            'tipPage'
        ])
    },
    watch:{
      listData(v){
          if(v.length){
              this.emptyText = '没有更多数据了'
          }else{
              this.emptyText = '暂无数据'
          }
      }  
    },
    created(){
        this.getTipList()
    },
    methods:{
        ...mapActions('workList',[
            'getTipList',
        ]),
        ...mapMutations('workList',[
            'setTipListData',
        ]),
        async loadMore(){
            await this.getTipList()
            this.$refs.scroller1.finishInfinite(true)
            this.isNoMoreTipData && this.$refs.scroller1.finishInfinite(true)
            },
        async refreshList(){
            this.setTipListData({ tipPage:0,tipListData:[] })
            await this.getTipList()
            this.$refs.scroller1.finishPullToRefresh(false)
        },
        handleListItem(item){
            window.location.href = './../manageOrderCardetail/index.html?plate_no='+item.plate_no
        }
    }
}
</script>
<style lang="less" scoped>
    .list-wrap{
        height: 100%;
        .list{
            height: 100%;
            position: relative;
        }
    }
</style>

