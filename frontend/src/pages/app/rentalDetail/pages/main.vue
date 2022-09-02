<template>
    <div class="MainPage">
        <div id="map" class="map"></div>

        <DetailFooter v-if="detail" :data=detail @showComment="showComment"/>
        <Comment v-if="commentShow" :data=detail.comment @closeComment="closeComment"/>
        <PublicMsg v-if="detail && detail.publicMsg" :data=detail />
        <ZeroKmDesc v-if="zeroKmDescShow" :text="zeroKmDescText"/>
        <CouponCash v-if="detail && couponShow" :data="detail.rental_no"/>
        <InviteFriends v-if="inviteShow"/>
    </div>
</template>

<script>
  import mapControl from '../js/mapControl.js'
  import appArguments from '../../../../../other_modules/app-arguments/index'
  import {mapState} from 'vuex'

  import DetailFooter from '../components/detail-footer'
  import Comment from '../components/comment'
  import PublicMsg from '../components/public-msg'
  import ZeroKmDesc from '../components/zeroKmDesc'
  import CouponCash from '../components/CouponCash'
  import InviteFriends from '../components/InviteFriends'

  export default {
    name: "index",
    components: {
      DetailFooter,
      Comment,
      PublicMsg,
      ZeroKmDesc,
      CouponCash,
      InviteFriends
    },
    data () {
      return {
        // 评价弹窗
        commentShow: false,

        // 分享红包
        couponShow: false,

        // 邀请好友弹窗
        inviteShow: false,

        // 0里程提示
        zeroKmDescShow: false,
        zeroKmDescText: ''
      }
    },
    computed: {
      ...mapState(['detail'])
    },
    methods: {
      dealDetail (data) {
        this.checkComment(data)

        if (data.points.length > 2) {
          mapControl.drawRoute(data.points)
        } else {
          mapControl.drawBranch('getCar', {
            lng: data.start_point_lng,
            lat: data.start_point_lat
          })
        }

        if (data['0_km_desc']) {
          this.zeroKmDescText = data['0_km_desc']
          this.zeroKmDescShow = true
        }
      },
      showComment () {
        this.commentShow = true
      },
      closeComment () {
        this.commentShow = false
        this.checkCoupon()
      },
      checkComment (data) {
        // 2018年12月17日暂时取消评价弹窗
        this.checkCoupon()
        return

        if (data.comment.can_comment === 1 && data.comment.has_commented === 0) {
          this.commentShow = true
        } else {
          this.checkCoupon()
        }
      },
      checkInvite () {
        this.inviteShow = true
      },
      checkCoupon () {
        if (this.detail.share_coupon_display) {
          this.couponShow = true
        } else {
          this.checkInvite()
        }
      }
    },
    mounted () {
      mapControl.initMap("map")

      if (appArguments.login) {
        if (this.detail) {
          this.dealDetail(this.detail)
        } else {
          this.$store.dispatch('getHistoryDetail').then(() => {
            this.dealDetail(this.detail)
          }).catch(err => {
            this.$_LIKE_toast(err.msg)
          })
        }
      } else {
        this.$_LIKE_alert({
          title: '提示',
          msg: '登录信息已过期，请重新登录'
        })
      }

    }
  }
</script>

<style lang="less">
    .MainPage {
        height: 100vh;
        position: relative;

        .map {
            height: 100%;
            z-index: 1;
        }
    }
</style>