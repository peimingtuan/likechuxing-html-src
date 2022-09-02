<template>
    <el-card class="box-card count">
        <div class="header">
            <span>
                <i class="iconfont icon-guanbi" @click="closeCount"></i>
            </span>
        </div>
        <el-table
                v-loading="!dataReady"
                :data="tableData"
                @cell-mouse-enter="mouseEnter"
                @cell-mouse-leave="mouseLeave"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="范围">
            </el-table-column>
            <el-table-column
                    prop="none"
                    label="无网点">
            </el-table-column>
            <el-table-column
                    prop="has"
                    label="有网点">
            </el-table-column>
            <el-table-column
                    prop="b"
                    label="含B网点"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="b_plus"
                    label="含B+网点"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="total"
                    label="总网格数">
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
  import {mapState} from 'vuex'
  import Lnglat from '../../../../../other_modules/like-model/models/Lnglat'
  import {mapControl} from "../js/mapControl";

  const CountArea = {
    235: [
      {
        name: '二环',
        show: true,
        level: 2,
        path: require('../js/cd_2')
      },
      {
        name: '三环',
        show: true,
        level: 1,
        path: require('../js/cd_3')
      }
    ],
    197: [{
      name: '限行区',
      show: true,
      level: 1,
      path: require('../js/k4t4.json')
    }]
  }

  export default {
    name: "count",
    data () {
      return {
        dataReady:false,

        countArea: [],
        areas_count:[],
        tableData: [],

        showCountAreaName:''
      }
    },
    computed: {
      ...mapState(['city_id','rects','branches'])
    },
    methods:{
      count(){
        console.time('matchBranchWithRect')
        console.time('matchBranchAndCount')
        let branches = this.branches.concat()
        this.areas_count = this.rects.map(item=>{
          let match = []
          branches.forEach((branch,index)=>{
            if(item.inBounds(new Lnglat(branch.lng, branch.lat))){
              match.push(index)
              item.branches.push(branch)
            }
          })
          match.reverse().forEach(item=>branches.splice(item,1))
          return item
        })
        console.timeEnd('matchBranchWithRect')

        let data = this.countArea.map(item => {
          return {
            name: item.name,
            none: 0,
            has: 0,
            b: 0,
            b_plus: 0,
            total: 0
          }
        }).concat([{
          name: '全部',
          none: 0,
          has: 0,
          b: 0,
          b_plus: 0,
          total: 0
        }])
        let data_last = data.length - 1

        this.areas_count.forEach(item => {
          item.getCountAreaResult(this.countArea)
          this.countArea.forEach((countArea, index) => {
            if (item.areaResult[index]) {
              data[index].total++
              if (item.branches.length > 0) {
                data[index].has++
                if (item.branches.some(branch => Number(branch.biz_type) === 0)) {
                  data[index].b++
                }
                if (item.branches.some(branch => Number(branch.biz_type) === 1)) {
                  data[index].b_plus++
                }
              } else {
                data[index].none++
              }
            }
          })

          data[data_last].total++
          if (item.branches.length > 0) {
            data[data_last].has++
            if (item.branches.some(branch => Number(branch.biz_type) === 0)) {
              data[data_last].b++
            }
            if (item.branches.some(branch => Number(branch.biz_type) === 1)) {
              data[data_last].b_plus++
            }
          } else {
            data[data_last].none++
          }
        })
        this.tableData = data
        console.timeEnd('matchBranchAndCount')
        this.dataReady = true
      },
      closeCount(){
        let modules = this.$store.state.checkedModules.concat()

        let index = modules.indexOf('统计')
        if (index > -1) {
          modules.splice(index,1)
          this.$store.commit('setCheckedModules', modules)
        }
      },

      mouseEnter(row){
        if(this.showCountAreaName !== row.name){
          this.showCountAreaName = row.name
          let _countArea = this.countArea.find(item=>item.name === this.showCountAreaName)
          if(_countArea)mapControl.showCountArea(_countArea.path)
        }
      },
      mouseLeave(){
        if(this.showCountAreaName){
          this.showCountAreaName = ''
          mapControl.hideCountArea()
        }
      }
    },
    created () {
      this.countArea = CountArea.hasOwnProperty(this.city_id) ? CountArea[this.city_id] : []
    },
    mounted(){
      setTimeout(this.count,100)
    },
    beforeDestroy () {
      this.$store.commit('setCheckedModules', this.$store.state.checkedModules.filter(item => item !== '统计'))
    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";
    .count {
        position: absolute;
        top: 10px;
        left: 10px;

        .loadingBox{
            width: 100%;
        }
    }
</style>