<template>
    <div id="checkdinspection">
        <div class="show">
            *请检查以下项并选择是否正常，<img src="../images/highlinefinsh.png"/>按键代表正常，
            <img src="../images/abnormal.png"/>按键代表异常
        </div>
        <!-- 部位-->
        <div class="car-part" v-for="(item,index) in itemlist" :class="index==4?'last-more':''">
            <div class="top">
                <img src="../images/linelength.png"/>
                <span v-if="index==4">选查项(未要求安装可不操作)</span>
                <span v-else>{{item.name}}</span>
                <img src="../images/linelength.png"/>
            </div>
            <div class="content">
                <div class="parts" v-for="child in item.child">
                    <div class="parts-text">
                        {{child.name}}
                    </div>
                    <div class="parts-img"  v-if="child.status==1">
                        正常
                    </div>
                    <div class="parts-img parts-color"  v-else>
                        异常
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkdinspection.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            itemlist:[]
        }
    }
    ,
    created()
    {
        this.getresult();
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
    }
    ,
    methods: {
        //获取巡检操作项
        getresult(){
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                mobile: sessionStorage.getItem('mobile'),
                order_id: _this.$route.query.id, //工单id
                item_id:3
            }).then(data=>{
                if(data.status==0){
                    if(data.data.items.length>0){
                        _this.itemlist=data.data.items;
                    }
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
    }
    }
</script>