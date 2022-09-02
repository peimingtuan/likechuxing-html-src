<template>
    <div class="reserveIn">
      <div class="header">
        <div class="header-container">
          <div class="title">您已预订了早通勤车</div>
          <div class="desc">
            <div class="label">用车时间</div>
            <div class="time">{{bookInfo.use_time}}</div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="info-container">
          <div class="l-picker-item">
            <div class="address-group">
              <div class="label">取车网点</div>
              <div class="name">{{bookInfo.branch_name}}</div>
              <div class="addr">{{bookInfo.address}}</div>
              <div class="addr-desc">{{bookInfo.walk_addr}}</div>
            </div>
            <div class="navigation">
              <div class="nav-container">
                <div class="item" @click="toOverall">
                  <div class="icon"></div>
                  <div class="label">全景</div>
                </div>
                <div class="item" @click="callNavApp">
                  <div class="icon"></div>
                  <div class="label">导航</div>
                </div>
              </div>
            </div>
          </div>
          <div class="l-picker-item return-item">
            <div class="address-group">
              <div class="label">还车网点</div>
              <div class="name">{{bookInfo.end_branch_name}}</div>
              <div class="addr">{{bookInfo.end_address}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="tip-box" v-if="!isArrived">
          <div class="tip">车辆将按时送达您的取车点...</div>
          <a href="tel:400-666-2333" class="desc">客服热线:400-666-2333</a>
        </div>
        <div class="select-list" v-if="isArrived">
          <div class="label">选择车辆</div>
          <div class="list">
            <div class="item" v-for="item in bookInfo.car_list" :key="item.id" @click="selectCar(item)">
              <div class="checkbox-wrap">
                <div class="radio" :class="item.id==car_current_id?'on':''"></div>
              </div>
              <div class="car-wrap">
                <img :src="item.car_pic"/>
              </div>
              <div class="car-info">
                <div class="name-wrap">
                  <div class="name">{{item.plate_no}}</div>
                  <div class="csn">（车位号：{{item.current_parking_no}}）</div>
                </div>
                <div class="desc-group">
                  <div class="desc-item first">{{item.model_name}}</div>
                  <div class="desc-item">{{item.color}}</div>
                  <div class="desc-item">{{item.seat_cnt}} 座</div>
                  <div class="desc-item last">{{item.remain_km}} 公里续航</div>
                </div>
                <div class="desc-km">
                  <span class="num">{{item.price_km}}</span>
                  元/公里 +
                  <span class="num">{{item.price_min}}</span>
                  元/分钟
                </div>
              </div>
            </div>
          </div>
          <div class="use-btn">
            <div class="btn" :class="car_current_id!=''?'on':''" @click="_useCar">立刻用车</div>
          </div>
        </div>
        <div class="btn-container">
            <div class="l-btn" @click="cancelBook">取消预订</div>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Confirm,Toast, Alert} from '../../../../../other_modules/vue-plugins/like-base/'
  import {appMutual} from '../../../../../other_modules/app-mutual/'
  export default {
    computed:{
      ...mapState([
        'bookInfo',
        'car_current_id',
        'isArrived',
        'branch_start',
        'branch_end',
        'carInfo'
      ]),
    },
    methods: {
      selectCar(info){
        this.$store.commit('setCurrentCar',info)
      },
      callNavApp(){
        appMutual.send.callNavigation({
          lng_start:this.bookInfo.lat,
          lat_start:this.bookInfo.lng,
          lng_des:this.bookInfo.walk_lng,
          lat_des:this.bookInfo.walk_lat,
          policy:1
        })
      },
      toOverall() {
        appMutual.send.url({
          url:this.bookInfo.walk_overall_view,
          destroy_current:0,
          request_type:0,
          need_param:0
        })
      },
      cancelBook(){
        const self = this;
        Confirm({
          msg:'取消预订吗？',
          icon:'warn',
          confirmButtonCallback:()=>{
            self.$store.dispatch('cancelBook')
            .then(res=>{
              Toast({
                msg:res.msg,
                toastCallback:()=>{
                  appMutual.send.indexRefresh({
                    destroy_current:1
                  })
                }
              })
              
            })
            .catch(err=>{
              
            })
          }
        })
      },
      _useCar(){
        let _this = this;
        if(this.bookInfo.end_branch_status!=1){
          Confirm({
            msg:'抱歉，您选择的还车网点已下线。如需正常使用，可将车还在限行区内其他网点',
            icon:'warn',
            cancelButtonText:'我再想想',
            confirmButtonText:'继续用车',
            confirmButtonCallback:()=>{
              _this.order()
            }
          })
        }else{
          this.order()
        }
      },
      order(){
        if(this.car_current_id){
          this.$store.dispatch('order',{
            begin_branch_id:this.bookInfo.begin_branch_id,
            end_branch_id:this.bookInfo.end_branch_id,
            price_km:this.carInfo.price_km,
            price_min:this.carInfo.price_min,
            price_extra:this.carInfo.price_extra,
            car_id:this.car_current_id
          })
          .then(res=>{
            if(res.status==0){
              Toast({
                msg:res.msg,
                toastCallback:()=>{
                  appMutual.send.indexRefresh({
                    destroy_current:1
                  })
                }
              })
            }
          })
          .catch(err=>{
            if(err.msg){
              Toast(err.msg)
            }
          })
        }
      },
      countDown(){
        const _this = this;
        this.timer&&clearInterval(this.timer);
        this.timer = setInterval(()=>{
          _this.$store.dispatch('getBookInfo')
        },30000)
      },
    },
    created(){
      this.$store.dispatch('getBookInfo');
      const _this = this;
      setTimeout(()=>{
        _this.countDown()
      },30000)
    },
    beforeDestory(){
      this.timer&&clearInterval(this.timer);
    }
  }
