<template>
    <div class="container">
        <div class="c-header">
            <div>网点名称：</div>
            <div class="input-wrap">
                <input v-model="bName" type="text" placeholder="请选择网点" @focus="inputFocus" @blur="inputBlur" @input="postSearchRequest">
                <div class="clear-btn" v-show="isShowClearBtn" @click="clearInput"></div>
            </div>
            <div class="select-dot" @click="goMapPage">地图选择</div>
            <div class="tip-box" v-show="isShowSearchRes || isShowSearchHistory">
                <div class="tip-list" v-show="isShowSearchRes">
                    <div class="h-title" v-show="searchResList.length">搜索结果：</div>
                    <div class="item" v-for="item in searchResList" :key="item.id" @click="selectResItem(item)">{{item.name}}</div>
                </div>
                <div class="history-list" v-show="isShowSearchHistory">
                    <div class="h-title" v-show="searchHistory.length">搜索历史：</div>
                    <div class="item" v-for="(item,index) in searchHistory" :key="item.id" @click="selectBranch(item)">
                        {{item.name}}
                        <div class="clear-btn" @click.stop="clearHistory(index)"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <Cell :label="'楼层：'+branchFloor" @press="showFloorPicker"/>
            <div class="c-header btop">
                <div>车位号：</div>
                <div class="input-wrap">
                    <input v-model="bNum" type="text" placeholder="请选择车位号">
                </div>
            </div>
        </div>
        <div v-show="info.car_status==35">
            <Cell :label="'更改车辆状态：'+carStatusName" @press="showStatusPicker"/>
        </div>
        <div class="c-body">
            <div class="title">备注：</div>
            <textarea v-model="remark" placeholder="请输入备注信息，200字以内"></textarea>
        </div>
        <FooterBtn txt="提交" :active="isPassed" @press="finish"/>
        <Picker :show="isShowFloorPicker" title="楼层"  :list="floorList" @selectValue="getFloor" @hidePicker="hideFloorPicker"/>
        <Picker :show="isShowStatusPicker" title="更改车辆状态" :list="statusSelectList" @selectValue="getStatus" @hidePicker="hideStatusPicker"/>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import WorkListItem from '../components/indexPageWorkListItem.vue'
import FooterBtn from '../components/footerBtn.vue'
import Picker from '../components/picker.vue'
import Cell from '../components/cell'

