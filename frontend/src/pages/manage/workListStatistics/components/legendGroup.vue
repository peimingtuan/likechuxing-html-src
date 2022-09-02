<template>
    <div class="legend-wrap">
        <div class="item" v-for="(item,index) in list" :key="index" @click="handleItem(index)">
            <span class="icon"  :class="['icon'+(index+1)%5,item.checked?'on':'']"></span>
            <span>{{item.name}}</span>
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
    },
    filters:{
        bindClass(index){
            let classStr = '';
            switch((index+1)%5){
                case 1:
                    classStr = 'icon1';
                    break;
                case 2:
                    classStr = 'icon2';
                    break;
                case 3:
                    classStr = 'icon3';
                    break;
                case 4:
                    classStr = 'icon4';
                    break;
                case 0:
                    classStr = 'icon5';
                    break;
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
    @import '../css/common.less';
    .legend-wrap{
        .fc();
        flex-wrap: wrap;
        .item{
            padding:0 .05rem;
            .fc();
            .icon{
                .wh(.12rem,.12rem);
                margin-right: .07rem;
                background: url('../images/legendItem.png') no-repeat;
                background-size: 100% 100%;
            }
            .icon1{  
                &.on{
                    background: url('../images/legendItem1on.png') no-repeat;
                    background-size: 100% 100%; 
                }
            }
            .icon2{  
                &.on{
                    background: url('../images/legendItem2on.png') no-repeat;
                    background-size: 100% 100%; 
                }
            }
            .icon3{  
                &.on{
                    background: url('../images/legendItem3on.png') no-repeat;
                    background-size: 100% 100%; 
                }
            }
            .icon4{  
                &.on{
                    background: url('../images/legendItem4on.png') no-repeat;
                    background-size: 100% 100%; 
                }
            }
            .icon0{  
                &.on{
                    background: url('../images/legendItem5on.png') no-repeat;
                    background-size: 100% 100%; 
                }
            }
        }
    }
</style>


