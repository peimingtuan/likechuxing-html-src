<template>
    <div class="wrap" @click="press">
        <div class="item-header">
            <div class="name">
                <span>{{name}}(</span>
                <span class="numLabel">{{numLabel}}</span>
                <span>{{num}})</span>
            </div>
            <div class="status">{{status}}</div>
        </div>
        <div class="label">
            <span>{{label}}</span>
        </div>
        <div class="item-footer">
            <span>处理时长</span>
            <span class="time">{{time}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:['name','numLabel','num','status','label','time'],
    name:'listItem',
    methods:{
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        height: 1.21rem;
        background: #fff;
        padding: .17rem .1rem 0;
        margin-bottom: .1rem;
        .item-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .07rem;
            .name{
                font-size: .14rem;
                color: #333;
                line-height: .28rem;
                .numLabel{
                    color: #999;
                }
            }
            .status{
                font-size: .14rem;
                color: #999;
            }
        }
        .label{
            display: flex;
            span{
                padding:0 .08rem;
                height: .28rem;
                line-height: .28rem;
                border-radius: 2px;
                border:1px solid #CDCDCD;
                font-size: .12rem;
                color: #333;  
                margin-bottom: .12rem;
            }
        }
        .item-footer{
            font-size: .12rem;
            color: #999;
            .time{
                color: #151515;
            }
        }
    }
</style>


