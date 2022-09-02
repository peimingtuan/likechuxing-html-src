<template>
    <div class="maintainItemEdit">
        <SlideUpBox title="请选择需要修改的保养项目" ref="slideUpBox" needTouchmove="1" @close="()=>this.$emit('close')">
            <div class="content">
                <div class="items">
                    <div class="item" v-for="item in list" :key="item.part_id"
                         :class="{active:item.part_id === current_part_id}"
                         @click="changeCurrent(item)"
                    >{{item.part_name}}
                    </div>
                </div>

                <div class="edit">
                    距离下次保养剩余
                    <input class="input" v-model="current_km"/>
                    公里，剩余
                    <input class="input" v-model="current_day"/>
                    天
                </div>

                <div class="tips">
                    *表单支持填写负数：例如“已超100公里”修改为“-100”，则意为剩余100公里；“剩余10天”修改为“-10”，则意为已超10天。
                </div>
            </div>

            <LikeButton
                    type="primary2"
                    text="确定"
                    class="btn"
                    @click="onSubmit"
            />
        </SlideUpBox>
    </div>
</template>

<script>
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBoxV2'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import { Indicator } from 'mint-ui';
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "maintainItemEdit",
    components: {
      SlideUpBox,
      LikeButton
    },
    props: ['data'],
    data () {
      return {
        list:[],
        current_part_id: this.data[0].part_id,
        changed_ids:[]
      }
    },
    computed:{
      current_part(){
        return this.list.find(item=>item.part_id===this.current_part_id)
      },
      current_km:{
        get(){
          return this.current_part.to_next_km
        },
        set(value){
          if(!this.changed_ids.includes(this.current_part_id))this.changed_ids.push(this.current_part_id)
          this.current_part.to_next_km = value
        }
      },
      current_day:{
        get(){
          return this.current_part.to_next_day
        },
        set(value){
          if(!this.changed_ids.includes(this.current_part_id))this.changed_ids.push(this.current_part_id)
          this.current_part.to_next_day = value
        }
      },
      changed_list(){
        return this.changed_ids.map(id=>this.list.find(item=>item.part_id===id))
      }
    },
    methods: {
      changeCurrent(item){
        this.current_part_id = item.part_id
      },
      onSubmit(){
        Indicator.open();
        Promise.all(this.changed_list.map(item=>{
          return myAjax.post(getOspApiUrl('/vehicle-maintain/update-warning-item'),{
            mobile:userData.state.mobile,
            id:item.part_id,
            over_km:-item.to_next_km,
            over_day:-item.to_next_day
          })
        })).then(()=>{
          Indicator.close()
          this.$emit('updated')
          this.$emit('close')
        }).catch(errs=>{
          console.log(errs)
          Indicator.close()
          this.$_LIKE_alert({
            msg:'修改时出错，请重试'
          })
        })
      }
    },
    created () {
      this.list = this.data.map(item=>{
        return {
          part_id:item.part_id,
          part_name:item.part_name,
          part_no:item.part_no,
          to_next_day:item.to_next_day,
          to_next_km:item.to_next_km
        }
      })
      console.log(this.data)
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

    .maintainItemEdit {
        .content {
            padding: 0 0.15rem;

            .items {
                display: flex;
                width: 100%;
                overflow-x: auto;
                font-size: 12px;
                color: #666;
                padding: 0.05rem 0;
                -webkit-overflow-scrolling:touch;

                &::-webkit-scrollbar {
                    display: none;
                }

                .item {
                    flex: none;
                    padding: 0.05rem 0;
                    margin-right: 0.2rem;
                    border-bottom:solid 1px transparent;

                    &.active {
                        color: @major;
                        border-color:@major;
                    }
                }

            }

            .edit{
                margin:0.15rem 0;
                line-height: 0.24rem;
                font-size: 12px;
                color:#666;
                .input{
                    border:solid 1px @major;
                    background-color: @majorOpac;
                    color:@major;
                    height: 0.24rem;
                    width: 0.7rem;
                    text-align: center;
                }
            }

            .tips{
                margin:0.2rem 0;
                font-size: 12px;
                color: #999999;
                line-height: 1.2
            }
        }

        .btn {
            width: 100%;
            margin-bottom: 0;
            border-radius: 0;
        }
    }
</style>