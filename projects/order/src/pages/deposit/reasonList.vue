<template>
  <div class="ReasonList">
    <div v-if="list.length > 0" class="reason_con">
      <div class="title">请选择退押金原因<img src="../../assets/images/smileFace.png" class="smile"/></div>
      <ul>
        <li v-for="(item, index) in list" class="item">
          <div>
            {{item.des}}
            <div :class="['choose', {'active': item.chosen}]" @click="(chooseReason)(index)"></div>
          </div>
        </li>
      </ul>
      <div :class="['textarea_con', {'show': showTextarea}]">
        <textarea  placeholder="请输入不超过50个字的描述" rows="3" v-model="refund_reason_des" maxlength="50"></textarea>
        <span>{{reasonLength}}/50</span>
      </div>
    </div>
    <div class="btn_con" v-if="list.length>0">
      <button class="btn" @click="refund">退押金</button>
      <button class="btn" @click="backToMain">不退了</button>
    </div>
  </div>
</template>

<script>
  import myaxios from '../../common/myaxios'
  import API from '../../common/apiAddress'
  import security from '../../common/security'
  export default {
    data () {
      return {
        list: [],
        refund_reason_des: ''
      }
    },
    computed: {
      showTextarea () {
        let other = this.list.find(item => +item.id === 100)
        if (other) {
          return other.chosen
        } else {
          return false
        }
      },
      reasonLength () {
      	return this.refund_reason_des.length
      }
    },
    methods: {
      chooseReason: function (index) {
        this.list[index].chosen = !this.list[index].chosen
      },
      backToMain () {
        this.$router.push('/main/index')
      },
      refund () {
      	let that = this
      	let ids = this.list.filter(item => item.chosen)
        if (ids.length === 0) {
      		this.$store.dispatch('Alert/show', {
      			mold: 'toast',
            msg: '请选择原因'
          })
          return
        }

        this.$store.commit('Loading/show', {
        	text: '退款中...',
          preventEvent: true
        })
        let data = {
          refund_reason: '^' + ids.map(item => item.id).join('^') + '^',
          refund_reason_des: security.text(this.refund_reason_des).replace(/\s+/g, '')
        }
        myaxios.post(API.deposit.payBack, data).then(function (res) {
        	this.$store.commit('Loading/hide')
        	if (res.data.status === 0) {
        		that.$store.dispatch('Alert/show', {
        			mold: 'toast',
              msg: res.data.msg,
              toastCallback: function () {
        				that.$router.push({
                  name: 'index'
                })
              }
            })
          }
        }.bind(this))
      }
    },
    created: function () {
      this.$store.commit('Loading/show', {
        kind: 1
      })

      myaxios.post(API.deposit.payBack, {
        action: 'reason_list'
      }, {showStatus1: false}).then(function (res) {
        this.$store.commit('Loading/hide')
        if (+res.data.status === 0) {
          res.data.data.reasons.forEach(item => {
            this.list.push({
              id: item.id,
              des: item.des,
              chosen: false
            })
          })
        } else {
        	this.$store.dispatch('Alert/show', {
        		mold: 'toast',
            msg: res.data.msg
          })
          this.$router.go(-1)
        }
      }.bind(this))
    }
  }
</script>

<style lang="less" scoped>
  .ReasonList {
  }

  .reason_con {
    margin: 0 0.2rem;
    padding: 0.2rem 0;
    text-align: left;
  }

  .title {
    font-size: 0.22rem;
    color: #111;
    .smile {
      width: 0.22rem;
      height: 0.22rem;
      position: relative;
      top: 0.02rem;
      left: 0.1rem
    }
  }

  .item {
    font-size: 0.15rem;
    color: #111;
    margin: 0.15rem 0;
    line-height: 0.24rem;
  }

  .choose {
    float: right;
    width: 0.22rem;
    height: 0.22rem;
    background: url('../../assets/images/icon_unchosen.png') no-repeat center;
    background-size: 90%;
    &.active {
      background-image: url('../../assets/images/icon_chosen.png');
    }
  }

  .textarea_con {
    padding-bottom: 0.8rem;
    display: none;
    color:#999;
    font-size: 0.11rem;
    position: relative;
    &.show {
      display: block;
    }
    span{
      position: absolute;
      right:0.16rem;
      bottom:0.86rem
    }
    textarea {
      border: solid 1px #e3e3e3;
      width: 100%;
      box-sizing: border-box;
      padding: 0.08rem 0.1rem 0.18rem;
    }
  }

  .btn_con {
    padding: 0.15rem 0;
    background-color: #fff;
    position: fixed;
    left: 0.2rem;
    right: 0.2rem;
    bottom: 0;
    text-align: left;
    .btn {
      width: 45%;
      height: 0.46rem;
      border-radius: 3px;
      font-size: 0.15rem;
      color: #666;
      background-color: #FFF;
      border: solid 1px #DFDFDF;
      &:nth-of-type(2) {
        float: right;
        color: #fff;
        background-color: #111;
      }
    }
  }
</style>
