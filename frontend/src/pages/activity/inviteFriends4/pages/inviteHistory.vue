<template>
    <div class="InviteList">
        <div class="box">
            <div class="header">
            <span class="title">
                拉新账号
                <span v-if="totalNum>0">（{{totalNum}}人）</span>
            </span>
                <span class="title float-right">当前状态</span>
            </div>
        </div>

        <div class="list" v-if="list.length > 0">

            <PullDownRefresh
                    :opt="opt"
                    @pullUp="pullUp"
                    ref="pullUpDown"
            >

                <InviteBox v-for="item,index in list" :key="index" :data="item"/>

            </PullDownRefresh>

        </div>
        <div class="list-empty" v-else>
            {{text}}
        </div>
    </div>
</template>

<script>
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import InviteBox from '../components/inviteBox'
  import {getApiUrl} from "../js/getApiUrl";
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {mapGetters} from 'vuex'

  export default {
    name: "inviteHistory",
    components: {
      PullDownRefresh,
      InviteBox
    },
    data(){
      return {
        opt: {
          height: 300, // 容器高度
          usePullDown: false,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        list:[],
        totalNum:0,
        text:'努力加载中...',
        page:1,
        limit:10
      }
    },
    computed:{
      ...mapGetters(['publicArguments'])
    },
    methods:{
      getList(page){
        return myAjax.post(getApiUrl('/activity-invite-cash/invite-list'),{
          ...this.publicArguments,
          page,
          limit:this.limit
        }).then(res=>{
          if(res.status === 0){
            this.totalNum = res.data.totalNum
            this.list = this.list.concat(res.data.inviteeList)
            return res.data
          }else{
            throw res
          }
        })
      },
      pullUp(){
        this.page++
        this.getList(this.page).then(data=>{
          if(data.inviteeList.length < this.limit){
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
      }
    },
    created(){
      // 计算列表容器高度
      this.opt.height = window.innerHeight - window.REM * 0.75 - 1

      this.getList(this.page).then(data=>{
        if(data.inviteeList.length === 0){
          this.text = '尚未邀请到好友哦~'
        }
      }).catch(this.handleErr)
    }
  }
</script>

<style lang=less scoped>
.InviteList{
    padding: 0.3rem 0 0.15rem;
    color:#09090a;
    .box{
        padding: 0 0.3rem;
        padding-bottom: .05rem;
    }
    .header{
        font-size: 18px;
        line-height: 0.2rem;
        padding-bottom:0.1rem;
        border-bottom: solid 1px #E1E1E3;
    }

    .list-empty{
        color:#90909a;
        font-size: 12px;
        text-align: center;
        padding-top: 1.5rem;
    }
}
</style>