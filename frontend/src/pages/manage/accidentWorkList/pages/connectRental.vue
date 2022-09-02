<template>
    <div class="container">
        <SerachBar placeholder="请输入订单ID" @changeValue="search"/>
        <div class="list">
            <ConnectListItem
                v-for="(item,index) in rentalList"
                :key="item.id"
                :rentalId="item.id"
                :status="item.status"
                :plate="item.plate_no"
                :phone="item.phone"
                :startBranch="item.begin_branch"
                :endBranch="item.end_branch"
                :startTime="item.begin_time"
                :endTime="item.end_time"
                :isSelected="item.isSelected"
                :index="index"
                @itemClick="itemClick"
            />
            <div class="empty" v-show="rentalList.length==0">暂未查询到相关订单</div>
        </div>
        <footerBtn txt="请选择订单以关联" :active="activeIndex===''?false:true" @press="comfirm"/>
    </div>
</template>
<script>
import SerachBar from '../components/searchBar'
import footerBtn from '../components/footerBtn'
import ConnectListItem from '../components/connectListItem'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { mapState, mapActions } from 'vuex'
export default {
    name:'connectRental',
    components:{
       SerachBar,
       ConnectListItem,
       footerBtn
    },
    computed:{
        ...mapState('createWork',[
            'rentalList',
            'activeIndex',
        ])
    },
    created(){
        DDBase.setWebTitle('关联订单')
        this.getList()
    },
    methods:{
        ...mapActions('createWork',[
            'getList'
        ]),
        search(val){
            this.timer && clearTimeout(this.timer)
            const _this = this;
            this.timer = setTimeout(()=>{
                 _this.getList(val)
            },500) 
        },
        itemClick(index){
            this.$store.commit('createWork/selectRentalList',index)
            this.$store.commit('createWork/setActiveIndex',index)
        },
        comfirm(){
            this.$store.commit('createWork/setSelectIndex',this.activeIndex)
            this.$router.go(-1)
        }
    },
    destroyed(){
        this.timer && clearTimeout(this.timer)
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        padding-bottom: .75rem;
        .empty{
            margin-top: .3rem;
            text-align: center;
            color: #999;
        }
    }
</style>


