<template>
    <el-card class="box-card control">
        <div class="clearfix">
            <div class="float-right con" @click="openChange"></div>
        </div>
        <div v-if="open" class="items">
            <div class="item">
                <span>立刻：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList">
                        <el-checkbox label="0">B</el-checkbox>
                        <el-checkbox label="1">B+</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
            <div class="item">
                <span>等级：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList2">
                        <el-checkbox label="s">S</el-checkbox>
                        <el-checkbox label="a">A</el-checkbox>
                        <el-checkbox label="b">B</el-checkbox>
                        <el-checkbox label="c">C</el-checkbox>
                        <el-checkbox label="d">D</el-checkbox>
                        <el-checkbox label="e">E</el-checkbox>
                        <el-checkbox label="other">其它</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
            <div class="item">
                <span>竞品：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="other_company" @change="companyChange">
                        <el-checkbox label="gofun">gofun</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
            <div class="item">
                <span>图层：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="layers" @change="layersChange">
                        <el-checkbox label="1">网格</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>
        </div>
    </el-card>
</template>

<script>
  import mapControl from '../js/mapControl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../js/getApiUrl'
  import {bounds,gofun,like} from '../data'


  export default {
    name: "control",
    data () {
      return {

        branches: like.map(item=>{
          if(!item.level){
            item.level = 'other'
          }else{
            item.level = item.level.toLowerCase()
          }
          return item
        }),
        filter_list: ['0', '1'],
        filter_list2:['s','a','b','c','d','e','other'],

        other_company:[],
        layers:[],

        lines:[],

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
          return this.filter_list.includes(String(branch.biz_type)) && this.filter_list2.includes(branch.level)
        })
      },
      branchesGo(){
        if(this.other_company.length === 0){
          return []
        }else{
          return gofun
        }
      }

    },
    methods: {
      openChange () {
        this.open = !this.open
      },
      layersChange(layers){
        if(layers.length === 1){
          mapControl.drawRects(this.lines)
        }else{
          mapControl.hideRects()
        }
      },
      companyChange(){
        mapControl.drawBranchesGo(this.branchesGo)
      }
    },
    created () {
      let step = bounds.step
      for(let lng = bounds.southWest.lng;lng<=bounds.northEast.lng;lng+=step.lng){
        this.lines.push([[lng,bounds.southWest.lat],[lng,bounds.northEast.lat]])
      }
      for(let lat = bounds.southWest.lat;lat<=bounds.northEast.lat;lat+=step.lat){
        this.lines.push([[bounds.southWest.lng,lat],[bounds.northEast.lng,lat]])
      }

      mapControl.ready(()=>{
        mapControl.drawBranches(this.branches_after_filter)
      })
    }
  }
</script>

<style lang=less scoped>
    .control {
        position: absolute;
        top: 0;
        right: 0;

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
            padding-top: 10px;
        }

        .el-checkbox+.el-checkbox{
            margin-left: 15px;
        }

        .item {
            margin-top: 5px;
            line-height: 32px;
        }

        .switch {
            vertical-align: text-top;
            margin-top: 1px;
        }
    }
</style>