<template>
    <el-card class="box-card areaTool">
        <div class="item">
            <span>城市：</span>
            <el-select v-model="city_id" disabled placeholder="请选择" class="width" size="mini">
                <el-option
                        v-for="item in city_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>

        <div class="item" v-if="type==='new'">
            <span>名称：</span>
            <span class="inline-block">
                <el-input
                        class="width"
                        maxlength="10"
                        :placeholder="namePlaceHolder"
                        v-model.trim="name"
                        size="mini"
                        clearable>
                </el-input>
            </span>
        </div>

        <div class="item" v-else>
            <span>名称：</span>
            <span class="inline-block">
                <el-input
                        class="width"
                        placeholder="请在地图上点选片区"
                        v-model="active_area.name"
                        size="mini"
                        disabled
                        clearable>
                </el-input>
            </span>
        </div>

        <div class="item" v-if="type!=='view'">
            <span>绘制方式：</span>
            <span class="inline-block">
                <el-switch
                        v-model="drawType"
                        active-text="拖拽"
                        inactive-text="点选"
                        size="mini"
                        @change="typeChange">
                </el-switch>
            </span>
        </div>

        <div class="item" v-if="type!=='view'">
            <span>片区颜色：</span>
            <span class="inline-block">
                 <el-color-picker v-model="color_body" size="mini"></el-color-picker>
            </span>

            <span style="margin-left:10px">边框：</span>
            <span class="inline-block">
                 <el-color-picker v-model="color_border" size="mini"></el-color-picker>
            </span>
        </div>

        <div class="item" v-if="type === 'view' && active_area.id">
            <div>
                <el-button size="small" type="primary" style="width:100%" @click="editArea">编辑片区</el-button>
            </div>
            <div style="margin-top: 10px">
                <el-button size="small" type="danger" style="width:100%" @click="deleteArea">删除片区</el-button>
            </div>

        </div>

        <div class="item">
            <el-button v-if="type==='view'" size="small" type="primary" style="width:100%" @click="newArea">新建片区</el-button>
            <el-button v-if="type==='new' || type==='edit'" size="small" type="primary" :disabled="!couldSave" style="width:100%" @click="saveArea">保存片区</el-button>
        </div>

        <div class="item">
            <el-button size="small" style="width:100%" @click="back">返回</el-button>
        </div>

    </el-card>
</template>

<script>
  import {mapControl} from '../js/mapControl'
  import {mapState} from 'vuex'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getAdminUrl} from "../js/getAdminUrl";

  export default {
    name: "areaTool",
    data () {
      return {
        type:'view',
        name: '',
        drawType:false,
      }
    },
    computed:{
      ...mapState(['city_list','city_id','rects','areas','active_area']),
      color_body:{
        get(){
          return this.$store.state.color_body
        },
        set(val){
          this.$store.commit('setColor',{
            color_body:val
          })
          mapControl.updateColor()
        }
      },
      color_border:{
        get(){
          return this.$store.state.color_border
        },
        set(val){
          this.$store.commit('setColor',{
            color_border:val
          })
          mapControl.updateColor()
        }
      },
      city_id(){
        return this.$store.state.city_id
      },
      namePlaceHolder(){
        switch(this.type){
          case 'view':
            return "请在地图上点选片区"
          case 'new':
            return '请输入片区名称'
          default:
            return '请输入片区名称'
        }
      },
      couldSave(){
        return Boolean(this.name)
      }
    },
    methods:{
      back(){
        switch(this.type){
          case 'new':
            this.type = 'view'
            mapControl.clearEditArea()
            this.deleteChange()
            mapControl.showArea()
            break;
          case 'edit':
            this.type = 'view'
            mapControl.clearEditArea()
            this.deleteChange()
            mapControl.showArea()
            break;
          default:
            this.$router.back()

        }

      },
      typeChange(val){
        if(val){
          mapControl.startMouseTool()
          mapControl.endRectClick()
        }else{
          mapControl.startRectClick()
          mapControl.endMouseTool()
        }
      },
      deleteChange(){
        if(this.drawType){
          mapControl.endMouseTool()
        }else{
          mapControl.endRectClick()
        }
      },
      newArea(){
        this.type = 'new'
        this.name = ''
        this.drawType = false

        mapControl.hideArea()
        mapControl.startRectClick()
      },
      editArea(){
        this.type = 'edit'
        this.drawType = false
        this.name = this.active_area.name

        this.$store.commit('setColor',{
          color_body:this.active_area.color,
          color_border:this.active_area.color_border
        })
        mapControl.hideAreaExclude(this.active_area.id)
        mapControl.startRectClick()
      },
      saveArea(){
        let rects = mapControl.getActiveRects()
        if(rects.length === 0){
          this.$message({
            type: 'waring',
            message: '请选择区域'
          });
          return
        }

        if(this.drawType){
          mapControl.endMouseTool()
        }else{
          mapControl.endRectClick()
        }

        let url = this.type === 'new' ? '/branch-area/create-area' :'/branch-area/edit-area'
        let data = {
          city_id:this.city_id,
          color:this.color_body,
          color_border:this.color_border,
          rect_ids:rects.map(rect=>rect.id),
          name:this.name
        }
        if(this.type === 'edit')data.area_id = this.active_area.id
        this.name = ''

        myAjax.post(getAdminUrl(url),data).then(res=>{
          this.$message({
            type: 'success',
            message: this.type==='new'?'新建成功!':'修改成功！'
          });

          this.type = 'view'

          this.updateRectAndArea()
        }).catch(err=>{
          console.log(err)
        })
      },
      deleteArea(){
        this.$confirm('确认删除名为 '+this.active_area.name+' 的片区', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认删除',
          cancelButtonText: '取消'
        }).then(()=>{
          return myAjax.post(getAdminUrl('/branch-area/delete-area'),{
            area_id:this.active_area.id
          })
        }).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

          this.$store.commit('setAreaId',0)
          this.updateRectAndArea()
        }).catch(err=>{
          console.log('取消删除',err)
        })
      },
      updateRectAndArea(){
        let loading = this.$loading({
          lock: true,
          text: '正在更新片区数据....',
        });

        this.$store.dispatch('getAreas',{id:this.city_id}).then(()=>{
          return mapControl.drawRects(this.rects)
        }).then(()=>{
          mapControl.drawArea()
          loading.close()
        })
      }
    },
    mounted(){
      mapControl.drawArea()
    },
    beforeDestroy(){
      this.deleteChange()
      this.$store.commit('setAreaId',0)
      //mapControl.clearEditArea()
      mapControl.clearArea()
      //mapControl.startRemark()
      /*mapControl.drawRects(this.$store.state.rects).then(()=>{
        mapControl.startRemark()
      })*/
    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";

    .areaTool {
        overflow: hidden;

        .extend {
            width: 50%;
        }
    }
</style>