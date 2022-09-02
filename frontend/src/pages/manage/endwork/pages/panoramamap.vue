<template>
    <div id="panoramamap">
        <div id="panorama"></div>
    </div>
</template>
<script>
    require("../css/panoramamap.css")
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            netlng:'',
            netlat:''//网点经纬度
        }
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {
        $("#like-waterMark").show();
    }
    ,
    mounted()
    {
        $("#like-waterMark").hide();
        $("#panorama").height(window.innerHeight);
        if(this.$route.query.netlng && this.$route.query.netlat){
            this.netlng=this.$route.query.netlng;
            this.netlat=this.$route.query.netlat;
            let that=this;
            //定位坐标转换
            const coordtransform = require('coordtransform')
            var net_point = coordtransform.gcj02tobd09(that.netlng, that.netlat);//当前为数组,高德转百度
            var map = new BMap.Map('panorama');
            map.centerAndZoom(new BMap.Point(net_point[0], net_point[1]), 12);
            map.addTileLayer(new BMap.PanoramaCoverageLayer());

            var panorama = new BMap.Panorama('panorama');
            panorama.setPov({heading: -40, pitch: 6});//设置当前全景的视角
            panorama.setPosition(new BMap.Point(net_point[0], net_point[1])); //根据经纬度坐标展示全景图
        }else{
            this.$_LIKE_toast("暂未获取到网点的经纬度")
            setTimeout(function(){
                window.history.back();
            },2000)
        }
    }
    ,
    methods: {
    }
    }
</script>