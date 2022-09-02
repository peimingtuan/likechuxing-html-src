<template>
    <div class="wrap" @click="handleClick(index)">
        <div class="icon-box">
            <div class="icon" :class="isSelected?'on':''"></div>
        </div>
        <div class="content">
            <div class="item-header">
                <div class="title">
                    <div class="rental-id">订单ID：{{rentalId}}</div>
                    <div class="status">{{status}}</div>
                </div>
                <div class="phone-box">
                    <div>{{plate}}</div>
                    <div>{{phone}}</div>
                </div>
            </div>
            <div class="item-body">
                <div class="dot-box">
                    <div class="label">取：</div>
                    <div>{{startBranch}}</div>
                </div>
                <div class="dot-box">
                    <div class="label">还：</div>
                    <div>{{endBranch}}</div>
                </div>
                <div class="dot-box">
                    <div class="label">取还时间：</div>
                    <div>{{startTime}}—{{endTime}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['rentalId','status','plate','phone','startBranch','endBranch','startTime','endTime','isSelected','index'],
    methods:{
        handleClick(index){
            this.$emit('itemClick',index)
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        width: 100%;
        height: 1.43rem;
        background: #fff;
        margin-top: .1rem;
        display: flex;
        align-items: center;
        .icon-box{
            width:.35rem;
            height: 100%;
            display: flex;
            align-items: center;  
            justify-content:center;
            border-right: 1px dashed #E9E9E9;
            .icon{
                width:.25rem;
                height: .25rem;
                border: 1px solid #979797;
                border-radius: 50%;
                &.on{
                    border: none;
                    background: url('../images/icon_selected.png') no-repeat;
                    background-size: 100% 100%;
                    border-radius: none;
                }
            }
        }
        .content{
            flex:1;
            .item-header{
               border-bottom: 1px dashed #E9E9E9; 
               padding: .02rem .1rem .03rem .08rem;
               .title{
                    font-size: .14rem;
                    color: #333;
                    display: flex;
                    align-items: center;  
                    justify-content:space-between;
                    .status{
                        color: #999;
                    }
               }
               .phone-box{
                   display: flex;
                   align-items: center; 
                   div{
                       flex:1;
                       font-size: .14rem;
                        color: #333;
                   }
               }
            }
            .item-body{
                padding: .03rem .1rem 0 .08rem;
                .dot-box{
                    display: flex;
                    align-items: center;
                    font-size: .12rem;
                    color: #666;
                    margin-bottom: .02rem;
                    .label{
                        font-size: .14rem;
                        color: #333;
                    }
                }
            }
        }
    }
</style>


