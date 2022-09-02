<template>
  <div class="SearchPoint">
    <div class="search-con clearfix">
      <div class="input-con float-left">
        <input type="text" autofocus @input="searchKeyword" v-model="keyword" placeholder="请输入还车的目的地" class="input" />
      </div>
      <div class="float-right" @click="cancelBtn">取消</div>
    </div>

    <div class="result-con clearfix" v-if="search_result.length === 0 && active_branch" @click="selectBranch">
      <div class="icon-con start float-left"></div>
      <div class="name float-left" :class="{double:!active_branch.address}">{{active_branch.name}}</div>
      <div class="address float-left">{{active_branch.address}}</div>
    </div>

    <div class="result-list" v-if="search_result.length>0">
      <div class="result-con clearfix" v-for="item in search_result" @click="()=>selectPoint(item)">
        <div class="icon-con add float-left"></div>
        <div class="name float-left">{{item.name}}</div>
        <div class="address float-left length-limit">{{item.address}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {MAP_END_BRANCH} from "../js/mapControl";

  const endBranchMap = new MAP_END_BRANCH()

  export default {
    name: "search-point",
    data(){
      return {
        active_branch:false,
        next_search:null,
        keyword:'',
        search_result:[]
      }
    },
    computed: {
    },
    methods:{
      cancelBtn(){
        if(this.keyword){
          this.keyword = ''
          this.search_result = []
        }else{
          this.$router.go(-1)
        }
      },
      searchKeyword(){
        // 输入不为空且停止输入0.5秒后才触发搜索
        if(this.keyword!==''){
          if(this.next_search!==null){
            clearTimeout(this.next_search)
          }

          this.next_search = setTimeout(()=>{
            endBranchMap.search(this.keyword, res=>{
              this.next_search=null
              this.search_result = res
            })
          },500)
        }
      },
      selectBranch(){
        this.$store.commit('branch/setEndBranch',this.active_branch)
        this.$router.go(-2)
      },
      selectPoint(poi){
        this.$store.commit('setMapCenterEndBranch',poi)
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .SearchPoint{
    background-color: #f2f2f2;
    .search-con{
      background-color: #fff;
      width: 100%;
      padding: 0.08rem 0.15rem;
      box-sizing: border-box;
      line-height: 0.28rem;
      border-bottom: solid 1px #dfdfdf;
      .input-con{
        padding: 0 0.1rem;
        box-sizing: border-box;
        width:3rem;
        height: 0.28rem;
        border-radius: 2px;
        background-color: #efefef;
        text-align: left;
        .input{
          float: left;
          background: transparent;
          border:none;
          outline: none;
          width: 2.4rem;
          color:#111;
          font-size: 0.14rem;
          height: 0.28rem;
        }
        &::before{
          content: '';
          display: block;
          float: left;
          width: 0.28rem;
          height: 0.28rem;
          background: url('../images/搜索copy2@3x.png') no-repeat center;
          background-size: 60%;
        }
      }
    }
    .result-con{
      background-color: #fff;
      padding:0.08rem 0.15rem;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color:#999;
      border-bottom: solid 1px #f2f2f2;
      &:nth-last-of-type(1){
        border-bottom: none;
      }
      .icon-con{
        width: 0.3rem;
        height: 0.4rem;
        background:no-repeat center;
        background-size: 60% auto;
        &.start{
          background-image: url(../images/search/搜索同取车网点@3x.png);
        }
        &.add{
          background-image: url(../images/search/搜索网点@3x.png);
        }
      }
      .name,.address{
        text-align: left;
        width: 3rem;
        &.double{
          line-height: 0.4rem;
        }
      }
      .length-limit{
        overflow: hidden;
        height: 0.2rem;
      }
      .name{
        font-size: 0.15rem;
        color:#111;
      }
    }
  }
</style>