import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'workList',
    components:{
        WorkListItem,
        FooterBtn,
        Picker,
        Cell
    },
    data(){
        return{
            isShowFloorPicker:false,
            isShowStatusPicker:false,
            isShowSearchHistory:false,
            isShowSearchRes:false,
            floorDefaultList:[
                {
                    defaultIndex:0,
                    values:['5层', '4层', '3层', '2层', '地面', 'B1','B2','B3','B4','B5','B6']
                }
            ]
        }
    },
    computed:{
        floorList(){
            let list = this.floorDefaultList.slice()
            let arr = this.floorDefaultList[0].values
            let index = arr.indexOf(this.branchFloor)
            if(index!==-1){
                list[0].defaultIndex = index
            }else{
                list[0].defaultIndex = 0
            }
            return list
        },
        statusSelectList(){
            let arr = this.statusList
            let res = []
            let values = [] 
            if(arr.length){
                arr.map(item=>{
                    values.push(item.name)
                })
            }
            res[0] = {
                values
            }
            return res
        },
        carStatusName(){
            let arr = this.statusList
            let name = ''
            arr.map(item=>{
                if(item.id==this.carStatus){
                    name = item.name
                }
            })
            return name
        },
        ...mapState('workDetail',[
            "info"
        ]),
        ...mapState('finish',[
            "branchFloor",
            'carStatus',
            'statusList',
            'searchHistory',
            'searchResList',
        ]),
        bName:{
            get(){
                return this.$store.state.finish.branchName
            },
            set(v){
                this.setBranchName(v)
            }
        },
        bNum:{
            get(){
                return this.$store.state.finish.branchNum
            },
            set(v){
                this.setBranchNum(v)
            }
        },
        remark:{
            get(){
                return this.$store.state.finish.remark
            },
            set(v){
                this.setRemark(v)
            }
        },
        isShowClearBtn(){
            return this.bName.length
        },
        isPassed(){
            if(this.bName && this.bNum ){
                return true
            }else{
                return false
            }
        }
    },
    watch:{
        remark(v){
            if(v.length>150){
                let str = this.remark.substr(0,150)
                this.setRemark(str)
            }
            
        }
    },
    created(){
        this.getStatusList()
        this.setCarStatus(1)
        this.setOrderId(this.$route.query.order_id)   
    },
    methods:{
        ...mapActions('finish',[
            'getStatusList',
            'searchDot',
            'finishOrder',
        ]),
        ...mapMutations('finish',[
            'setOrderId',
            'setBranchName',
            'setSearchres',
            'setSearchHistory',
            'setBranchId',
            'setBranchFloor',
            'setBranchNum',
            'setCarStatus',
            'setRemark',
        ]),
        hideFloorPicker(){
            this.isShowFloorPicker = false
        },
        showFloorPicker(){
            this.isShowFloorPicker = true
        },
        getFloor(v){
            this.setBranchFloor(v[0])
        },
        hideStatusPicker(){
            this.isShowStatusPicker = false
        },
        showStatusPicker(){
            this.isShowStatusPicker = true
        },
        getStatus(v){
            let name = v[0]
            let index = ''
            this.statusList.map(item=>{
                if(item.name==name){
                    index = item.id
                }
            })
            this.setCarStatus(index)
        },
        finish(){
            if(this.isPassed){
                this.finishOrder(this)
            }
        },
        goMapPage(){
            this.$router.push({
                path:'dotMap',
                query:{
                    lat:40.0451932145,
                    lng:116.2999391556
                }
            })
        },
        inputFocus(){
            if(this.bName==''){
                this.isShowSearchRes = false
                if(this.searchHistory.length){
                    this.isShowSearchHistory = true
                }else{
                    this.isShowSearchHistory = false
                } 
            }else{
                this.isShowSearchRes = true
                this.isShowSearchHistory = false  
            }
        },
        inputBlur(){
            this.isShowSearchHistory = false
            this.isShowSearchRes = false
            this.setSearchres([])
        },
        postSearchRequest(){
            this.inputFocus()
            let { bName } = this
            if(bName===''){
                return
            }
            const _this = this;
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                _this.searchDot(bName)
            },200)
        },
        clearInput(){
            this.setBranchName('');
            this.setSearchres([])
            this.isShowSearchHistory = false
            this.isShowSearchRes = false
        },
        selectBranch(item){
            this.setBranchId(item.id)
            this.setBranchName(item.name)
            this.isShowSearchHistory = false
            this.isShowSearchRes = false
        },
        clearHistory(index){
            let arr = this.searchHistory.slice()
            arr.splice(index,1)
            this.setSearchHistory(arr)
            localStorage.setItem('searchHistory',JSON.stringify(arr))
        },
        selectResItem(resItem){
				//处理搜索历史
				let histroyList = localStorage.getItem('searchHistory')
				if(histroyList){
					let arr = JSON.parse(histroyList)
					arr.map((item,index)=>{
						if(resItem.id == item.id){
							arr.splice(index,1)
						}
					})
					arr.push(resItem)
					this.setSearchHistory(arr)
					localStorage.setItem('searchHistory',JSON.stringify(arr))
				}else{
					let arr = []
					arr.push(resItem)
					this.setSearchHistory(arr)
					localStorage.setItem('searchHistory',JSON.stringify(arr))
				}
				this.selectBranch(resItem)

			},
    },
    destoryed(){
        this.timer && clearTimeout(this.timer)
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        .row{
            margin-bottom: .1rem;
        }
        .c-header{
            height: .54rem;
            .fd();
            .fco(.14rem,#333);
            background: #fff;
            margin-bottom: .1rem;
            padding:0 .1rem;
            position: relative;
            .input-wrap{
                flex:1;
                position: relative;
                input{
                    width:100%;
                    height: .4rem;
                    .fco(.14rem,#333);
                }
                .clear-btn{
                    position: absolute;
                    top:0;
                    right: 0;
                    width:.32rem;
                    height: 100%;
                    background: url('../images/icon_close.png') no-repeat center;
                    background-size: .32rem .32rem;
                }
            }
            .select-dot{
                width: .7rem;
                padding-left: .1rem;
                height: .24rem;
                border-left: 1px solid #F6F6F6;
                color: #44A8EC;
            }
            .tip-box{
                position: absolute;
                top: .54rem;
                left:0;
                width: 100%;
                background: #fff;
                z-index: 20;
                box-shadow: 2px 2px 3px 0 rgba(0,0,0,0.08);
                border-top:1px solid #f6f6f6;
                padding:0 .1rem;
                .h-title{
                    height: .40rem;
                    line-height: .40rem;
                    .fco(.13rem,#5e5e5e);
                    border-bottom:1px solid #f6f6f6;
                }
                .item{
                    height: .40rem;
                    line-height: .40rem;
                    .fco(.13rem,#5e5e5e);
                    border-bottom:1px solid #f6f6f6;
                    position: relative;
                    .clear-btn{
                        position: absolute;
                        top:0;
                        right: 0;
                        width:.32rem;
                        height: 100%;
                        background: url('../images/icon_close.png') no-repeat center;
                        background-size: .32rem .32rem;
                    }
                }
            }
        }
        .btop{
            border-top: 1px solid rgb(238, 237, 237);
        }
        .c-body{
            padding: .17rem .1rem;
            background:#fff;
            border-top: 1px solid rgb(238, 237, 237);
            .title{
               .fco(.14rem,#333); 
                margin-bottom: .1rem;
            }
            textarea{
                width:100%;
                height: .88rem;
                border: 1px solid #C1C1C1;
                border-radius:2px;
                background: #F6F6F6;
                padding:.1rem;
                font-size: .12rem;
            }
        }
    }
</style>


