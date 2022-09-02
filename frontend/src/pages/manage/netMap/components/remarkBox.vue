<template>
    <el-card class="box-card remarkBox">
        <div class="header">
            <span>
                <i class="iconfont icon-guanbi" @click="closeRemark"></i>
            </span>
        </div>

        <div class="item">
            <span>编号：</span>
            <span>{{remark_rect_id}}</span>
        </div>

        <div class="item">
            <el-table
                    v-loading="!dataReady"
                    :data="remark_list"
                    empty-text="暂无备注"
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="时间"
                        align="center"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="操作人"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        align="center"
                        label="备注">
                </el-table-column>
            </el-table>
        </div>

        <div class="item" v-if="dataReady && type==='view'">
            <el-tooltip content="新增备注" placement="bottom">
                <el-button size="mini" icon="el-icon-edit" @click="()=>{this.type='new'}"/>
            </el-tooltip>
        </div>

        <div class="item" v-if="type==='new'">
            <span>备注：</span>
            <span class="inline-block">
                <el-input
                        class="width"
                        type="textarea"
                        maxlength="100"
                        autosize
                        placeholder="请输入备注，小于100字"
                        size="mini"
                        v-model.trim="remark">
                </el-input>
            </span>
        </div>

        <div class="item" v-if="type==='new'">
            <el-button size="small" type="primary" :disabled="!couldSave" @click="save" style="marginTop:10px;width:100%" >保存备注</el-button>
        </div>

    </el-card>
</template>

<script>
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getAdminUrl} from "../js/getAdminUrl";
  import format from '../../../../../other_modules/like-function/format'
  import {mapControl} from '../js/mapControl'

  export default {
    name: "remarkBox",
    data(){
      return {
        remark:'',
        remark_list:[],
        dataReady:false,
        type:'view'
      }
    },
    computed:{
      couldSave(){
        return Boolean(this.remark)
      },
      remark_rect_id(){
        return this.$store.state.remark_rect_id
      }
    },
    watch:{
      remark_rect_id(){
        this.dataReady = false
        this.type = 'view'
        this.remark = ''
        this.remark_list = []
        this.getRemarkList()
      }
    },
    methods:{
      closeRemark(){
        mapControl.clearRemarkRect()
      },
      getRemarkList(){
        this.dataReady = false

        myAjax.post(getAdminUrl('/branch-area/get-remark'),{
          rect_id:this.remark_rect_id
        }).then(res=>{
          this.remark_list = res.data.sort((a,b)=>a.time-b.time).map(item=>{
            return {
              date:format.time(item.time,0),
              name:item.realname,
              remark:item.remark
            }
          })
          this.dataReady = true
        })
      },
      save(){
        let remark = this.remark
        this.remark = ''
        myAjax.post(getAdminUrl('/branch-area/set-rect-remark'),{
          rect_id:this.remark_rect_id,
          remark:remark
        }).then(res=>{
          if(res.status === 0){
            this.type = 'view'
            this.getRemarkList()
          }else{
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        }).catch(err=>{
          this.$message({
            message: '保存失败',
            type: 'error'
          });
        })
      }
    },
    created(){
      this.getRemarkList()
    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";

.remarkBox{
    margin-top: 10px;
}
</style>