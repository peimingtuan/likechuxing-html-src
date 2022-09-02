<template>
    <div class="ExchangeBox">
        <div class="code-box">
            <input class="code" v-model.trim="code" type="text" placeholder="请输入兑换码"/>
            <div class="clear" v-if="code!==''" @click="clearCode"></div>
        </div>

        <div class="btn-box">
            <button v-if="!isExchange" class="btn" @click="toExchange">兑换</button>
            <div v-else class="loading"></div>
        </div>

    </div>
</template>

<script>
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl} from '../../../../../other_modules/url-constructor/index'

  export default {
    name: "exchangeBox",
    data () {
      return {
        code: '',
        isExchange: false
      }
    },
    computed: {
      couldSubmit () {
        return !this.isExchange && this.code.length > 0
      }
    },
    methods: {
      clearCode () {
        this.code = ''
      },
      toExchange () {
        if (this.code === '') {
          this.$_LIKE_toast('请输入兑换码')
          return
        }

        this.isExchange = true
        myAjax.post(getApiUrl('/coupon/convert'), Object.assign({},this.$store.getters.publicArguments, {
          code: this.code
        })).then(res => {
          this.isExchange = false
          if (res.status === 0) {
            this.$_LIKE_toast("兑换成功")
            location.reload();
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          this.isExchange = false
          console.log(err)
        })

      },
    }
  }
</script>

<style lang=less scoped>
    .ExchangeBox {
        background-color: #fff;
        padding: 0.15rem;
        box-sizing: border-box;
        display: flex;
        //position: fixed;
        top:1.51rem;
        width: 100%;
        z-index: 11;
        border-bottom: solid 1px #dfdfdf;

        .code-box {
            flex: 1;
            position: relative;
            border: .01rem solid #dfdfdf;
            border-radius: 2px;
            height: 0.4rem;
            //background-color: red;
            box-sizing: border-box;
            padding: 0.1rem 0.2rem 0.1rem;

            .code {
                margin-top: -1px;
                outline: none;
                border:none;
                //height: .4rem;
                width: 100%;
                font-size: 14px;
                //background-color: green;
                line-height: 0.2rem;
                &::-webkit-input-placeholder {
                    color: #999;
                    font-size: 13px;
                }
            }

            .clear {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.2rem;
                height: 0.2rem;
                background: url('../images/clear.png') no-repeat center;
                background-size: 100%;
            }
        }

        .btn-box {
            width: .76rem;
            height: .4rem;
            background: #63656b;
            margin-left: .05rem;
            border-radius: 2px;
            overflow: hidden;
            .btn {
                font-size: 13px;
                outline: none;
                border: none;
                width: 100%;
                height: 100%;
                background: #494b51;
                color: #FFF;

            }
            .loading {
                margin: auto;
                width: 0.2rem;
                height: 100%;
                background: url('../images/loading.png') no-repeat center;
                background-size: 100%;
                animation: circle infinite .75s linear;
            }
        }

    }

    @keyframes circle {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>