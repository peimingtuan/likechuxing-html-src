<template>
    <div class="balanceHistory">
        <div class="total-box clearfix">
            <div class="box">
                <div class="money">{{total_money_f}}</div>
                <div class="desc">累计金额</div>
            </div>
            <div class="box">
                <div class="money danger">{{total_cash_f}}</div>
                <div class="desc">累计提现</div>
            </div>
        </div>

        <div class="list-box" >
            <div class="box">
                <div class="header">
                    <span class="title">变化类型</span>
                    <span class="title float-right">变化金额</span>
                </div>
            </div>

            <div class="list" v-if="list.length>0">

                <PullDownRefresh
                        :opt="opt"
                        @pullUp="pullUp"
                        ref="pullUpDown"
                >

                    <BalanceBox v-for="item,index in list" :key="index" :data="item"/>

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
  import BalanceBox from '../components/balanceBox'
  import {getApiUrl} from "../js/getApiUrl";
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {mapGetters} from 'vuex'
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "balanceHistory",
    components: {
      PullDownRefresh,
      BalanceBox
    },
    data () {
      return {
        opt: {
          height: 300, // 容器高度
          usePullDown: false,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        total_money: 0,
        total_cash:0,
        list:[],
        text:'努力加载中...',
        page:1,
        limit:10
      }
    },
    computed:{
      ...mapGetters(['publicArguments']),
      total_money_f(){
        return format.money(this.total_money)
      },
      total_cash_f(){
        return format.money(this.total_cash)
      }
    },
    methods:{
      getList(page){
        return myAjax.post(getApiUrl('/activity-invite-cash/reward-list'),{
          ...this.publicArguments,
          page,
          limit:this.limit
        }).then(res=>{
          if(res.status === 0){
            this.total_money = res.data.total_money
            this.total_cash = res.data.total_cash
            this.list = this.list.concat(res.data.cash_history)
            return res.data
          }else{
            throw res
          }
        })
      },
      pullUp(){
        this.page++
        this.getList(this.page).then(data=>{
          if(data.cash_history.length < this.limit){
            this.$refs.pullUpDown.update({noMore:true})
          }else{
            this.$refs.pullUpDown.update()
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
      this.opt.height = window.innerHeight - window.REM * 1.63 - 1

      this.getList(this.page).then(data=>{
        if(data.cash_history.length === 0){
          this.text = '尚未获得赏金哦~'
        }
      }).catch(this.handleErr)
    }
  }
</script>

<style lang=less scoped>
    .balanceHistory {
        color: #09090A;

        .total-box {
            background-color: #F7F6F6;
            padding: 0.2rem 0 .16rem 0;

            .box {
                width: 50%;
                float: left;
                text-align: center;
                .money {
                    line-height: 0.3rem;
                    font-size: 24px;
                    font-weight: 300;
                }
                .desc {
                    line-height: 0.2rem;
                    margin-top: 0.03rem;
                    color: #908F8F;
                    font-size: 13px;
                }
            }
        }

        .list-box {
            padding: 0.05rem 0 0.2rem 0;
            .box{
                padding: 0 0.3rem;
                padding-bottom: .05rem;
            }
            .header {
                font-size: 18px;
                line-height: 0.2rem;
                padding: 0.1rem 0;
                border-bottom: solid 1px #E1E1E3;
            }

            .list-empty{
                color:#90909a;
                font-size: 12px;
                text-align: center;
                padding-top: 1.5rem;
            }
        }
    }
</style>