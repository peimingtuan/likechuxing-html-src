<template>
    <el-card class="box-card branchBox">
        <div class="header">
            <span>
                <i class="iconfont icon-guanbi" @click="closeBranch"></i>
            </span>
        </div>

        <div class="item">
            网点名称：<a class="link" :href="'/branch/detail?id='+current_branch.id" target="_blank">{{current_branch.name}}</a>
        </div>

        <div class="item">
            网点类型：{{current_branch.biz_type === '0' ? 'B' : 'B+'}}
        </div>

        <div class="item">
            所属片区：{{area_name}}
        </div>

    </el-card>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "branchBox",
    computed: {
      ...mapState(['current_branch']),
      area_name(){
        console.log(this.current_branch)
        console.log(this.$store.state.areas)
        console.log(this.$store.state.rects)

        let rects = this.$store.state.rects.filter(item=>item.branches.length>0)
        console.log(rects)
        let rect = rects.find(rect=>rect.branches.some(branch=>{
          return branch.id===this.current_branch.id
        }))

        console.log(rect)
        if(rect.area_id){
          return this.$store.state.areas.find(area=>area.id===rect.area_id).name
        }else{
          return '无'
        }
      }
    },
    methods:{
      closeBranch(){
        this.$store.commit('setCurrentBranch',null)
      }
    },
    mounted(){

    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";
.branchBox{
    margin:10px 0;

    .item{
        margin-top: 0;
    }

    .link{
        color:blue;
    }
}
</style>