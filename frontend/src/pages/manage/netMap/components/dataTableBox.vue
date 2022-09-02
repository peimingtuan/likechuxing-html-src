<template>
    <el-card class="box-card data-table">
        <div class="header">
            <span>
                <i class="iconfont icon-guanbi" @click="close"></i>
            </span>
        </div>
        <el-table
                v-loading="!dataReady"
                :data="data[page] || []"
                border
                height="450"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期">
            </el-table-column>
            <el-table-column
                    prop="city"
                    label="城市">
            </el-table-column>
            <el-table-column label="网格数据">
                <el-table-column
                        prop="rect_total"
                        label="网格总数"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="rect_none"
                        label="无网点"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="rect_has"
                        label="有网点">
                </el-table-column>
            </el-table-column>

            <el-table-column label="网点数据">
                <el-table-column
                        prop="branch_b"
                        label="B网点"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="branch_b_plus"
                        label="B+网点"
                        width="100">
                </el-table-column>
            </el-table-column>


        </el-table>
        <div class="btn-con" v-if="total>limit">
            <el-pagination
                    background
                    :page-size="limit"
                    layout="prev, pager, next"
                    @current-change="currentChange"
                    :total="total">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
  import {mapState} from 'vuex'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getAdminUrl} from "../js/getAdminUrl";

  export default {
    name: "count",
    data () {
      return {
        dataReady: false,

        no_more:false,

        data: {},
        total:0,

        limit: 14,
        page:1
      }
    },
    computed:{
      ...mapState(['city_id'])
    },
    methods: {
      close () {
        this.$store.commit('setDataTableShow', false)
      },

      currentChange(page){
        this.page = page

        if(!this.data[page]){
          this._getData()
        }
      },

      _getData(){
        console.log('get')
        this.dataReady = false
        return myAjax.post(getAdminUrl('/branch-area/get-rect-stats'), {
          city_id:this.city_id,
          limit: this.limit,
          offset: this.limit*(this.page-1)
        }).then(res => {
          console.log(res)
          if(res.status === 0){
            this.data[this.page] = res.data.list
            this.total = Number(res.data.total)
            this.dataReady = true

            if(this.data.length === this.total){
              this.no_more = true
            }
          }else{

          }
        })
      }
    },
    created () {
     this._getData()
    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";

    .data-table {
        position: absolute;
        top: 50px;
        left: 100px;
        right: 100px;
        z-index: 30;

        .header{
            margin-bottom: 10px;
        }

        .loadingBox {
            width: 100%;
        }

        .btn-con{
            margin:10px 0;
            width: 100%;
            text-align: right;
        }
    }
</style>