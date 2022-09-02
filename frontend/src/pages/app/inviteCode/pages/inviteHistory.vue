<template>
    <div class="box" v-if="dataReady">
        <div class="header">
            <div><div class="money">{{Number(inviteData.road_cnt)*30}}<span>元</span></div> 红包在路上</div>
            <div><div class="money">{{inviteData.total_coupon_cash}}<span>元</span></div>累计获得</div>
            <div><div class="money">{{inviteData.success_cnt}}<span>人</span></div>成功邀请</div>
        </div>
        <div class="bg"></div>
        <div class="listBox">
          <div class="listTitle">
            <span>手机号</span>
            <span>邀请时间</span>
            <span>获得红包</span>
          </div>
          <div class="list" v-if="list.length > 0">
              <PullDownRefresh
                :opt="opt"
                @pullUp="pullUp"
                ref="pullUpDown"
              >
                <div class="item" v-for="item,index in list">
                  <span>{{telTool(item.phone_no)}}</span>
                  <span>{{item.invite_time}}</span>
                  <span>{{item.desc}}</span>
                </div>
              </PullDownRefresh>
          </div>
          <div class="list-empty" v-else>
            {{text}}
          </div>
        </div>
        
    </div>
</template>

<script>
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {getApiUrl} from "../../../../../other_modules/url-constructor";
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import appArguments from '../../../../../other_modules/app-arguments'

  export default {
    name: "inviteHistory",
    components: {
      PullDownRefresh,
    },
    data(){
      return {
        opt: {
          height: 300, // 容器高度
          usePullDown: false,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        list:[],
        // totalNum:0,
        text:'努力加载中...',
        begin:0,
        inviteData:{
          road_cnt:0,
          total_coupon_cash:0,
          success_cnt:0
        },
        listReady:false,
        inviteReady:false,
        loading:''
      }
    },
    methods:{
      getList(begin){
        return myAjax.post(getApiUrl('/reward/invite-list'),{
          uuid:appArguments.uuid,
          sign:appArguments.sign,
          begin
        }).then(res=>{
          if(res.status === 0){
            // this.totalNum = res.data.totalNum
            this.list = this.list.concat(res.data)
            this.begin = this.list.length
            this.listReady = true
            return res.data
          }else{
            this.listReady = true
            throw res
          }
        })
      },
      pullUp(){
        this.getList(this.begin).then(data=>{
          if(data.length === 0){
            this.$refs.pullUpDown.update({noMore:true})
          }else{
            this.$nextTick(()=>{
              this.$refs.pullUpDown.update()
            })
          }
        }).catch(this.handleErr)
      },
      handleErr(err){
        console.log(err)
        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }
      },
      telTool(phone){
        let tel = phone.split('')
        tel.splice(3,4,' **** ')
        return tel.join("")
      }
    },
    created(){
      // 计算列表容器高度
      this.loading = this.$_LIKE_loading()
      this.opt.height = window.innerHeight - window.REM * 1.36      
      this.getList(this.begin).then(data=>{
        if(data.length === 0){
          this.text = '尚未邀请到好友哦~'
          this.listReady = true
        }        
      }).catch(this.handleErr)
      myAjax.post(getApiUrl('/reward/info'),{
        uuid:appArguments.uuid,
        sign:appArguments.sign,
      }).then(res=>{
          if(res.status === 0){
            this.inviteData = res.data
            this.inviteReady = true
            
          }else{
            this.inviteReady = true
            throw res
          }
        })
        this.telTool('16601327811')
    },
    computed: {
      dataReady(){
        if(this.listReady && this.inviteReady){
          this.loading.close();
          return true
        }else{
          return false
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      next()
      this.loading.close();
    }
  }
</script>

<style lang=less scoped>
.box{
  .header{
    padding: .2rem .2rem;
    display: flex;
    justify-content: center;
    div{
      text-align: center;
      flex: 1;
      font-size: 12px;
      color: #777;
      .money{
        font-size: 30px;
        padding-bottom: .03rem;
        color: #111;
        span{
          font-size: 14px;
          padding-left: .03rem;
        }
      }
    }
  }
  .bg{
    height: .1rem;
    width: 100%;
    background: #F2F2F2;
  }
  .listBox{
    padding: .2rem 0 0 .3rem;
    .listTitle{
      display: flex;
      /* padding-bottom: .2rem; */
      span{
        flex: 1;
        color: #999;
        font-size: 13px;
      }
    }
    .list-empty{
        color:#90909a;
        font-size: 12px;
        text-align: center;
        padding-top: 1.5rem;
        margin-left: -.3rem;
    }
    .item{
      padding-top: .2rem;
      display: flex;
      color: #111;
      font-size: 13px;
      span{
        flex: 1;
      }
    }
  }
}
</style>