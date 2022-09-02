<template>
    <div class="infoMaintain">
        <div v-if="!view_mode">
            <div class="item flex" @click="()=>this.choose_type_show=true">
                <span class="label required">选择保养类型：</span>
                <div class="result flex-1 gray" v-if="chosen_type_ids.length === 0">请选择保养类型</div>
                <div class="result flex-1" v-else>{{maintain_type_name}}</div>
            </div>

            <div class="item acc-con" v-if="chosen_type_ids.length>0">
                <div class="label">保养部位登记：</div>
                <div>
                    <Accordion v-for="item in maintain_type_chosen" :key="item.id" :title="item.name" open="1" class="acc-item">
                        <RadioBlock v-for="itemChild in item.child" :key="itemChild.id" class="radio-child" v-model="itemChild.chosen" :name="itemChild.name"/>
                    </Accordion>
                </div>
            </div>

            <div class="desc" v-if="chosen_type_ids.length>0">
                <div class="label required">备注：</div>
                <LikeTextarea v-model="desc" placeholder="请输入保养备注说明" />
            </div>

            <div>
                <div class="btn-con-height"></div>
                <div class="btn-con" >
                    <LikeButton
                            text="保存"
                            type="primary"
                            :disabled="btn_disabled"
                            :disabled_msg="disabled_msg"
                            @click="beforeSubmit"
                            class="btn"
                    />
                </div>
            </div>
        </div>

        <div v-else>
            <div class="item flex" >
                <span class="label">选择保养类型：</span>
                <div class="result flex-1">{{maintain_type_show.map(item=>item.name).join(',')}}</div>
            </div>

            <div class="item acc-con" v-if="maintain_type_show.length>0">
                <div class="label">保养部位登记：</div>
                <div>
                    <Accordion v-for="item in maintain_type_show" :key="item.id" :title="item.name" open="1" class="acc-item">
                        <RadioBlock v-for="itemChild in item.child" :key="itemChild.id" class="radio-child" :value="itemChild.chosen" :name="itemChild.name"/>
                    </Accordion>
                </div>
            </div>

            <div class="desc view">
                <div>备注：{{desc}}</div>
            </div>

            <div>
                <div class="btn-con-height"></div>
                <div class="btn-con" >
                    <LikeButton
                            text="返回"
                            type="default"
                            @click="back"
                            class="btn"
                    />
                </div>
            </div>
        </div>


        <SlideUpBox title="选择保养类型" v-if="choose_type_show" class="choose-type" ref="slideUpBox" @close="()=>{this.choose_type_show=false}">
            <div class="choose-type-box">
                <div class="choose-box">
                    <div class="item-name">保养类型</div>
                    <FilterMultiple
                            ref="choose_type"
                            :options="maintain_types"
                            :preselect="chosen_type_ids"
                            :needAll="false"
                    />
                </div>

                <div class="choose-btn-con">
                    <LikeButton
                            text="重置"
                            type="default2"
                            @click="chooseReset"
                            class="btn"
                    />
                    <LikeButton
                            text="确定"
                            type="primary2"
                            @click="chooseConfirm"
                            class="btn float-right"
                    />
                </div>
            </div>

        </SlideUpBox>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBoxV2'
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultipleV2'
  import Accordion from '../../../../../other_modules/like-manageOrder/component/Accordion'
  import RadioBlock from '../../../../../other_modules/like-manageOrder/component/RadioBlock'
  import LikeTextarea from '../../../../../other_modules/like-manageOrder/component/Textarea'

  export default {
    name: "infoMaintain",
    components:{
      Accordion,
      LikeButton,
      SlideUpBox,
      FilterMultiple,
      RadioBlock,
      LikeTextarea
    },
    data(){
      return {
        view_mode:false,

        choose_type_show:false,

        // 已经选择的保养大类id
        chosen_type_ids:[],

        maintain_type_show:[],

        desc:''
      }
    },
    computed:{
      // 所有可选的保养大类
      ...mapState('maintain',['maintain_types']),

      // 已经选择的保养大类
      maintain_type_chosen(){
        return this.chosen_type_ids.map(id=>this.maintain_types.find(item=>item.id===id))
      },

      // 已经选择的保养大类的名字
      maintain_type_name(){
        return this.maintain_type_chosen.map(item=>item.name).join('、')
      },

      // 有保养大类里的子项均没有选
      someTypeNotChosenPart(){
        return this.maintain_type_chosen.some(type=>type.child.every(child=>!child.chosen))
      },
      // 有保养大类里的子项没有选全
      someTYpeNotChosenAllPart(){
        return this.maintain_type_chosen.some(type=>type.child.some(child=>!child.chosen))
      },

      btn_disabled(){
        return this.chosen_type_ids.length === 0 || this.someTypeNotChosenPart || this.desc === ''
      },
      disabled_msg(){
        if(this.chosen_type_ids.length === 0) return '请选择保养类型'
        if(this.someTypeNotChosenPart) return '有保养类型没有选择保养部位'
        if(this.desc === '') return '请填写描述'
      }
    },
    methods:{
      chooseReset(){
        this.$refs.choose_type.reset()
      },
      chooseConfirm(){
        this.chosen_type_ids = this.$refs.choose_type.getResult()
        this.choose_type_show = false
      },

      beforeSubmit(){
        if(this.someTYpeNotChosenAllPart){
          this.$_LIKE_confirm({
            msg:'您选择的保养类型下有未勾选的部位，是否继续保存？',
            confirmButtonCallback:this.onSubmit
          })
        }else{
          this.onSubmit()
        }
      },

      onSubmit(){
        let data = {
          item_id:4,
          order_id:this.$route.query.order_id,
          params:{
            maintain_type:this.chosen_type_ids.join(','),
            maintain_part:this.maintain_type_chosen.map(item=>item.child.filter(part=>part.chosen).map(part=>part.id).join(',')).join(','),
            remark:this.desc
          }
        }

        this.$store.dispatch('maintain/submit',data).then(res=>{
          this.$_LIKE_toast('提交成功')
          this.$router.push({
            path:'/edit',
            query:{
              order_id:this.$route.query.order_id
            }
          })
        }).catch(err=>{
          if(err.msg)this.$_LIKE_toast(err.msg)
        })
      },

      back(){
        this.$router.back()
      },

    },
    created(){
      this.view_mode=Boolean(this.$route.query.view)

      if(this.view_mode){
        this.$store.dispatch('history/getItemHistory',{
          order_id:this.$route.query.order_id,
          item_id:4
        }).then(res=>{
          console.log(res)
          res.data.list.forEach(type=>{
            type.child.forEach(part=>{
              part.chosen=true
            })
          })
          this.maintain_type_show = res.data.list
          this.desc = res.data.remark
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
      }else{
        this.$store.dispatch('maintain/getMaintainTypes')
      }

    }
  }
</script>

<style lang=less>
    @import '../css/color';

    .infoMaintain{
        min-height: 100vh;

        .item{
            color:#333;
            border-top:solid 1px #f2f2f2;
            padding: 0.15rem 0.1rem;
            background-color: #fff;
            margin-top: 0.1rem;
            &:nth-of-type(1){
                margin-top: 0;
                border:none
            }
            &.flex{
                display: flex;
            }

            .flex-1{
                flex:1;
            }



            .acc-header>.title{
                font-size: 13px;
            }

            .result{
                padding-right: 0.2rem;
                font-size: 13px;
                color:#666;
                background: url('../images/icon_right66.png') no-repeat right center;
                background-size: auto 0.2rem;
                &.gray{
                    color:#999;
                }
            }

            .acc-item{
                padding: 0.05rem 0;
                border-top:solid 1px #f6f6f6;
                &:nth-of-type(1){
                    border-top:none;
                }

                .radio-child{
                    margin:0.05rem 0;
                    font-size: 13px;
                    padding-left: 0.1rem;
                }
            }

            &.acc-con{
                padding-bottom: 0;
            }

        }

        .label{
            color:#333;
            &.required::before{
                content: '*';
                color:@error;
            }
        }

        .desc{
            padding: 0.1rem 0.1rem 0.7rem;
            &.view{
                margin-top: 0.1rem;
                background-color: #fff;
            }
            .tips{
                font-size: 13px;
                color:#333;
            }
        }

        .choose-type-box{

            .choose-box{
                padding: 0 0.2rem 0.1rem;
                .item-name {
                    line-height: 1;
                    font-size: 12px;
                    color: #999;
                    padding-left: 0.06rem;
                    border-left: solid 3px @major;
                }
            }

            .choose-btn-con{
                display: flex;
                justify-content: space-between;
                bottom:0;
                width: 100%;
                box-sizing: border-box;
                background-color: #fff;
                box-shadow: 0 -2px 1px #eaeaea;
                .btn{
                    width: 50%;
                    margin:0;
                    border-radius: 0;
                }
            }
        }

        .btn-con{
            position: fixed;
            bottom:0;
            display: flex;
            justify-content: space-between;
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