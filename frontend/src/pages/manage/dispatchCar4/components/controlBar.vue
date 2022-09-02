<template>
    <div class="controlBar">
        <div class="content">
            <div class="row">
                <el-select :value="currentCity.id" placeholder="请选择" @change="changeCity">
                    <el-option
                            v-for="item in city_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="row">
                <el-select :value="currentType" :disabled="!dataReady" placeholder="请选择" @change="changeValue">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="row">
                <span class="switch">
                    网点：
                    <el-switch v-model="show_branch" :disabled="!dataReady" active-color="#222" @change="toggleBranch"/>
                </span>
                <el-popover
                        class="detail"
                        placement="top-start"
                        title=""
                        width="400"
                        trigger="click"
                        v-model="show_detail">
                    <ul class="detail">

                        <!--供需关系-->
                        <li class="item" v-if="currentType===0">
                            <span class="key">供需关系：</span>
                            <div class="text">
                                <div class="text-block">1、当供应&gt;需求时用<span class="green color-change">绿色</span>表示，绿色越深则供应过剩越严重。
                                </div>
                                <div class="text-block">2、当供应&lt;需求时用<span class="red color-change">红色</span>表示，红色越深则补车缺口越大。
                                </div>
                                <div class="text-block">3、当供应=需求时用<span class="yellow color-change">黄色</span>显示。</div>
                                <div class="text-block">注：供应为当前时刻的可租赁车辆数，用车需求为未来半小时的算法根据历史订单和有车提醒预测的需求。</div>
                            </div>
                        </li>

                        <!--供应-->
                        <li class="item" v-if="currentType===1">
                            <span class="key">调度供应：</span>
                            <div class="text">
                                <div class="text-block">1、<span class="green color-change">绿色</span>代表区域可租赁车辆数，颜色越深代表可租赁车辆越多。
                                </div>
                                <div class="text-block">2、可租赁车辆数=0时，不做展示。</div>
                                <div class="text-block">注：可租赁车辆数为当前时刻的可租赁车辆数。</div>
                            </div>
                        </li>

                        <!--需求-->
                        <li class="item" v-if="currentType===2">
                            <span class="key">用车需求：</span>
                            <div class="text">
                                <div class="text-block">1、<span class="red color-change">红色</span>代表用车需求，颜色越深代表用车需求越多
                                </div>
                                <div class="text-block">2、用车需求=0时，不做展示。</div>
                                <div class="text-block">注：需求为未来半小时的需求。</div>
                            </div>
                        </li>

                        <li class="item">
                            展示区域边长 = 500米
                        </li>
                        <li class="item" v-if="show_branch">
                            黑点代表B类网点，蓝色代表B+类网点
                        </li>
                    </ul>
                    <el-button slot="reference">使用说明</el-button>
                </el-popover>
            </div>
        </div>
    </div>
</template>

<script>
  import mapControl from '../js/mapControl'
  import {mapState} from 'vuex'

  export default {
    name: "control-bar",
    data () {
      return {
        show_detail: false,
        show_branch: false,
        options: [
          {
            value: 0,
            label: '供需关系'
          },
          {
            value: 1,
            label: '调度供应'
          },
          {
            value: 2,
            label: '用车需求'
          }
        ]
      }
    },
    computed: {
      ...mapState('control', ['currentType', 'dataReady']),
      ...mapState(['branches','city_list','currentCity'])
    },
    methods: {
      changeCity(id){
        this.show_branch = false
        mapControl.hideBranches()
        this.$store.dispatch('setCurrentCity',this.city_list.find(item=>item.id === id))
      },
      changeValue (item) {
        this.$store.commit('control/setCurrentType', item)
        mapControl.drawArea(this.$store.state.area,this.$store.state.control.currentType)
      },
      toggleBranch(value){
        if(value){
          mapControl.drawBranches(this.branches)
        }else{
          mapControl.hideBranches()
        }
      }
    }
  }
</script>

<style lang=less scoped>
    .controlBar {
        position: absolute;
        margin: 20px;
        top: 0;
        padding: 5px 15px;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        .row {
            margin: 10px 0
        }
        .switch {
            color: #606266;
        }

    }

    .detail {
        font-size: 13px;
        color: #111;
        line-height: 20px;
        .item {
            margin: 10px 0;
        }
        .key {
            color: #999;
        }
        .text {
            margin-top: -20px;
            margin-left: 5em;
            .text-block {
                margin-bottom: 5px;
            }
        }
        .color-change {
            color: #fff;
            padding: 0 3px;
            border-radius: 3px;
            &.green {
                background-color: rgba(38, 150, 23, 0.8);
            }
            &.red {
                background-color: rgba(253, 12, 27, 0.8);
            }
            &.yellow {
                color: #111;
                background-color: rgba(255, 241, 53, 0.8);
            }
        }
    }
</style>