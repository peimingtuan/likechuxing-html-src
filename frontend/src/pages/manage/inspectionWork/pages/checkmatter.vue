<template>
    <div id="checkmatter">
        <div class="top" v-if="saveid2.length>0">
            <p>已添加的物料</p>
            <div class="top-div" v-for="(item,index) in saveid2">
                <div class="div1">
                    {{item.item_type_name}}-{{item.item_name}}
                </div>
                <div class="div2">
                    {{item.item_num}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkmatter.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            saveid2:[],
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
        //获取操作结果
        getresult(){
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                mobile: sessionStorage.getItem('mobile'),
                order_id: _this.$route.query.id, //工单id
                item_id:4
            }).then(data=>{
                if(data.status==0){
                    if(data.data.length>0){
                        _this.saveid2=data.data;
                    }
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        }
    }
    }
</script>