<template>
    <el-card class="box-card control">
        <div class="clearfix">
            <div class="float-right con" @click="openChange"></div>
        </div>
        <div v-if="open" class="items">
            <div class="item">
                <span class="label">类别：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList">
                        <el-checkbox label="0">B</el-checkbox>
                        <el-checkbox label="1">B+</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
            <div class="item">
                <span class="label">分类：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList2" @change="companyChange">
                        <el-checkbox label="1" class="group_1">第1象限</el-checkbox>
                        <el-checkbox label="2" class="group_2">第2象限</el-checkbox>
                        <el-checkbox label="3" class="group_3">第3象限</el-checkbox>
                        <el-checkbox label="4" class="group_4">第4象限</el-checkbox>
                        <el-checkbox label="5" class="group_5">暂不考虑</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
            <div class="item">
                <span class="label">环线：</span>
                <span class="inline-block">
                    <el-checkbox v-model="line2" @change="val=>{lineChange(2,val)}">二环</el-checkbox>
                    <el-checkbox v-model="line3" @change="val=>{lineChange(3,val)}">三环</el-checkbox>
                </span>
            </div>
            <div class="item">
                <span class="label">网格：</span>
                <span class="inline-block">
                    <el-checkbox v-model="grid" @change="gridChange">全部</el-checkbox>
                </span>
            </div>
        </div>
    </el-card>
</template>

<script>
  import mapControl from '../js/mapControl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../js/getApiUrl'
  import {bounds} from '../data'
  import branches from '../data/branch_bind'

  export default {
    name: "control",
    data () {
      return {
        branches: branches,

        group: branches.filter(item=>item.bind_type_all),
        group_b:branches.filter(item=>item.bind_type_b),

        filter_list: ['0', '1'],
        filter_list2: ['1', '2','3','4','5'],

        line2: true,
        line3: true,
        road: ['2', '3'],
        grid: false,
        grid_bind: false,
        grid_bind_b:false,
        area:false,

        lines: [],

        open: true
      }
    },
    computed: {
      filterList: {
        get () {
          return this.filter_list
        },
        set (val) {
          this.filter_list = val
          mapControl.drawBranches(this.branches_after_filter)
        }
      },
      filterList2: {
        get () {
          return this.filter_list2
        },
        set (val) {
          this.filter_list2 = val
          mapControl.drawBranches(this.branches_after_filter)
        }
      },
      branches_after_filter () {
        return this.branches.filter(branch => {

          return this.filter_list.includes(String(branch.biz_type)) && this.filter_list2.includes(String(branch.group))
        })
      }

    },
    methods: {
      openChange () {
        this.open = !this.open
      },
      gridChange (draw) {
        if (draw) {
          mapControl.drawRects(this.lines)
        } else {
          mapControl.hideRects()
        }
      },
      gridBindChange (draw) {
        if (draw) {
          mapControl.drawGridBind(this.group)
        } else {
          mapControl.hideGridBind()
        }
      },
      gridBindBChange (draw) {
        if (draw) {
          mapControl.drawGridBindB(this.group_b)
        } else {
          mapControl.hideGridBindB()
        }
      },
      areaChange(draw){
        if (draw) {
          mapControl.drawArea(this.group)
        } else {
          mapControl.hideArea()
        }
      },
      lineChange (type, val) {
        if (val) {
          mapControl.drawLine(type)
        } else {
          mapControl.hideLine(type)
        }
      }
    },
    created () {
      let step = bounds.step
      for (let lng = bounds.southWest.lng; lng <= bounds.northEast.lng; lng += step.lng) {
        this.lines.push([[lng, bounds.southWest.lat], [lng, bounds.northEast.lat]])
      }
      for (let lat = bounds.southWest.lat; lat <= bounds.northEast.lat; lat += step.lat) {
        this.lines.push([[bounds.southWest.lng, lat], [bounds.northEast.lng, lat]])
      }

      console.log('网点总数：'+this.branches.length)
      console.log('全类型联结：'+this.group.length)
      console.log('B网点联结：'+this.group_b.length)

      mapControl.ready(() => {
        if (this.line2) mapControl.drawLine(2, require('../data/cd_2'))
        if (this.line3) mapControl.drawLine(3, require('../data/cd_3'))

        mapControl.drawBranches(this.branches_after_filter)
      })
    }
  }
</script>

<style lang=less>
    .control {
        position: absolute;
        top: 0;
        right: 0;

        .group_1>.el-checkbox__label{color:#ff0000}
        .group_2>.el-checkbox__label{color:#70b3e6}
        .group_3>.el-checkbox__label{color:#1a10ff}
        .group_4>.el-checkbox__label{color:#56feb5}
        .group_5>.el-checkbox__label{color:#ffa000}

        .label {
            display: inline-block;
            min-width: 4em;
        }

        .con {
            margin: -10px;
            width: 20px;
            height: 20px;
            background: url('../images/setting.png') no-repeat center;
            background-size: 100%;
        }

        .inline-block {
            display: inline-block;
        }

        .items {
            min-width: 260px;
            padding-top: 10px;
        }

        .el-checkbox + .el-checkbox {
            margin-left: 15px;
        }

        .tips{
            width: 300px;
            margin:10px 0;
            font-size: 13px;
            color:#999;
        }

        .item {
            margin-top: 5px;
            line-height: 24px;
        }

        .switch {
            vertical-align: text-top;
            margin-top: 1px;
        }
    }
</style>