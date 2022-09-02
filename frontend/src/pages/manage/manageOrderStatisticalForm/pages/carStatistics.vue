<template>
    <div class="container">
        <div class="header">
            <div to="/carNums" class="item" :class="show?'on':''" @click="tab(1)">
                <div>实时数据</div>
                <div class="icon" @click="showCurrentDesc"></div>
            </div>
            <div to="/historyData" class="item" :class="show?'':'on'" @click="tab(2)">
                <div>历史数据</div>
                <div class="icon" @click="showHistoryDesc"></div>
            </div>
        </div>
        <div v-show="show">
            <RealtimeData :currentDesc="currentDesc" @hideCurrentDesc="hideCurrentDesc"/>
        </div>
        <div v-show="!show">
            <HistoryData/>
        </div>
        <div class="check_modal note_modal fc33" v-show="historyDesc">
			<div class="note_content">
				<div class="note_title">
					统计说明
				</div>
				<p class="note_item fc66" :key="index" v-for='(item,index) in noteData'>
					{{item}}
				</p>
			</div>
			<div class="note_close" @click="hideHistoryDesc">
				<img class="img" src="../image/close-btn.png"/>
			</div>
		</div>
    </div>
</template>
<script>
import RealtimeData from './carNums';
import HistoryData from './historyData';

export default {
   name:'CarStatistics',
   components:{
       RealtimeData,
       HistoryData,
   },
   data(){
       return{
           show:true,
           currentDesc:false,
           historyDesc:false,
           noteData:[
               "1.如果有多个城市会默认一个城市，车辆状态默认‘空闲’；",
               "2.上线率=（空闲+租赁中+下线）/（总车辆-整备-办公用车)；",
               "3.日线：可查看最近30天中任何1天或者2天从0点到24点的数量和占比走势；左边Y轴是数量，右边Y轴为占比。",
               "4.月线：可查看最近30天某1个或2个时间点的数量和占比的走势；左边Y轴是数量，右边Y轴为占比。"
           ]
       }
   },
   methods:{
       tab(v){
           if(v==1){
               this.show = true
           }else{
               this.show = false
           }
       },
       showCurrentDesc(){
           this.currentDesc = true
       },
       hideCurrentDesc(){
           this.currentDesc = false
       },
       showHistoryDesc(){
           this. historyDesc = true
       },
       hideHistoryDesc(){
           this. historyDesc = false
       }
   }
}
</script>
<style lang="less" scoped>
    .container{
        .header{
            height: .4rem;
            background: #f6f6f6;
            font-size: .14rem;
            color: #5e5e5e;
            display: flex;
            justify-content: center;
            align-items: center;
            .item{
                flex:1;
                height: .4rem;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                :first-child{
                    margin-left: .15rem;
                }
                .icon{
                    width: .3rem;
                    height: .3rem;
                    background: url('../image/icon_desc.png') no-repeat left center;
                    background-size: .15rem .15rem;
                    margin-left: .1rem;
                }
                &.on{
                    &::after{
                        content: '';
                        position: absolute;
                        left: 50%;
                        bottom: 0;
                        width: .58rem;
                        height: .02rem;
                        margin-left: -.42rem;
                        background: #333;
                    }
                }
            }
        }
        .img{
            display: block;
        }
    }
</style>


