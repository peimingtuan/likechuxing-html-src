<template>
    <div class="wrap">
        <div class="fliter-box">
            <div class="item">
                <div class="cell" >
                    <div class="col">
                        <div class="cell-label">开始：</div>
                        <div class="cell-item" @click="openStartPicker">
                            <span>{{startFormatDate}}</span>
                            <span class="icon"></span>
                        </div>
                    </div>
                    <div class="col">
                        <div class="cell-label">结束：</div>
                        <div class="cell-item" @click="openEndPicker">
                            <span>{{endFormatDate}}</span>
                            <span class="icon"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="cell">
                    <div class="col">
                    <div class="cell-label">城市：</div>
                    <div class="cell-item" @click="openCityPicker">
                        <span>{{city}}</span>
                        <span class="icon"></span>
                    </div>
                    </div>
                    <div class="col" v-show="type!='userChart'"></div>
                    <div class="col" v-show="type=='userChart'">
                        <div class="cell-label" v-show="type=='userChart'">渠道：</div>
                        <div class="cell-item" @click="openChannelPicker" >
                            <span>{{channel}}</span>
                            <span class="icon"></span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        <mt-datetime-picker
            ref="startPicker"
            type="date"
            :endDate="new Date()"
            @confirm="getStartRes"
            v-model="startDateVal">
        </mt-datetime-picker>
        <mt-datetime-picker
            ref="endPicker"
            type="date"
            @confirm="getEndRes"
            :endDate="new Date()"
            v-model="endDateVal">
        </mt-datetime-picker>
        <Picker :list="cityList" :show="showCityPicker" @hidePicker="hideCityPicker" @selectValue="selectCity"/>
        <Picker :list="channelList" :show="showChannelPicker" @hidePicker="hideChannelPicker" @selectValue="selectChannel"/>
    </div>
</template>
<script>
import tool from '../js/tools'
import Picker from './picker'
export default {
    name:"selectBox",
    components:{
        Picker
    },
    props:{
        type:String,
        cityList:Array,
        channelList:Array
    },
    data(){
        return{
            startDateVal:tool.toSetDay(-7),
            endDateVal:tool.toSetDay(-1),
            selectStartDate:tool.toSetDay(-7),
            selectEndDate:tool.toSetDay(-1),
            city:'全部',
            showCityPicker:false,
            showChannelPicker:false,
            channel:'全部'
        }
    },
    computed:{
        startFormatDate(){
            return tool.toDate(this.selectStartDate)
        },
        endFormatDate(){
            return tool.toDate(this.selectEndDate)
        }
    },
    methods:{
        openStartPicker(){
            this.$refs.startPicker.open();
        },
        getStartRes(){
            let { endDateVal,startDateVal} = this;
            if(tool.compareTime(startDateVal,endDateVal)){
                this.$toast('开始时间不能晚于结束时间');
                return;
            }
            this.selectStartDate = this.startDateVal;
            this.screenData()
        },
        openEndPicker(){
            this.$refs.endPicker.open();
        },
        getEndRes(){
            let { endDateVal,startDateVal} = this;
            if(tool.compareTime(startDateVal,endDateVal)){
                this.$toast('开始时间不能晚于结束时间');
                return;
            }
            this.selectEndDate = this.endDateVal;
            this.screenData()
        },
        openCityPicker(){
            this.showCityPicker = true
        },
        hideCityPicker(){
            this.showCityPicker = false
        },
        selectCity(val){
            this.city = val[0]
            this.screenData()
        },
        openChannelPicker(){
            this.showChannelPicker = true
        },
        hideChannelPicker(){
            this.showChannelPicker = false
        },
        selectChannel(val){
            this.channel = val[0]
            this.screenData()
        },
        screenData(){
            let { selectStartDate, selectEndDate, city } = this;
            let data = {
                startDate:tool.toDate(selectStartDate),
                endDate:tool.toDate(selectEndDate),
                cityName:city
            }
            if(this.channel&&this.type=='userChart'){
                data.channelName = this.channel
            }
            this.$emit('upDateData',data)
        },
        resetData(){
            this.selectStartDate = tool.toSetDay(-7);
            this.selectEndDate = tool.toSetDay(-1);
            this.city = '全部'
            let data = {
                startDate:'',
                endDate:'',
                cityName:''
            }
            this.$emit('upDateData',data)
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        background: #fff;
        .fliter-box{
            background: #fff;
            .item{
                display: flex; 
                .cell{
                    flex:1;
                    display: flex;
                    padding: 0 15px;
                    height: 40px;
                    line-height: 40px;
                    .col{
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        .cell-label{
                            font-size: 14px;
                            color: #999;
                        }
                        .cell-item{
                            width:110px;
                            font-size: 14px;
                            color: #333;
                            .icon{
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                background: url('../images/arrow.png') no-repeat;
                                background-size: 100% 100%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

