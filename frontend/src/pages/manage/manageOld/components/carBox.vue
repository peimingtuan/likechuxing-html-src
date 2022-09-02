<template>
    <div class="CarBox">
        <!--网点车辆>5-->
        <div v-if="type === 300">
            <div class="row">
                <div class="item"><span class="label">网点名：</span>{{car.branch_name}}</div>
            </div>
            <div class="row">
                <div class="item"><span class="label">网点地址：</span>{{car.branch_addr}}</div>
            </div>
        </div>
        <div v-else @click="boxClick">
            <div class="row flex">
                <div class="item">{{car.plate}}</div>
                <div class="item">{{car.brand}}</div>
                <div class="item">{{car.status}}</div>
            </div>
            <div class="row flex">
                <div class="item"><span class="vin">{{vin[0]}}</span>{{vin[1]}}</div>
                <div class="item">{{car.remain_km}} km</div>
            </div>
            <div class="row">
                <div class="item"><span class="label">网点名：</span>{{car.branch_name}}</div>
            </div>
            <div class="row">
                <div class="item"><span class="label">网点地址：</span>{{car.branch_addr}}</div>
            </div>
            <div class="row" v-if="car.hasOwnProperty('distance')">
                <div class="item"><span class="label">距离：</span>{{car.distance}}</div>
            </div>

            <!--偷油 305-->
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">订单前油量：</span>{{car.init_gasoline}}</div>
            </div>
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">当前油量：</span>{{car.now_gasoline}}</div>
            </div>
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">截止目前里程：</span>{{car.km_total}}</div>
            </div>

            <!--24小时未动 302-->
            <div class="row" v-if="type===302">
                <div class="item"><span class="label">驻留时间：</span>{{car.unmove_hour}}</div>
            </div>

            <div class="row">
                <div class="item"><span class="label">操作人：</span>{{car.des_name}}<span class="label"> 于 </span>{{car.des_time}}<span
                        class="label"> 操作</span></div>
            </div>
            <div class="row">
                <div class="item"><span class="label">待处理时间：</span>{{car.during_time}}</div>
            </div>
            <div class="row">
                <div class="item"><span class="label">备注：</span>{{car.des}}</div>
            </div>

            <!--偷油 305-->
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">疑似偷油量：</span>{{car.init_gasoline-car.now_gasoline}}</div>
            </div>
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">用户手机号：</span>{{car.phone_no}}</div>
            </div>
            <div class="row" v-if="type===305">
                <div class="item"><span class="label">预警时间：</span>{{createTime305}}</div>
            </div>

            <!--差评 304-->
            <div class="row" v-if="type===304">
                <div class="item"><span class="label">评价内容：</span>
                    <div class="right" v-html="car.evaluate"></div>
                </div>
            </div>
            <div class="row" v-if="type===304 && car.evaluate_remark_history">
                <div class="item"><span class="label">记录内容：</span>
                    <div class="right" v-html="car.evaluate_remark_history"></div>
                </div>
            </div>
            <div class="row flex" v-if="type===304">
                <button class="btn" @click.stop="commentOk">没问题</button>
                <button class="btn" @click.stop="commentStatus">有问题改状态</button>
                <button class="btn" @click.stop="showCommentLog">有问题记录</button>
            </div>

            <!--找不到车 306-->
            <div class="row" v-if="type===306">
                <div class="item">
                    <button class="dispose" @click.stop="deal306">已处理</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "car-box",
    props: ['car', 'type'],
    computed: {
      vin () {
        // 后六位突出显示
        if (this.car.vin) {
          let length = this.car.vin.length
          return [this.car.vin.substr(0, length - 7), this.car.vin.substr(length - 7, 6)]
        } else {
          return ['vin为空', '']
        }
      },
      createTime305 () {
        return format.time(this.car.create_time, 0)
      }
    },
    methods: {
      deal306 () {
        let that = this
        this.$_LIKE_confirm({
          msg: '确定处理完成？',
          confirmButtonCallback: function () {
            let loading = that.$_LIKE_loading('处理中')
            that.$store.dispatch('carList/deal306', that.car.id).then(() => {
              loading.close()
              that.$_LIKE_toast('处理成功')
            }).catch(err => {
              loading.close()
              if (err && err.msg) {
                this.$_LIKE_toast(err.msg)
              }
            })
          }
        })
      },
      boxClick () {
        this.$router.push({
          path:'/',
          query:{
            plate_no:this.car.plate
          }
        })
      },
      showCommentLog(){
        this.$emit('showCommentLog',this.car)
      },
      commentStatus(){
        this.$emit('commentStatus',this.car)
      },
      commentOk(){
        this.$emit('commentOk',this.car)
      }
    }
  }
</script>

<style lang=less scoped>
    .CarBox {
        padding: 5px 15px;
        border-bottom: solid 1px #dbdbdb;
        &:nth-last-of-type(1){
            border:none
        }
        .row {
            &.flex {
                display: flex;
                justify-content: space-between;
            }
            .label {
                color: #999
            }
            .vin {
                color: #999
            }
            .dispose {
                outline: none;
                display: block;
                width: 120px;
                height: 28px;
                margin: 5px auto;
                font-size: 14px;
                background-color: #f5f5f5;
                border-radius: 3px;
                border: solid 1px #dbdbdb
            }
            .right {
                margin-top: -20px;
                margin-left: 5em;
            }
            .btn {
                background-color: #15BDF4;
                color: #fff;
                height: 24px;
                font-size: 13px;
                line-height: 1;
                padding: 2px 6px;
                margin: 2px 0;
            }
        }
    }
</style>