<template>
    <SlideUpContainer :show="show" @close="afterLeave">
        <!--没评价过，去评价-->
        <div class="CommentBox" v-if="!data.has_commented">
            <div class="header">
                <div class="tab stable" :class="{active:is_positive}" @click="toPositive">
                    <span>满意</span>
                </div>
                <div class="tab" :class="{active:!is_positive}" @click="toNegative">
                    <span>不满意</span>
                </div>
                <div class="btn_close" @click="close"></div>
            </div>

            <ul class="list">
                <li class="item" v-for="item in list" :key="item.id" :class="{active:chosen.includes(item.id)}"
                    @click="()=>reasonClick(item.id)">{{item.des}}
                </li>
            </ul>

            <div class="btn_con">
                <div class="submit btn-animate zoom" :class="{disabled:!couldSubmit}" @click="commentSubmit">提交</div>
            </div>
        </div>

        <div class="CommentBox" v-else>
            <div class="header">
                <div class="tab stable" :class="{active:data.type===0}">
                    <span>满意</span>
                </div>
                <div class="tab" :class="{active:data.type!==0}">
                    <span>不满意</span>
                </div>
                <div class="btn_close" @click="close"></div>
            </div>

            <ul class="list">
                <li v-for="item in data.commented_list" :key="item.id" class="item active">{{item.des}}
                </li>
            </ul>

            <div class="btn_con">
                <div class="submit btn-animate zoom" @click="close">关闭</div>
            </div>
        </div>

    </SlideUpContainer>
</template>

<script>
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl} from '../../../../../other_modules/url-constructor/index';
  import SlideUpContainer from '../../../../../other_modules/vue-popMessage/slideUpContainer'

  export default {
    name: "comment",
    props: ['data'],
    components:{
      SlideUpContainer
    },
    data() {
      return {
        show:false,
        chosen: [],
        chosen_full:[],
        is_positive: true
      }
    },
    computed: {
      list() {
        return this.is_positive ? this.data.positive_list : this.data.negative_list
      },
      couldSubmit() {
        if (this.is_positive) {
          return true
        } else {
          return this.chosen.length > 0
        }
      }
    },
    methods: {
      afterLeave() {
        this.$emit('closeComment')
      },
      close() {
        this.show=false
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

        this.chosen_full = this.chosen.map(id=>this.list.find(reason=>reason.id===id))

        myAjax.post(getApiUrl('/rental-history/comment'), Object.assign({},this.$store.getters['publicArguments'],{
          type: this.is_positive ? 0 : 1,
          ids: '^' + this.chosen.join('^') + '^'
        })).then(res => {
          if (res.status !== 0) {
            this.$_LIKE_toast(res.msg)
          } else {
            // 2018-11-15 上红包活动，改成评价完仍然去显示红包
            //appMutual.jump.indexAndCloseThisWebview()
            this.$store.commit('comment',{
              type:this.is_positive ? 0:1,
              chosen:this.chosen_full
            })
            this.close()
          }
        })
      }
    },
    mounted(){
      this.show = true
    }
  }
</script>

<style lang="less">
    .CommentBox {
        background-color: #fff;

        .header{
            line-height: 0.48rem;
            font-size: 16px;
            display: flex;
            .tab{
                flex: 1;
                background-color:#f2f2f2 ;
                color:#999;
                text-align: left;
                padding: 0 2.5em;
                position: relative;
                overflow: visible;
                &.stable{
                    flex: none;
                    width: 0.34rem;
                    &.active::before{
                        left:-0.3rem
                    }
                }
                &.active{
                    z-index: 2;
                    color:#111;
                    &::before{
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        position: absolute;
                        left:-0.1rem;
                        z-index: -1;
                        border-bottom:solid 0.48rem #fff;
                        border-left: solid 0.2rem transparent;
                        border-right: solid 0.2rem transparent;
                    }
                }
            }

            .btn_close {
                position: absolute;
                width: 0.48rem;
                height: 0.48rem;
                top: 0;
                right: 0;
                background: url('../images/btn_close_gray.png') no-repeat center;
                background-size: 30%;
                font-size: 15px;
                z-index: 4;
            }
        }

        .list{
            padding: 0.2rem;
            .item{
                display: inline-block;
                margin:0.03rem 0.05rem;
                width: 0.78rem;
                text-align: center;
                font-size: 12px;
                line-height: 0.3rem;
                border:solid 1px #e3e3e3;
                color:#999;
                &.active{
                    color:#111;
                    border-color:#111;
                }
            }
        }

        .btn_con{
            line-height: 0.48rem;
            border-top:solid 1px #e5e5e5;
            .submit{
                font-size: 16px;
                text-align: center;
                &.disabled{
                    color:#dfdfdf;
                }
            }
        }
    }
</style>