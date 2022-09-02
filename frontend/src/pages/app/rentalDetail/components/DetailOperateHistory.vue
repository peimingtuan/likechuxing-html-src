<template>
    <ul class="DetailOperateHistory">
        <li>
            <div>{{book_time_h}}</div>
            <div><span class="three_points"></span>预定成功</div>
        </li>
        <li v-if="data.begin_time>0">
            <div>{{begin_time_h}}</div>
            <div><span class="three_points"></span>计费开始</div>
        </li>

        <!--系统取消-->
        <li class="sys_cancel" v-if="data.end_time>0 && data.is_cancel && data.auto_cancel">
            <div>{{end_time_h}}</div>
            <div class="two_point"><span class="three_points"></span>取消成功<p>超3小时系统取消</p></div>
        </li>
        <!--用户取消-->
        <li v-if="data.end_time>0 && data.is_cancel && !data.auto_cancel">
            <div>{{end_time_h}}</div>
            <div class="two_point"><span class="three_points"></span>取消成功</div>
        </li>
        <!--顺利完成-->
        <li v-if="data.end_time>0 && !data.is_cancel">
            <div>{{end_time_h}}</div>
            <div><span class="three_points"></span>还车成功</div>
        </li>

        <li v-if="data.pay_time>0">
            <div>{{pay_time_h}}</div>
            <div><span class="three_points"></span>系统扣款成功</div>
        </li>
    </ul>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "DetailOperateHistory",
    props:['data'],
    computed:{
      book_time_h(){
        return format.time(this.data.book_time, 0)
      },
      begin_time_h(){
        return format.time(this.data.begin_time, 0)
      },
      end_time_h(){
        return format.time(this.data.end_time, 0)
      },
      pay_time_h(){
        return format.time(this.data.pay_time, 0)
      }
    }
  }
</script>

<style lang=less>
    .one_points_mixins {
        position: absolute;
        display: block;
        width: 0.02rem;
        height: 0.02rem;
        background-color: #D8D8D8;
        left: 0;
        border-radius: 50%;
    }

    .DetailOperateHistory {
        position: relative;
        font-size: 12px;
        li {
            margin-left: 1.2em;
            line-height: 0.16rem;
            zoom: 1;
            overflow: hidden;
            padding: 0.07rem 0;
            & > div {
                &:nth-of-type(1) {
                    color: #999;
                    float: left;
                }
                &:nth-of-type(even) {
                    float: right;
                    text-align: right;
                }
            }

            &::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                width: 0.06rem;
                height: 0.06rem;
                margin-left: 0.01rem;
                background-color: #999;
                border-radius: 50%;
                margin-top: 0.05rem;
            }
            &:nth-last-of-type(1) {
                &::before {
                    width: 0.08rem;
                    height: 0.08rem;
                    margin-left: 0;
                    background-color: #111;
                    margin-top: 0.04rem;
                }
                .three_points {
                    display: none;
                }
                .two_point {
                    &::before {
                        display: none;
                    }
                    &::after {
                        display: none;
                    }
                }
            }

            .three_points {
                .one_points_mixins;
                margin-left: 0.03rem;
                margin-top: 0.16rem;
                &::before {
                    content: '';
                    margin-top: 0.05rem;
                    .one_points_mixins;
                }
                &::after {
                    content: '';
                    margin-top: 0.1rem;
                    .one_points_mixins;
                }
            }
        }
        .sys_cancel {
            padding-bottom: 0.18rem;
            p {
                width: 50%;
                color: #999;
                font-size: 12px;
                position: absolute;
                right: 0;
                margin-right: -1em;
                margin-top: -0.05em;
                transform: scale(0.8);
            }
            .two_point {
                &::before {
                    content: '';
                    margin-left: 0.03rem;
                    margin-top: 0.31rem;
                    .one_points_mixins
                }
                &::after {
                    content: '';
                    margin-left: 0.03rem;
                    margin-top: 0.2rem;
                    .one_points_mixins
                }
            }
        }
    }
</style>