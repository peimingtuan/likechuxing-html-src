<template>
    <div class="carRemind">
        <CarRemind :data="car_remind"/>

        <Accordion title="建议保养项目" class="acc-item">
            <div class="empty" v-if="sugges_items.length===0">暂无项目</div>
            <div class="item-list" v-else>
                <MaintainItem class="sugges-item" v-for="item in sugges_items" :key="item.part_id" :data="item"/>
                <div class="edit-btn" @click="()=>this.edit_show=true">修改</div>
            </div>
        </Accordion>

        <Accordion title="保养项目列表" class="acc-item">
            <div class="empty" v-if="other_items.length===0">暂无项目</div>
            <MaintainItem v-else class="sugges-item" v-for="item in other_items" :key="item.part_id" :data="item"/>
        </Accordion>

        <Accordion title="保养历史" class="acc-item">
            <div class="empty" v-if="order_history.length===0">暂无项目</div>
            <div class="orderHistory-list">
                <div class="item" v-for="item in order_history_h" :key="item.id">
                    <p class="major-desc"><span class="strong">第 {{item.index}} 次保养</span><span>{{item.maintain_type}}</span><span @click="toHistory(item)" class="detail">详情</span></p>
                    <p class="sub-desc">保养时间：{{item.maintain_time_h}}</p>
                    <p class="sub-desc">保养里程（里程表）：{{item.custom_km}}公里</p>
                    <p class="sub-desc">保养地点：{{item.maintain_branch}}</p>
                </div>
            </div>
        </Accordion>

        <Accordion title="操作历史" class="acc-item">
            <div class="empty" v-if="updateHistory.length===0">暂无项目</div>
            <div class="update-history" v-for="item in updateHistory" :key="item.id">
                <div class="history">{{item.time}} {{item.operate}}</div>
                <div class="history">{{item.real_name}}</div>
            </div>
        </Accordion>

        <div>
            <div class="btn-con-height"></div>

            <div class="btn-con">
                <LikeButton
                        text="新建保养工单"
                        type="primary"
                        @click="toNew"
                        class="btn"
                />
            </div>
        </div>

        <MaintainItemEdit v-if="edit_show" :data="sugges_items" @updated="onUpdated" @close="editClose"/>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import CarRemind from '../components/CarBoxRemindDetail'
    import Accordion from '../../../../../other_modules/like-manageOrder/component/Accordion'
    import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import MaintainItem from '../components/maintainItem'
    import MaintainItemEdit from '../components/maintainItemEdit'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "carRemind",
    components:{
      CarRemind,
      Accordion,
      MaintainItem,
      MaintainItemEdit,
      LikeButton
    },
    data(){
      return {
        edit_show:false
      }
    },
    computed:{
      ...mapState('remind',['car_remind','updateHistory','order_history']),
      sugges_items(){
        if(!this.car_remind.all_items)return []
        return this.car_remind.all_items.filter(item=>(item.to_next_day<=0 || item.to_next_km<=0))
      },
      other_items(){
        if(!this.car_remind.all_items)return []
        return this.car_remind.all_items.filter(item=>(item.to_next_day>0 && item.to_next_km>0))
      },
      order_history_h(){
        let l = this.order_history.length
        return this.order_history.map(item=>{
          item.index = l--;
          item.maintain_time_h = format.time(item.maintain_time)
          return item
        })
      }
    },
    methods:{
      editClose(){
        this.edit_show = false
      },
      onUpdated(){
        this.$store.dispatch('remind/getCarRemind',this.$route.query.id)
      },

      toNew(){
        this.$router.push('/new?car_id='+this.car_remind.car.id)
      },

      toHistory(item){
        this.$router.push({
          path: '/hisDetail',
          query: {
            order_id: item.id
          }
        })
      }

    },
    created(){

      this.$store.dispatch('remind/getCarRemind',this.$route.query.id).then(()=>{
        return this.$store.dispatch('remind/getOrderHistory',this.car_remind.car.id)
      }).catch(err=>{
        if(/code 500/.test(err.message)){
          this.$_LIKE_alert({
            msg:'服务器接口500错误，请联系开发'
          })
        }else if(err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          throw err
        }
      })

      this.$store.dispatch('remind/getRemindUpdateHistory',this.$route.query.id).catch(err=>{
        if(/code 500/.test(err.message)){
          this.$_LIKE_alert({
            msg:'服务器接口500错误，请联系开发'
          })
        }else if(err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          throw err
        }
      })

    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

.carRemind{
    min-height:100vh;
    .empty{
        color:#999;
        font-size: 12px;
    }

    .update-history{
        margin:0.05rem 0;
        padding: 0 0.1rem;
        .history{
            font-size: 12px;
            color:#999;
        }
    }

    .acc-item{
        padding: 0.1rem;
        margin-top: 0.1rem;
        .item-list{
            margin-left:0.1rem;
            position: relative;
            .edit-btn{
                background: #fff;
                color: @major;
                font-size: 13px;
                line-height: 0.2rem;
                padding: 0 0.1rem;
                position: absolute;
                top:-0.25rem;
                right:-0.1rem;
            }
            .sugges-item{
                border-top:solid 1px #f0f0f0;
                &:nth-child(1){
                    border:none;
                }
            }
        }
    }

    .orderHistory-list{
        .item{
            padding: 0.05rem 0.1rem;
            border-top:solid 1px #dfdfdf;
            color:#666;
            font-size: 12px;
            &:nth-of-type(1){
                border:none;
            }

            .major-desc{
                display: flex;
                justify-content: space-between;
                color:#555;
                .strong{
                    font-size: 13px;
                    color:#111;
                }
                .detail{
                    color: #42A6EA;
                }
            }
        }

    }

    .btn-con-height{
        height: 0.7rem;
    }
    .btn-con{
        position: fixed;
        display: flex;
        justify-content: space-between;
        bottom:0;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 -2px 1px #eaeaea;
        .btn{
            width: 100%;
            margin:0
        }
        .btn-full{
            width: 100%;
            margin:0;
        }
    }
}
</style>