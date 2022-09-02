<template>
    <div class="Search">
        <div class="header">
            <div class="search-box">
                <span class="search-icon icon"></span>
                <input ref="search" type="text" v-model="keyword" :placeholder="placeholder" @input="preSearch" class="search" />
                <span class="clear-icon icon" v-if="keyword" @click="keywordClear"></span>
            </div>
        </div>

        <div class="content">
            <div class="history" v-if="!keyword" v-show="history.length > 0">
                <div class="title">
                    搜索历史：
                    <span class="his-clear float-right" @click="historyClear">清空</span>
                </div>
                <ul class="his-list">
                    <li class="his-item" v-for="item in historyReverse" :key="item" @click="historyClick(item)">{{item}}</li>
                </ul>
            </div>
            <div class="result" v-else>
                <div class="empty" v-if="result.length === 0">{{emptyText}}</div>
                <ul class="res-list">
                    <li class="res-item" v-for="item in result" :key="item.id" @click="resultClick(item)">
                        <div class="main">{{item.name}}</div>
                        <div class="sub">{{item.desc}}</div>
                    </li>
                </ul>
            </div>
        </div>

    </div>

</template>

<script>
    import searchData from '../js/searchData'
    import {getOspApiUrl} from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV3'

  export default {
    name: "searchPlate",
    data(){
      return {
        // 1:搜车牌
        type:1,
        placeholder:'请输入车牌号',
        keyword:'',
        history:[],

        // 1：搜索模式，搜索中；2：搜索模式，展示结果
        mode:1,

        searchTag:0,
        result:[]
      }
    },
    computed:{
      historyReverse(){
        return this.history.reverse()
      },
      emptyText(){
        return this.mode === 1 ? '正在搜索"'+this.keyword+'"...' : '未查询到"'+this.keyword+'"相关结果'
      }
    },
    methods:{
      keywordClear (){
        this.keyword = ''
        this.preSearch()
      },
      historyPush(word){
        if(!this.history.includes(word)){
          // 最长存储10条
          if(this.history.length === 10)this.history.splice(0,1)

          this.history.push(word)
          searchData.save({history:this.history})
        }
      },
      historyClear(){
        let that = this
        this.$_LIKE_confirm({
          title:"清空搜索历史？",
          confirmButtonCallback:function(){
            that.history = []
            searchData.save({history:that.history})
          }
        })
      },
      historyClick(keyword){
        this.keyword = keyword
        this.search()
      },

      preSearch(){
        this.mode = 1
        this.result = []
        if(this.keyword !== ''){

          if(this.searchTag)clearTimeout(this.searchTag)

          this.searchTag = setTimeout(this.search, 400)
        }
      },
      search(){
        if(!this.keyword)return

        this.searchTag = 0

        myAjax.post(getOspApiUrl('/vehicle-problem/search'),{
          kw:this.keyword
        }).then(res=>{
          this.mode = 2
          if(res.status === 0){
            if(res.data instanceof Array){
              // 搜索结果为空
              this.result = []
            }else{
              this.result = this._resultFormat(res.data.car)
            }

          }else{
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err=>{
          console.log(err)
        })

      },
      resultClick(item){
        this.historyPush(item.name)
        switch (this.type){
          case 1:
            window.location.href = '../manageOrderLostManagement/index.html#/list?search_id='+item.id+'&search_name='+item.name
            break;
          default:
            console.log(item)
        }
      },

      _resultFormat(array){
        return array.map(item=>{
          switch(this.type){
            case 1:
              // 只查车牌
              return {
                id:item.id,
                name:item.plate_no,
                desc:item.vin
              }
            default:
              return item
          }
        })
      }
    },
    created(){
      if(searchData.state.history)this.history = searchData.state.history

      if(this.$route.query.type)this.type = Number(this.$route.query.type)
    },
    mounted(){
      this.$refs.search.focus()
    }
  }
</script>

<style lang=less scoped>
.Search{
    min-height: 100vh;
    .header{
        position: fixed;
        width: 100%;
        top:0;
        padding: 0.1rem 0.2rem;
        box-sizing: border-box;
        border-bottom: solid 1px #dbdbdb;
        background-color: #fff;
        .search-box{
            width: 100%;
            position: relative;
            .icon{
                position: absolute;
                width: 0.4rem;
                height: 0.4rem;
                background: no-repeat center;
                top:0;
                &.search-icon{
                    left:0.05rem;
                    background-image: url('../images/icon_search.png');
                    background-size: 50%;
                }
                &.clear-icon{
                    right:0.05rem;
                    background-image: url('../images/icon_clear.png');
                    background-size: 60%;
                }
            }
            .search{
                font-size: 14px;
                color:#111;
                margin:0;
                padding: 0 0.5rem;
                box-sizing: border-box;
                border:none;
                height: 0.4rem;
                width: 100%;
                border-radius: 0.2rem;
                background-color: #f0f0f0;
            }
        }
    }
    .content{
        padding: 0.75rem 0 0.2rem;
        .history{
            padding: 0 0.2rem;
            .title{
                color:#333;

                .his-clear{
                    color:#8a8a8a;
                    line-height: 0.2rem;
                    padding-left: 0.18rem;
                    background: url('../images/icon_delete.png') no-repeat left;
                    background-size: auto 80%;
                }
            }


            .his-list {
                margin: 0 -0.05rem;
                .his-item {
                    color:#666;
                    font-size: 13px;
                    background-color: #f0f0f0;
                    display: inline-block;
                    box-sizing: border-box;
                    padding: 0.05rem 0.15rem;
                    border-radius: 0.15rem;
                    margin: 0.05rem;
                }
            }
        }

        .result{
            .empty{
                font-size: 13px;
                padding: 1rem 0;
                color:#aaa;
                text-align: center;
            }
            .res-list{
                padding-left: 0.2rem;
                .res-item{
                    padding: 0.1rem 0;
                    border-bottom: solid 1px #dbdbdb;
                    .sub{
                        color:#999;
                        font-size: 13px;
                    }
                }
            }
        }
    }
}
</style>
