<template>
    <div class="rollPlay">
        <div class="container">
            <div class="text">
                <div class="roll">
                    <span v-for="item,index in tel" :key="index" class="tel">尾号 {{item}} 的小伙伴已获得 {{invite}} 现金</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import rate from '../js/rate.js'

  export default {
    name: "rollPlay",
    data () {
      return {
        tel: [],
        invite:rate.invite
      }
    },
    methods: {
      _getRandomTel () {
        let tel = ''
        for (let i = 0; i < 4; i++) {
          tel += String(Math.floor(Math.random() * 10))
        }
        return tel
      }
    },
    created () {
      for (let i = 0; i < 20; i++) {
        this.tel.push(this._getRandomTel())
      }
    }
  }
</script>

<style lang=less scoped>
    .rollPlay {
        width: 1.95rem;
        background-color: rgba(0, 0, 0, 0.44);
        padding: 0.05rem 0 0.05rem 0.1rem;
        border-radius: 0.17rem 0 0 0.17rem;
        position: absolute;
        top: 0.25rem;
        right: 0;

        .container {
            line-height: 0.2rem;
            padding-left: 0.22rem;
            background: url('../images/laba.png') no-repeat left center;
            background-size: auto 76%;
            color: #fff;

            .text {
                overflow: hidden;
            }

            .roll {
                height: 0.2rem;
                width: fit-content;
                margin-left: 1rem;

                animation-iteration-count: infinite;
                animation-duration: 90s;
                animation-timing-function:linear;
                animation-name: moveLeft;

                .tel {
                    font-size: 13px;
                    white-space: nowrap;
                    margin-left: 0.5rem;
                }

            }
        }
    }

    @keyframes moveLeft {
        from {
            transform: translate3d(0, 0, 0);
        }

        to {
            transform: translate3d(-100%, 0, 0);
        }
    }
</style>