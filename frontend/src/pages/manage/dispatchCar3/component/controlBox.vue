<template>
    <div class="ControlBox clearfix">
        <RankRange class="float-left" @setRange="setRange"/>
        <TimeOption class="float-left" @setGroup="setGroup" @setName="setName"/>
    </div>
</template>

<script>
  import RankRange from './rankRange'
  import TimeOption from './timeOption'
  import myAjax from '../../../../component/myAjax/withAxiosV2'
  import {getAdminUrl} from "../js/getAdminUrl";
  import appArgument from '../../../../../other_modules/app-arguments'
  import mapControl from '../js/mapControl'

  export default {
    name: "control-box",
    components:{
      RankRange,
      TimeOption
    },
    data(){
      return{
        start:1,
        end:20,
        group:1,
        type:0,
        show_name:false,
        getCarList:[],
        returnCarList:[]
      }
    },
    computed:{
      list(){
        switch (this.type){
          case 1:
            return this.getCarList.map((item,index)=>{
              item.type=1
              item.getIndex = index+1
              return item
            });
          case 2:
            return this.returnCarList.map((item,index)=>{
              item.type=2
              item.returnIndex = index+1
              return item
            });
          default:
            let list = [],flag = []
            this.getCarList.map((item,index)=>{
              item.type=1
              item.getIndex = index+1
              return item
            }).concat(this.returnCarList.map((item,index)=>{
              item.type=2
              item.returnIndex = index+1
              return item
            })).forEach(item=>{
              if(!flag.includes(item.branch_id)){
                list.push(item)
                flag.push(item.branch_id)
              }else{
                let index = flag.findIndex(item2=>item2===item.branch_id)
                list[index].type = 3
                list[index].returnIndex = item.returnIndex
              }
            })
            return list
        }
      }
    },
    methods:{
      setRange(data){
        this.start = data.start
        this.end = data.end
        this.getData()
      },
      setGroup(data){
        this.group = data.group
        this.type = data.type
        this.getData()
      },
      setName(data){
        this.show_name = data.show_name
        if(data.show_name){
          mapControl.showName()
        }else{
          mapControl.hideName()
        }
      },
      getData(){
        let loading = this.$_LIKE_loading()
        this.getCarList = []
        this.returnCarList = []
        let type = this.type === 0 ? [1,2] : [this.type]
        Promise.all(type.map(item=>myAjax.post(getAdminUrl('/dispatch/stats-car-num'),{
          uuid:appArgument.uuid,
          sign:appArgument.sign,
          begin:this.start,
          end:this.end,
          time:this.group,
          type:item
        }))).then(res=>{
          loading.close()
          if(res.some(item=>item.status!==0)){
            this.$_LIKE_toast('查询数据出错，请联系开发')
            return
          }

          if(this.type === 0){
            this.getCarList = res[0].data
            this.returnCarList = res[1].data
          }else if(this.type === 1){
            this.getCarList = res[0].data
          }else{
            this.returnCarList = res[0].data
          }

          if(res.every(item=>item.data.length===0)){
            this.$_LIKE_toast('查询数据为空，请检查服务器数据')
          }else{
            this.formatData()
          }
        })
      },
      formatData(){
        mapControl.drawBranch(this.list)
        mapControl.drawName(this.list,this.show_name)
      }
    },
    mounted(){
      this.getData()
    }
  }
</script>

<style lang=less scoped>
    .ControlBox{
        position: absolute;
        top:0;
        right:20px;
        background-color: #fff;
        padding: 5px 20px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 0 2px 2px #999;
    }
</style>