</script>

<style lang=less scoped>
  .reserveIn{
    div{
      box-sizing: border-box;
    }
  }
  .header{
    height: 1.1rem;
    padding: 0 .15rem;
    .header-container{
      height: 100%;
      padding-top: .19rem;
      position: relative;
      &::after{
        content: '';
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        background: #DFDFDF;
        position: absolute;
        left: 0;
        bottom:0;
      }
      .title{
        font-family: PingFangSC-Medium;
        font-size: 17px;
        color: #111111;
        letter-spacing: 0;
        line-height: .17rem;
        margin-bottom: .2rem;
      }
      .label{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #AAAAAA;
        letter-spacing: 0;
        line-height: .12rem;
        margin-bottom: .12rem;
      }
      .time{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #111111;
        line-height: .14rem;
      }
    }
  }
  .info{
    padding: 0 .15rem;
    .info-container{
      height: 100%;
      padding: .155rem 0 .075rem;
      position: relative;
      &::after{
        content: '';
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        background: #DFDFDF;
        position: absolute;
        left: 0;
        bottom:0;
      }
      .l-picker-item{
        display:flex;
        .address-group{
          flex:1;
          height: 100%;
          .label{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #AAAAAA;
            letter-spacing: 0;
            line-height: .12rem;
            margin-bottom: .12rem;
          }
          .name{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #111111;
            line-height: .14rem;
            margin-bottom: .08rem;
          }
          .addr,.addr-desc{
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #999999;
            letter-spacing: 0;
            line-height: .13rem;
            margin-bottom: .08rem;
          }
        }
        .navigation{
          width:.905rem;
          height: 100%;
          padding-top: .24rem;
          .nav-container{
            display: flex;
            height: .36rem;
            position: relative;
            &::before{
              content: '';
              height: 100%;
              width: 1px;
              transform: scaleX(0.5);
              background: #DFDFDF;
              position: absolute;
              left: 0;
              bottom:0;
            }
            .item{
              flex:1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              .label{
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #B0B2B5;
                letter-spacing: 0;
                text-align: center;
                line-height: .12rem;
              }
              &:first-child{
                .icon{
                  width: .14rem;
                  height: .14rem;
                  background: url('../images/全景copy@3x.png') no-repeat;
                  background-size:100% 100%;
                }
              }
              &:last-child{
                .icon{
                  width: .14rem;
                  height: .14rem;
                  background: url('../images/导航copy@3x.png') no-repeat;
                  background-size:100% 100%;
                }
              }
            }
          }
        }
      }
      .return-item{
        margin-top: .12rem;
      }
    }
  }
  .footer{
    padding-bottom: .8rem;
    .tip-box{
      .tip{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #E90000;
        text-align: center;
        line-height: .16rem;
        margin-top:.7rem;
        margin-bottom: .4rem;
      }
    }
    .select-list{
      padding: .145rem .15rem;
      .label{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #AAAAAA;
        letter-spacing: 0;
        line-height: .12rem;
      }
      .list{
        .item{
          height: .865rem;
          position: relative;
          display: flex;
          align-items: center;
          &::after{
            content: '';
            width: 100%;
            height: 1px;
            transform: scaleY(0.5);
            background: #DFDFDF;
            position: absolute;
            left: 0;
            bottom:0;
          }
          .checkbox-wrap{
            width: .3rem;
          }
          .car-wrap{
            width: .7rem;
            img{
              width:90%;
              max-height: .68rem;
            }
          }
          .car-info{
            flex:1;
            .name-wrap{
              display: flex;
              align-items: center;
              .name{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #111111;
                letter-spacing: 0;
                line-height: .14rem;
              }
              .csn{
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #111111;
                letter-spacing: 0;
                line-height: .12rem;
              }
            }
            .desc-group{
              display: flex;
              align-items: center;
              margin-top: .06rem;
              margin-bottom: .12rem;
              .desc-item{
                height: .12rem;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #888888;
                line-height: .12rem;
                padding-right: .08rem;
                margin-right: .08rem;
                position: relative;
                &::after{
                  content:'';
                  width:1px;
                  height: 100%;
                  position: absolute;
                  right: 0;
                  top: 0;
                  transform: scaleX(.5);
                  background:#3A3A3A;
                }
                &.first{
                  &::after{
                    content:'';
                    width:1px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: scaleX(.5);
                    background:#888;
                  }
                }
                &.last{
                  padding-right: 0;
                  margin-right: 0;
                  &::after{
                    width: 0;
                  }
                }
              }
            }
            .desc-km{
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #888888;
              line-height: .12rem;
              .num{
                color: #111111;
              }
            }
          }
        }
      }
      .use-btn{
        height: .66rem;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        background: #FFFFFF;
        box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.10);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: .1rem;
        .btn{
          width: 100%;
          height: 100%;
          background: #DBDBDB;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #FFFFFF;
          &.on{
            background: #494B51;
          }
        }
      }
    }
    .btn-container{
      margin-top: 0.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .l-btn{
        width: 1.66rem;
        height:.46rem;
        border: 1px solid rgba(17,17,17,.8);
        border-radius: 2px;
        text-align: center;
        line-height: .46rem;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #111111;
      }
    }
    .desc{
      font-family: PingFangSC-Regular;
      font-size: 11px;
      color: #999999;
      letter-spacing: 0;
      line-height: .11rem;
      width: 100%;
      position: fixed;
      bottom: .15rem;
      left: 0;
      text-align: center;
    }
  }
  .radio{
      width: .18rem;
      height: .18rem;
      border: 1px solid #DFDFDF;
      border-radius: 1px;
      &.on{
          background:url(../images/checked.png);
          background-size: 100% 100%;
          border: 0;
      }
  }
  @media (max-width: 360px) {
    .header{
      padding: 0 .1rem;
    }
    .info{
      padding: 0 .1rem;
    }
    .footer{
      .select-list{
        padding: .145rem .1rem;
      }
    }
  }
</style>