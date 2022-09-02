<template>
    <div class="container">
        <WorkListItem
            :id="info.id"
            :plate_no="info.plate_no" 
            :vin="info.vin" 
            :carStatus="info.car_status_name"
            :model_name="info.model_name" 
            :color="info.car_color"
            :branch="info.current_branch_name"
            :parking_no="info.current_parking_no" 
            :parking_floor="info.current_parking_floor"
            :car_factory_name="info.car_factory_name"
            :remain_km="info.remain_km"
            :fromType="1"
        />
        <div class="checkbox">
            <div>更改车辆状态：</div>
            <div class="radio">
                <div class="item" v-for="(item,index) in radioList" :key="index" @click="select(index)">
                    <div class="icon" :class="item.selected?'on':''"></div>
                    <div class="label">{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="desc">请确认是否将车辆更改为年检状态。</div>
        <FooterBtn txt="提交" @press="finish" :active="car_status!==''"/>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import WorkListItem from '../components/indexPageWorkListItem.vue'
import FooterBtn from '../components/footerBtn.vue'

export default {
    name:'createWork',
    components:{
        WorkListItem,
        FooterBtn
    },
    data(){
        return{
            radioList:[
                {
                    id:1,
                    name:'是',
                    selected:false
                },
                {
                    id:0,
                    name:'否',
                    selected:false
                }
            ]
        }
    },
    computed:{
        ...mapState('createWork',[
            "info",
            "car_status"
        ])
    },
    async created(){
        this.$showLoading('carInfo')
        this.setCarId(this.$route.query.car_id)
        await this.getInfo()
        this.$hideLoading('carInfo')
    },
    methods:{
        ...mapActions('createWork',[
            'createOrder',
            'getInfo',
        ]),
        ...mapMutations('createWork',[
            'setCarId',
            'setCarStatus',
        ]),
        select(index){
            let arr = this.radioList.slice();
            arr.map(item=>{
                item.selected = false
            })
            arr[index].selected = true
            this.radioList = arr
            this.setCarStatus(arr[index].id)
        },
        finish(){
            if(this.car_status===''){
                return 
            }
            this.createOrder(this)
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        .checkbox{
            height: .54rem;
            padding-left: .15rem;
            background: #fff;
            margin-top: -.1rem;
            position: relative;
            &::before{
                content:'';
                width: 100%;
                height: 1px;
                background: #ddd;
                transform: scaleY(.5);
                position: absolute;
                top: 0;
                left: 0;   
            }
            .fco(.14rem,#333);
            .fd();
            .radio{
               .fd(); 
               margin-left: .15rem;
               .item{
                   .fd();
                   margin-right: .3rem;
                   .icon{
                       width: .14rem;
                       height: .14rem;
                       border-radius: 50%;
                       border: 1px solid #ddd;
                       margin-right: .04rem;
                       &.on{
                            border: none;
                            border-radius: 0;
                            background: url('../images/selected.png') no-repeat;
                            background-size: 100% 100%;
                       }
                   }
               }
            }
        }
        .desc{
            padding: .1rem .15rem;
            .fco(.14rem,#333);
        }
    }
</style>


