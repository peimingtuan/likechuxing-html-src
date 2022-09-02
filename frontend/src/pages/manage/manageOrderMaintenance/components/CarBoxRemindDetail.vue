<template>
    <CarBox :data="data.car">
        <div class="remind-box">
            <div class="item"><span class="label">已完成保养次数：</span>{{data.history_times}}</div>

            <div class="item"><span class="label">建议保养类型：</span>{{data.sugges_type}}</div>
            <div class="item"><span class="label">建议保养地点：</span><span class="icon-more" @click="showMore">{{sugges_branch}}</span></div>
        </div>

        <div ref="virtual_map" style="display:none"></div>

        <SlideUpBox title="建议保养地点" class="MoreBranch" ref="slideUpBox" v-if="show_more" @close="close">
            <div class="branches-list">
                <div class="item"
                     v-for="item in data.sugges_branches"
                     :key="item.id"
                >
                    <div>{{item.place_name}}</div>
                    <div class="nav-icon" @click="toNav(item)"></div>
                </div>
            </div>
        </SlideUpBox>
    </CarBox>
</template>

<script>
  import mapControl from '../../../../../other_modules/like-manageOrder/mapControl'
  import CarBox from '../../../../../other_modules/like-manageOrder/component/carBox'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBoxV2'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

  export default {
    name: "CarBoxRemind",
    props: ['data'],
    data(){
      return {
        show_more:false,
        center:null
      }
    },
    components: {
      CarBox,
      SlideUpBox
    },
    computed:{
      sugges_branch(){
        if(this.data.sugges_branches && this.data.sugges_branches.length>0){
          return this.data.sugges_branches[0].place_name
        }else{
          return ''
        }
      },
      is_km_over(){
        return Number(this.data.over_km)>=0
      },
      is_time_over(){
        return Number(this.data.over_time)>=0
      }
    },
    mounted(){
      mapControl.init({
        elem:this.$refs.virtual_map
      })
    },
    methods:{
      showMore(){
        this.show_more = true
        dd.getLocation().then(res=>{
          this.center=[res.lng,res.lat]
        })
      },
      close(){
        this.show_more=false
      },

      toNav(item){
        mapControl.drivingOnAmap({
          origin:this.center,
          originName:'当前位置',
          destination:[item.lng,item.lat],
          destinationName:item.name
        })
      }
    }
  }
</script>

<style lang=less>
    .remind-box {
        border: dashed 1px #e6e6e6;
        border-radius: 2px;
        padding: 0.1rem;
        font-size: 12px;
        color: #151515;
        line-height: 0.2rem;

        .label {
            color: #666;
        }

        .icon-more{
            padding-right: 0.2rem;
            background: url('../images/branch_more.png') no-repeat right;
            background-size: auto 80%;
        }
    }

    .branches-list{
        padding: 0 0.1rem;
        .item{
            padding: 0.1rem 0;
            border-top:solid 1px #dfdfdf;
            display: flex;
            justify-content: space-between;
            .nav-icon{
                width: 0.2rem;
                height: 0.2rem;
                background: url('../images/nav-icon.png') no-repeat center;
                background-size: 80%;
            }
        }
    }
</style>