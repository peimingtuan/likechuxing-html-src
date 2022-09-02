<template>
    <div class="container">
        <SerachBar placeholder="请输入车牌号或者VIN后6位" @changeValue="getInputValue">
            <div slot="rightBtn" class="btn" @click="search">搜索</div>
        </SerachBar>
        <div class="list">
            <div class="cell" @click="handleListItem(item.id)" v-for="(item,index) in searchRes" :key="index">
                <span>{{item.plate_no}}</span>
                <span>（{{item.like_user}}）</span>
            </div>
        </div>
        <div class="desc" v-show="isSearched && searchRes.length==0">没有搜到相关结果</div>
    </div>
</template>
<script>
import SerachBar from '../components/searchBar'
import { mapState } from 'vuex'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'searchItem',
    components:{
       SerachBar
    },
    data(){
        return{
            listData:[],
            v:'',
            isSearched:false
        }
    },
    computed:{
        ...mapState('workList',[
            'searchRes'
        ])
    },
    created(){
        DDBase.setWebTitle('搜索')
    },
    methods:{
        getInputValue(v){
            this.v = v
        },
        search(){
            let v = this.v
            if(v==''){
                return
            }
            this.$store.dispatch('workList/search',v)
            this.isSearched = true
        },
        handleListItem(id){
            this.$router.push({path:'workListDetail',query:{order_id:id}})
        }
    },
    destroyed(){
        this.$store.commit('workList/setSearchres',[])
    },
    beforeRouteLeave (to, from, next) {
        // if()
        // to.meta.keepAlive = this.needCache
        next()
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
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
        .list{
            .cell{
                height: .38rem;
                display: flex;
                align-items: center;
                padding: 0 .1rem;
                border-top: 1px solid #f6f6f6;
                font-size: .14rem;
                color: #333;
                background: #fff;
            }
        }
    }
</style>



