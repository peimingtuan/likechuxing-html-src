/*************************************************
* Description:车辆基本信息展示
*************************************************/
<template>
    <div class="CarBox">
        <div class="base-info">
            <div>
                <span class="name">{{data.plate_no}}</span>
                <span class="vin" v-if="data.vin_h">({{data.vin_h}})</span>
                <span class="status" v-if="data.status_name">{{data.status_name}}</span>

                <LimitBox v-if="data.limit_record" class="float-right" :data="data.limit_record"></LimitBox>
            </div>

            <div class="desc">
                {{data.model_name}} | 续航约 {{data.remain_km || '-'}} 公里
            </div>

            <div class="branch" v-if="data.branch">
                <div class="branch-addr" :class="data.branch.biz_type===0?'b':'b_plus'">{{data.branch.name || data.branch.address}}</div>
            </div>
        </div>

        <div class="extra">
            <slot/>
        </div>

    </div>
</template>

<script>
  import LimitBox from './limitBox'

  export default {
    name: "carBox",
    props:{
      data:{
        default(){return {}}
      },
    },
    components:{
      LimitBox
    }
  }
</script>

<style lang=less>
    .CarBox{
        padding: 0.1rem;
        background-color: #fff;
        .base-info{
            font-size: 14px;
            line-height: 0.2rem;
            .name{
                color:#333;
            }
            .vin{
                color:#666;
            }
            .status{
                font-size: 12px;
                border: solid 1px #dbdbdb;
                border-radius: 2px;
                padding: 0 3px;
                color:#666;
            }

            .desc{
                line-height: 1.4;
                font-size: 12px;
                color:#666;
            }

            .branch{
                color:#666;
                font-size: 12px;
                margin:0.05rem 0;
                .branch-addr{
                    padding-left: 0.2rem;
                    background: url('../images/mapb.png') no-repeat left;
                    background-size: auto 100%;
                    &.b_plus{
                        background-image: url('../images/map-B.png');
                    }
                }
            }

        }
    }
</style>