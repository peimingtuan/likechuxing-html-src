<template>
    <div class="container">
        <div class="search-wrap">
            <div class="main">
                <div class="icon"></div>
                <input type="text" placeholder="请输入车牌号"  v-model="searchWord">
            </div>
            <div class="btn" @click="search">搜索</div>
        </div>
        <div class="list" v-show="type==1">
            <TipListItem v-for="(item,index) in tipListData" :key="index" 
                :id="item.id"
                :plate_no="item.plate_no" 
                :vin="item.vin" 
                :status="item.car_status_name"
                :model_name="item.model_name" 
                :color="item.car_color"
                :peccancy_num="item.peccancy_num"
                :branch="item.branch.name"
                :time="item.last_examine_time" 
                :car_id="item.car_id"
                @press="handleListItem(item)"
            />
        </div>
        <div class="list"  v-show="type==2">
            <ListItem v-for="(item,index) in listData" :key="index" 
                type="indexItem"
                :id="item.id"
                :plate_no="item.plate_no" 
                :vin="item.vin" 
                :carStatus="item.car_status_name"
                :model_name="item.model_name" 
                :color="item.car_color"
                :branch="item.branch.name"
                :time="item.date_interval" 
                :status="item.status_name"
                @press="handleListItem(item)"
            />                 
        </div>
        <div class="list"  v-show="type==3">
            <ListItem v-for="(item,index) in myList" :key="index" 
                type="indexItem"
                :id="item.id"
                :plate_no="item.plate_no" 
                :vin="item.vin" 
                :carStatus="item.car_status_name"
                :model_name="item.model_name" 
                :color="item.car_color"
                :branch="item.branch.name"
                :time="item.date_interval" 
                :status="item.status_name"
                @press="handleListItem(item)"
            />                 
        </div>
        <div class="desc" v-show="false">没有搜到相关结果</div>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import TipListItem from '../components/indexPageTipListItem.vue'
import ListItem from '../components/indexPageWorkListItem.vue'

export default {
    name:'searchItem',
    components:{
       TipListItem,
       ListItem
    },
    computed:{
        ...mapState('search',[
            'type',
            'listData',
            'tipListData',
            'myList',
            'word',
            'isSearched'
        ]),
        isShowTip(){
            let { type, isSearched, tipListData, listData, myList } = this
            if(type==1){
                return isSearched && tipListData.length==0
            }else if(type==2){
                return isSearched && listData.length==0
            }else{
                return isSearched && myList.length==0
            }
        },
        searchWord:{
            get(){
                return this.word
            },
            set(v){
                this.setWord(v)
            }
        }
    },
    created(){
        this.setType(this.$route.query.type)
    },
    // beforeRouteEnter (to, from, next) {
    //     next(vm => {
    //         if(vm.$route.meta.destoryed){
    //             vm.emptyData()
    //         }
    //     })
    // },
    methods:{
        ...mapMutations('search',[
            'setType',
            'setWord',
            'emptyData'
        ]),
        ...mapActions('search',[
            'search',
        ]),
        handleListItem(item){
            let { type } = this;
            if(type==1){
                window.location.href = './../manageOrderCardetail/index.html?plate_no='+item.plate_no
            }else{
                if(item.status_name=='年检中'){
                    this.$router.push({
                        path:'workDetail',
                        query:{
                            order_id:item.id,
                            car_id:item.car_id
                        }
                    })
                }else{
                    this.$router.push({
                        path:'detailPreview',
                        query:{
                            order_id:item.id
                        }
                    })
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        .search-wrap{
            width: 100%;
            height: .54rem;
            padding: .1rem;
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .main{
                height: 100%;
                flex:1;
                background: #F0F0F0;
                border-radius: 2px;
                display: flex;
                align-items: center;
                padding: 0 .1rem;
                .icon{
                    width:.12rem;
                    height: .12rem;
                    background: url('../images/icon_search.png') no-repeat;
                    background-size: 100% 100%;
                }
                input{
                    display: block;
                    flex:1;
                    height: 100%;
                    border: none;
                    background: transparent;
                    padding-left: .08rem;
                    font-size: .12rem;
                }
            }
        }
        .btn{
            .wh(.46rem,100%);
            .fc();
            .br();
            border: 1px solid #f0f0f0;
            margin-left: .1rem;
        }
        .desc{
            .fco(.12rem,#aaa);
            margin:.2rem auto;
            padding-left: .3rem;
        }
    }
</style>



