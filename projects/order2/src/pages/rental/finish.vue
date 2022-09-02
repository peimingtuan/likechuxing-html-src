<template>
  <div class="MainPage">
    <div id="map" class="map"></div>
    <DetailFooter v-if="detail" :data=detail @showComment="showComment" />
    <Comment v-if="commentShow" :data=detail @closeComment="closeComment" />
    <!--<PublicMsg v-if="detail && detail.publicMsg" :data=detail />-->
    <PeccancyAlert v-if="peccancyAlertShow" :local_name=local_name />
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  import DetailFooter from '../../components/Page/detail-footer'
  import Comment from '../../components/Page/comment'
  /*import PublicMsg from '../../components/Page/public-msg'*/
  import PeccancyAlert from '../../components/Page/peccancy-alert'

  const LOCAL_NAME = 'LIKE_APP_PE'

  export default {
    name: "finish",
    components:{
      DetailFooter,
      Comment,
      //PublicMsg,
      PeccancyAlert
    },
    data() {
      return {
        local_name:LOCAL_NAME,

        // 评价弹窗
        commentShow:false,

        // 违章15天通知弹窗
        peccancyAlertShow:false
      }
    },
    computed:{
      ...mapState('rental',[
        'detail',
        'rental'
      ]),
      ...mapState('user',[
        'uuid'
      ])
    },
    methods:{
      showComment(){
        this.commentShow = true
      },
      closeComment(){
        this.commentShow = false
      },
      checkPeccancyAlert(){
        let localData = localStorage.getItem(LOCAL_NAME+'_'+this.uuid)
        if(!localData){
          localData = []
        }else{
          localData = JSON.parse(localData)
        }

        if(localData.length<3 && !localData.includes(this.rental)){
          this.peccancyAlertShow = true
          localData.push(this.rental)
          localStorage.setItem(LOCAL_NAME+'_'+this.uuid,JSON.stringify(localData))
        }
      }
    },
    mounted() {
      let href = window.location.href
      history.replaceState({},'index','/index')
      history.pushState({},'this',href)

      let loading = Loading()
      this.$store.dispatch('rental/getDetail',{
        rental_no:this.$route.query.rental_no
      }).then(()=>{
        loading.close()
        if(this.detail.comment.can_comment === 1 && this.detail.comment.has_commented === 0){
          this.commentShow = true
        }else{
          this.checkPeccancyAlert()
        }

        if(this.detail.points.length>2){
          rentalDetailMap.drawRoute(this.detail.points)
        }else{
          rentalDetailMap.drawBranch('getCar',{
            lng:this.detail.start_point_lng,
            lat:this.detail.start_point_lat
          })
        }
      })

      rentalDetailMap.initMap("map")
    },
    beforeRouteLeave(to,from,next){
      let allow = [
        '/rental/detail',
        '/index'
      ]
      if(!allow.includes(to.path)){
        // 返回目标不是首页的话，去首页
        next({
          path:'/index'
        })
      }else{
        next()
      }
    }
  }
</script>

<style lang="less" scoped>
  .MainPage {
    height: 100vh;
    text-align: left;

    .map {
      height: 100%;
    }
  }
</style>
