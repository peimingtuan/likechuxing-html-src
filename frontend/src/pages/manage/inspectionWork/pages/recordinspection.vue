<template>
    <div id="recordinspection">
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
                    <div class="parts-img"  v-if="child.version==1">
                        <img class="abnormal" @click="abnormal(index,child)" src="../images/abnormal.png"/>
                        <img @click="normal(index,child)"  src="../images/highlinefinsh.png"/>
                    </div>
                    <div class="parts-img"  v-else-if="child.version==2">
                        正常
                    </div>
                    <div class="parts-img parts-color"  v-else>
                        异常
                    </div>
                </div>
            </div>
        </div>
        <!--回退-->
        <div class="recall" @click="recall()">
            <img src="../images/recall.png"/>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/recordinspection.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Button from '../component/bottomBtn'
    export default{
        name: "recordinspection",
        components: {
            Button
        },
        data ()
    {
        return {
            itemlist:[],
            idarray:[],
            domarray:[],
            recordlist:[],
            recordid:[],
            val:[],
            length:3,
            showsubmit:true,//底部按钮
            text:'提交'
        }
    }
    ,
    created()
    {
        this.getitem();
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
        //操作记录
        record(){
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                mobile: sessionStorage.getItem('mobile'),
                order_id: _this.$route.query.id, //工单id
                item_id:3
            }).then(data=>{
                if(data.status==0){
                    if(data.data.items.length>0){
                        _this.recordlist=data.data.items;
                        for(var i=0;i<_this.recordlist.length;i++){
                            for(var j=0;j<_this.recordlist[i].child.length;j++){
                                _this.recordid.push({id:_this.recordlist[i].child[j].id,status:_this.recordlist[i].child[j].status})
                            }
                        }
                        for(var i=0;i<_this.itemlist.length;i++){
                            for(var j=0;j<_this.itemlist[i].child.length;j++){
                                for(var z=0;z<_this.recordid.length;z++){
                                    if(_this.itemlist[i].child[j].id==_this.recordid[z].id){
                                        _this.itemlist[i].child[j].version=Number(_this.recordid[z].status)+1;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
        //获取巡检项
        getitem(){
            myAjax.post(getApiUrl('/vehicle-inspection/config'),{
                mobile:sessionStorage.getItem("mobile")
            }).then(data=>{
                if(data.status==0){
                    this.itemlist=data.data;
                    if(this.$route.query.record){
                        this.record();
                    }
                }else{
                    this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
        //正常
        normal(index,child){
            child.version=2;
            this.idarray.push(child.id)
            this.val.push(1);
            this.domarray.push(index)
            this.showsubmit=false;
        },
        //异常
        abnormal(index,child){
            child.version=3;
            this.idarray.push(child.id)
            this.val.push(2);
            this.domarray.push(index)
            this.showsubmit=false;
        },
        //回退
        recall(){
            if(this.idarray.length>0&&this.length>0){
                let index=this.domarray.length-1;
                let arr = this.itemlist[this.domarray[index]].child;
                let id=this.idarray[index];
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id==id){
                        arr[i].version=1;
                        break;
                    }
                }
                this.idarray.pop();
                this.domarray.pop();
                if(this.idarray.length==0){
                    this.showsubmit=true;
                }
                this.length--;
            }else{
                this.$_LIKE_toast("不能撤销")
                if(this.length==0){
                    this.length=3;
                }
            }
        },
        //提交
        submitInfo(){
            let _this=this;
            $.post(getApiUrl('/vehicle-inspection/operate'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id: _this.$route.query.id, //工单id
                item_id:3,
                params:{
                    key:_this.idarray.toString(),
                    val:_this.val.toString(),
                    surface:sessionStorage.getItem("returnsingleArray").toString()//key值
                }
            },function (data) {
                if(data.status=='0'){
                    _this.$router.push({
                        path:'/workdetail',
                        query:{
                            id:_this.$route.query.id //工单id
                        }
                    })
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            })
        }
    }
    }
</script>