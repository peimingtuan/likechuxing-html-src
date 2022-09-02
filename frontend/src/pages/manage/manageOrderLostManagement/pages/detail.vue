<template>
    <div class="Detail">
        <div v-if="dataReady">
            <div class="orderBox no-border">

                <div class="title">
                    <span>{{item.plate_no}}（</span>
                    <span class="gray">{{item.vin_front}}</span>
                    <span>{{item.vin_end}}）</span>
                    <span class="float-right status">{{item.statusDesc}}</span>
                </div>

                <div class="des ">
                    遗失物品：{{item.lost}}
                </div>

                <div class="des" v-if="item.owner_phone">
                    失主手机号：{{item.owner_phone}}
                </div>
                <div class="des" v-if="item.owner_idcard">
                    失主身份证号：{{item.owner_idcard_m}}
                </div>

                <div class="des">
                    时长：{{item.update_time_d}}
                </div>

                <div class="des" style="margin-top: 8px">
                    遗失物品明细：{{item.lost_detail}}
                </div>
                <div class="des">
                    创建时间：{{item.create_time_h}}
                </div>

                <UploadPhoto
                        title=""
                        max="0"
                        ref="photo1"
                        :p_urls="item.photo"
                />
            </div>

            <div class="getBox" v-if="item.status === 4 || item.status === 5">

                <UploadPhoto
                        title="用户证件"
                        max="0"
                        ref="photo"
                        :p_urls="item.photo_get"
                />

                <div class="des">认领备注：{{item.remark}}</div>
            </div>

            <div class="tips">
                <div class="tip" v-if="item.status === 1">注：请相关运维人员仔细检查该车辆，若发现该物品请在"车辆详情"页面点击"开门"。</div>
                <div class="tip" v-if="item.status === 3">注：运维人员未发现该物品。</div>
                <div class="tip" v-if="item.status === 5">注：该物品已于办公室领取。</div>
                <div class="tip" v-if="item.status === 6">注：由于物品不易存放，已失效。</div>
            </div>
        </div>

        <div class="status_text" v-else>
            查询物品详情中...
        </div>

        <div class="footerButton" v-if="item.status === 2">
            <LikeButton
                    text="用户线下认领"
                    type="primary"
                    @click="userGet"
                    class="btn"
            />
        </div>
        <div class="footerButton" v-if="item.status === 1">
            <LikeButton
                    text="去车辆详情"
                    type="primary"
                    @click="toCarDetail"
                    class="btn"
            />
        </div>
    </div>
</template>

<script>
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import LostOrder from '../js/class.LoatOrder'
  import UploadPhoto from '../components/upLoadPhoto'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  require('../css/orderBox.less')
  require('../css/pic.less')
  export default {
    name: "detail",
    data () {
      return {
        dataReady: false,
        item: {}
      }
    },
    components:{
      UploadPhoto,
      LikeButton
    },
    methods: {
      userGet () {
        window.lost_item = this.item
        this.$router.push('/get')
      },
      toCarDetail(){
        window.location.href = '../manageOrderCardetail/index.html?plate_no='+this.item.plate_no
      }
    },
    created () {
      myAjax.post(getOspApiUrl('/lost-record/detail'), {
        mobile: userData.state.mobile,
        order_id: this.$route.query.order_id
      }).then(res => {
        if (res.status === 0) {
          this.dataReady = true
          this.item = new LostOrder(res.data)
        } else {
          this.$_LIKE_toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    beforeRouteLeave(to,from,next){
      if(this.$route.query.source === 'new' && to.matched[0].path==='/new'){
        window.history.go(-2)
      }else{
        next()
      }
    }
  }
</script>

<style lang=less scoped>
    .Detail {
        min-height: 100vh;
        background-color: #f2f2f2;
        .orderBox {
            background-color: #fff;
            .title {
                margin: 0.06rem 0;
            }
        }
        .status_text {
            color: #999;
            padding: 1rem 0;
            text-align: center;
        }

        .des {
            margin:0;
        }
        .no-border {
            border: none;
        }
        .tips {
            padding: 0.1rem;
            font-size: 12px;
            color: #999;
        }
        .getBox {
            padding: 0.1rem;
            margin-top: 0.15rem;
            background-color: #fff;
            font-size: 12px;
            .des{
                color:#999
            }
        }
        .footerButton {
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 0.1rem;
            background-color: #fff;
            .btn {
                width: 100%;
                margin:0
            }
        }
    }
</style>