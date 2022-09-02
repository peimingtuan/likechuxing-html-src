<template>
    <div class="list-wrap">
        <div class="list" >
            <scroller :on-refresh="refreshList" :on-infinite="loadMore" ref="scroller" :noDataText="emptyText">      
                <ListItem v-for="(item,index) in tipListData" :key="index" 
                    type="indexItem"
                    :id="item.id"
                    :plate_no="item.plate_no" 
                    :vin="item.vin" 
                    :carStatus="item.car_status_name"
                    :model_name="item.model_name" 
                    :color="item.color"
                    :remain_km="item.remain_km"
                    :branch="item.branch?item.branch.name:''"
                    :time="item.prepare_duration" 
                    :remark="item.car_status_recent_desc"
                    :car_limit="item.car_limit||[]"
                    @press="deleteItem(item)"
                /> 
            </scroller>
        </div>
    </div>
</template>
<script>
import ListItem from './indexPageWorkListItem.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import { MessageBox } from 'mint-ui';
export default {
    name:'indexList',
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
            "isNoMoreTipData"
        ])
    },
    watch:{
      tipListData(v){
          if(v.length){
              this.emptyText = '没有更多数据了'
          }else{
              this.emptyText = '暂无数据'
          }
      }  
    },
    created(){
        this.setTipListData({ tipPage:0,tipListData:[],isNoMoreTipData:false })
        this.getTipList()
    },
    methods:{
        ...mapActions('workList',[
            'getTipList',
            'deleteListItem'
        ]),
        ...mapMutations('workList',[
            'setTipListData'  
        ]),
        async loadMore(){
                await this.getTipList()
                this.$refs.scroller.finishInfinite(true)
                this.isNoMoreTipData && this.$refs.scroller.finishInfinite(true)
        },
        async refreshList(){
            this.setTipListData({ tipPage:0,tipListData:[] })
            await this.getTipList()
            this.$refs.scroller.finishPullToRefresh(false)
        },
        deleteItem(item){
            const  _this = this
            let str = '是否将 '+item.plate_no+' 从整备列表中清除？清除后该车辆将不作为长租整备车辆。'
            MessageBox.confirm(str).then(res => {
               _this.deleteListItem(item.id)
            }).catch(err=>{
                console.log(err)
            })
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

