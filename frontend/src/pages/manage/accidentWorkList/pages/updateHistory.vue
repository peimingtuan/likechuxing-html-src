<template>
    <div class="container">
        <div class="title">操作历史:</div>
        <div class="item" v-for="item in historyDetail" :key="item.id">
            <div>
                <span class="label">{{item.time}}</span>
                <span>{{item.operate}}</span>
            </div>
            <div>
                <span class="label">{{item.real_name}}（{{item.user_name}}）</span>
                <span>{{item.remark}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions} from 'vuex'
import{ DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'updateHistory',
    computed:{
        ...mapState('workDetail',[
            'historyDetail'
        ])
    },
    created(){
        DDBase.setWebTitle('操作历史')
        this.getHistory()
    },
    methods:{
        ...mapActions('workDetail',[
            'getHistory'
        ])
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        padding: .15rem;
        background: #fff;
        .title{
            .fco(.14rem,#333);
            height: .46rem;
            line-height: .46rem;
        }
        .item{
            .fco(.12rem,#666);
            line-height: .22rem;
            margin-bottom: .1rem;
            .label{
                display: inline-block;
                width: 1.4rem;
            }
        }
    }
</style>


