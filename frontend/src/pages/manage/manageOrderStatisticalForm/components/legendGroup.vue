<template>
    <div class="legend-group-wrap">
        <div class="legend-body" :class="list.length<3?'min':''">
            <div class="item" v-for="(item,index) in list" :key="index"  @click="handleItem(index)">
                <div class="legend-icon"  :class="item.checked?'icon'+(index+1):''" :a="item.checked"></div>
                <div class="legend-label">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'legendGroup',
    props:['list'],
    methods:{
        handleItem(index){
            this.$emit('changeLegend',index)
        }
    }
}
</script>
<style lang="less" scoped>
    .legend-group-wrap{
            width:4.2rem;
            height:.6rem;
            position: fixed;
            left: 0;
            top:50%;
            margin-top: -.3rem;
            transform: rotate(90deg) translateY(1.8rem);
        
        .legend-body{
            height: 100%;
            width: 100%;
            display: flex;
            flex-wrap: wrap; 
            align-items:center;
            background: #fff;
            &.min{
                justify-content: center;
            }
            .item{
                width:25%;
                height: .24rem;
                display: flex;
                align-items: center;
                font-size: .13rem;
                .legend-icon{
                    margin-right: .1rem;
                    width:.14rem;
                    height: .14rem;
                    background: url('./../image/legend0.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon1{
                    background: url('./../image/legend1.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon2{
                    background: url('./../image/legend2.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon3{
                    background: url('./../image/legend3.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon4{
                    background: url('./../image/legend4.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon5{
                    background: url('./../image/legend5.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon6{
                    background: url('./../image/legend6.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon7{
                    background: url('./../image/legend7.png') no-repeat;
                    background-size: 100% 100%;
                }
                .icon8{
                    background: url('./../image/legend8.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
        
</style>


