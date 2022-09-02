<template>
    <div class="comment-con">
        <div class="comment_con_in animated faster zoomIn">

            <div class="btn_close" @click="close"></div>

            <!--评价过-->
            <div v-if="data.comment.has_commented">
                <p class="title">非常感谢您对本次服务的评价</p>
                <div class="choose_con">
                    <div class="satisfied choose_one active" v-if="data.type===0">
                        <div class="face_con"></div>
                        <p>满意!</p>
                    </div>
                    <div class="dissatisfied choose_one active" v-else>
                        <div class="face_con"></div>
                        <p>不满意!</p>
                    </div>
                </div>
                <ul class="choose_list">
                    <li v-for="item in data.comment.commented_list" :key="item.id" class="active">{{item.des}}
                    </li>
                </ul>
            </div>
            <!--没评价过-->
            <div v-else>
                <p class="title">请您对立刻本次服务做评价</p>
                <div class="choose_con">
                    <div class="satisfied choose_one" :class="{active:is_positive}" @click="toPositive">
                        <div class="face_con"></div>
                        <p>满意!</p>
                    </div>
                    <div class="dissatisfied choose_one" :class="{active:!is_positive}" @click="toNegative">
                        <div class="face_con"></div>
                        <p>不满意!</p>
                    </div>
                </div>
                <ul class="choose_list">
                    <li v-for="item in list" :key="item.id" :class="{active:chosen.includes(item.id)}"
                        @click="()=>reasonClick(item.id)">{{item.des}}
                    </li>
                </ul>
                <button class="btn opacity" :class="{disabled:!couldSubmit}" @click="commentSubmit">提交</button>
            </div>
        </div>

    </div>
</template>

<script>
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {mapState} from 'vuex'

  export default {
    name: "comment",
    props: ['data'],
    data() {
      return {
        chosen: [],
        is_positive: true
      }
    },
    computed: {
      list() {
        return this.is_positive ? this.data.comment.positive_list : this.data.comment.negative_list
      },
      couldSubmit() {
        if (this.is_positive) {
          return true
        } else {
          return this.chosen.length > 0
        }
      },
      ...mapState('rental',[
        'rental'
      ])
    },
    methods: {
      close() {
        this.$emit('closeComment')
      },
      reasonClick(id) {
        let index = this.chosen.indexOf(id)
        if (index > -1) {
          this.chosen.splice(index, 1)
        } else {
          this.chosen.push(id)
        }
      },
      clearChosen() {
        this.chosen = []
      },
      toPositive() {
        this.is_positive = true
        this.clearChosen()
      },
      toNegative() {
        this.is_positive = false
        this.clearChosen()
      },
      commentSubmit() {
        if (!this.couldSubmit) {
          return
        }

        myAjax.postV2(API.rentalHistory.comment, {
          rental_no: this.data.rental_no,
          type: this.is_positive ? 0 : 1,
          ids: '^' + this.chosen.join('^') + '^'
        }).then(res => {
          if (res.status !== 0) {
            this.$_LIKE_toast(res.msg)
          } else {
            this.$router.push({
              path:'/index'
            })
            // 跳app首页
          }
        })
      }
    }
  }
</script>

<style lang="less">
    .comment-con {
        position: fixed;
        z-index: 190;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.44);
        .comment_con_in {
            width: 78%;
            margin: 30% auto 0;
            padding-bottom: 5%;
            background-color: #FFF;
            border-radius: 2px;
            color: #111;
            text-align: center;
            position: relative;
            .btn_close {
                position: absolute;
                padding: 5%;
                width: 1em;
                height: 1em;
                top: 0;
                right: 0;
                background: url('../../assets/images/rentalDetail/btn_close_gray.png') no-repeat center;
                background-size: 35%;
                font-size: 0.15rem;
            }
            .title {
                padding: 5% 0;
                text-align: center;
                font-size: 0.15rem;
            }
            .choose_con {
                zoom: 1;
                overflow: hidden;
                margin: 0 5%;
                .choose_one {
                    display: inline-block;
                    width: 45%;
                    opacity: 0.2;
                    text-align: center;
                    &.active {
                        opacity: 1;
                    }
                }
                p {
                    font-size: 0.16rem;
                    color: #000;
                }
                .satisfied {
                    .face_con {
                        background-image: url('../../assets/images/rentalDetail/satisfied.png');
                    }
                }
                .dissatisfied {
                    .face_con {
                        background-image: url('../../assets/images/rentalDetail/dissatisfied.png');
                    }
                }
                .face_con {
                    width: 48px;
                    height: 48px;
                    margin: 8% auto;
                    background: no-repeat center;
                    background-size: 100%;
                }
            }
            .choose_list {
                margin: 5%;
                overflow: hidden;
                zoom: 1;
                li {
                    color: #999;
                    width: 46%;
                    line-height: 2.8em;
                    margin: 5px 0;
                    float: left;
                    text-align: center;
                    border: solid 1px #E3E3E3;
                    border-radius: 2px;
                    font-size: 0.12rem;
                    box-sizing: border-box;
                    &:nth-of-type(even) {
                        margin-left: 8%;
                    }
                    &.active {
                        background-color: #E3E3E3;
                        color: #111
                    }
                }
            }
            .btn {
                width: 76%;
                height: 2.6em;
                color: #fff;
                font-size: 0.14rem;
                background-color: #000;
                border: none;
                border-radius: 2px;
                &.disabled {
                    background-color: #DBDBDB;
                    color: #FFF;
                    &:active {
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>
