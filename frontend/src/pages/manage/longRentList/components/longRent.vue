<template>
    <div class="list-wrap">
        <div class="list-header" @touchmove.prevent="">
            <div class="select-btn-group">
                <div class="item" @click="showCityPicker">
                    <div class="label">{{longRentCityName}}</div>
                    <div class="icon" v-show="cityList.length>1"></div>
                </div>
                <div class="item" @click="showDatePicker">
                    <div class="label">{{longRentDate}}</div>
                    <div class="icon"></div>
                </div>
            </div>
            <div class="total-num">
                <div class="item">
                    <span>预定网点数：</span>
                    <span>{{listStat.branch_num}}</span>
                </div>
                <div class="item">
                    <span>预定车辆数：</span>
                    <span>{{listStat.order_num}}</span>
                </div>
                <div class="item">
                    <span>已认证：</span>
                    <span>{{listStat.auth_num}}</span>
                </div>
            </div>
        </div>
        <div class="list" >
            <scroller :on-refresh="refreshList" :on-infinite="loadMore" ref="scroller1" :noDataText="emptyText">      
                <ListItem v-for="(item,index) in listData" :key="index" 
                    :id="item.branch.id"
                    :branchName="item.branch.name"
                    :branchAddress="item.branch.address"
                    :branchType="item.branch.type"
                    :lat="item.branch.lat"
                    :lng="item.branch.lng"
                    :stat="item.stat"
                    :user_poi="user_poi"
                    @press="handleListItem(item.branch.id)"
                /> 
            </scroller>
        </div>
        <Picker :show="isShowCityPicker" :list="cityPickerData" title="城市"  @hidePicker="hideCityPicker" @selectValue="selectCity"/>
        <mt-datetime-picker
            ref="datePicker"
            type="date"
            :startDate="startDate"
            :endDate="endDate"
            v-model="datePickerValue"
            @confirm="getDateValue"
        >
        </mt-datetime-picker>
    </div>
</template>
<script>
import ListItem from './longRentListItem.vue'
import Picker from './picker.vue'
import { DatetimePicker } from 'mint-ui';
import { mapState, mapActions, mapMutations } from 'vuex'
import tools from '../js/tools'
export default {
    name:'remindList',
    components:{
        ListItem,
        Picker
    },
    data(){
        return{
            user_poi:[],
            emptyText:'',
            isShowCityPicker:false,
            cityList:[],
            datePickerValue:tools.toSetDay(1),
            startDate:tools.toSetDay(0),
            endDate:tools.toSetDay(30)
        }
    },
    computed:{
        ...mapState('workList',[
            "listData",
            "isNoMoreData",
            'page',
            'listStat',
            'longRentDate',
            'longRentCityName'
        ]),
        cityPickerData(){
            let arr = this.cityList.slice();
            let citys = []
            arr.map(item=>{
                citys.push(item.name)
            })
            let res = [
                {
                   defaultIndex:0, 
                   values:citys
                }
            ]
            return res
        }
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
        //获取缓存城市列表
        let citys = JSON.parse(sessionStorage.getItem('cityList'))
        let arr = []
        let guangzhou = {}
        citys.map(item=>{
            if(item.id!=197){
                arr.push(item)
            }else{
                guangzhou = Object.assign({},item)
            }
        })
        if(guangzhou.hasOwnProperty('id')){
            arr.unshift(guangzhou)
        }
        this.cityList = arr

        //设置默认日期城市
        if(!this.longRentCityName){
            this.setLongRentCityName(this.cityList[0].name)
            this.setLongRentCity(this.cityList[0].id)
            this.setLongRentDate(tools.initDate(tools.toSetDay(1)))
        }
        this.$DD.init();
        //重置page页数
        this.setListData({ page:0, listData:[], isNoMoreData:false  })
        //请求长租列表
        this.getList()
        const _this = this
        if(this.$DD.inDDApp){
            console.log('inDDApp')
            this.$DD.getLocation().then(res=>{
                _this.user_poi = [res.longitude,res.latitude]
                _this.setUserPIO(_this.user_poi)
    
            }).catch(err=>{

                console.log(err)
            })
        }else{
            this.user_poi = [113.2560825348,23.1245740244]
            this.setUserPIO(this.user_poi)
        }
    },
    methods:{
        ...mapActions('workList',[
            'getList',
        ]),
        ...mapMutations('workList',[
            'setListData',
            'setLongRentDate',
            'setLongRentCity',
            'setUserPIO',
            'setLongRentCityName'
        ]),
        async loadMore(){
            await this.getList()
            this.$refs.scroller1.finishInfinite(true)
            this.isNoMoreData && this.$refs.scroller1.finishInfinite(true)
    
            // if(this.isNoMoreData){
            //     console.log(document.body)
            // }
        },
        async refreshList(){
            this.setListData({ page:0,listData:[] })
            await this.getList()
            this.$refs.scroller1 && this.$refs.scroller1.finishPullToRefresh(false)
        },
        handleListItem(id){
            this.$router.push({
                path:'detail',
                query:{
                    branch_id:id
                }
            })
        },
        showCityPicker(){
            if(this.cityList.length>1){
                this.isShowCityPicker = true
            }
        },
        selectCity(v){
            this.setLongRentCityName(v[0])
            let cityId = '';
            this.cityList.map(item=>{
                if(item.name==v[0]){
                    cityId = item.id
                }
            })
            this.setLongRentCity(cityId)

            this.getList()
        },
        getDateValue(v){
            let date = tools.timestampToDate(v)
            this.setLongRentDate(date)

            this.getList()
        },
        hideCityPicker(){
            this.isShowCityPicker = false
        },
        showDatePicker(){
            this.$refs.datePicker.open();
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .list-wrap{
        height: 100%;
        padding-top: .85rem;
        .list{
            height: 100%;
            position: relative;
            padding-bottom: .3rem;
        }
        .list-header{
            position: fixed;
            top:.68rem;
            left: 0;
            width: 100%;
            background: #fff;
            z-index: 20;
            .select-btn-group{
                .fc();
                border-bottom: 1px solid #f6f6f6;
                height: .4rem;
                .item{
                    flex:1;
                    .fc();
                    .fco(.12rem,#333);
                    .icon{
                        width:.09rem;
                        height: .04rem;
                        margin-left: .1rem;
                        background: url('../images/icon_drop.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            .total-num{
                .fc();
                .item{
                    flex:1;
                    height: .34rem;
                    .fc();
                    .fco(.12rem,#666);
                }
            }
        }
    }
</style>

