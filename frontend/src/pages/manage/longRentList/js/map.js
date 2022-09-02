class likeMap {
    constructor(){
        this.defaultMarkerGroup = []
        this.activeMarkeGroup = []
    }
    initMap(op){
        let center = op.center || [116.2999391556, 40.0451932145]
        this.map = new AMap.Map(op.el, {
            resizeEnable: true,
            zoom: 16,
            center
        });
        
        var _this = this;
        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {//拖动定位图标
            const positionPicker = new PositionPicker({
                position: center,
                mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                iconStyle: {//自定义外观
                    url: require("../images/location.png"),//图片地址
                    size: [25, 50],  //要显示的点大小，将缩放图片
                    ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                },
                map: _this.map
            });
            positionPicker.on('success', function (positionResult) {
                op.moveCenter && op.moveCenter(positionResult)
            });
            positionPicker.start();
        });
        return this.map
    }
    initStaticMap(op){
        let center = op.center || [116.2999391556, 40.0451932145]
        this.map = new AMap.Map(op.el, {
            resizeEnable: true,
            zoom: 16,
            center
        });
        return this.map
    }
    addMarker(obj,currentBranchId,onMarkerClick) {
        let point = [ Number(obj.lng), Number(obj.lat) ]
        let classtype = '';
        if (obj.biz_type == '0') {
            classtype = 'marker-route2';
        } else {
            classtype = 'marker-route';
        }
        let marker = new AMap.Marker({
            position: point,
            offset: new AMap.Pixel(-20.5, -48),
            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + obj.car_num + '</span></div></div>',   //自定义点标记覆盖物内容
            map: this.map//创建时直接赋予map属性
        });
        this.defaultMarkerGroup.push(marker)
        marker.show()
        if(currentBranchId && obj.branch_id == currentBranchId){
            marker.hide()
        }
        const _this = this;
        marker.on('touchend',function(){
            _this.defaultMarkerGroup.map(item=>{
                item.show()
            })
            this.hide()
            let index = _this.defaultMarkerGroup.indexOf(this)
            _this.activeMarkeGroup.map(item=>{
                item.hide()
            })
            _this.activeMarkeGroup[index].show()
            onMarkerClick && onMarkerClick(obj)
        })
    }
    addActiveMarker(obj,currentBranchId,onMarkerClick) {
        let point = [ Number(obj.lng), Number(obj.lat) ]
        let classtype = '';
        if (obj.biz_type == '0') {
            classtype = 'bigmarker-route2';
        } else {
            classtype = 'bigmarker-route';
        }
        let activeMarker= new AMap.Marker({
            position: point,
            offset: new AMap.Pixel(-20.5, -48),
            zIndex:103,
            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + obj.car_num + '</span></div></div>',   //自定义点标记覆盖物内容
            map: this.map
        });
        this.activeMarkeGroup.push(activeMarker)
        activeMarker.hide()
        if(currentBranchId && obj.branch_id == currentBranchId){
            activeMarker.show()
        }
        // $('.amap-marker .div1 .span1').css('background-color','#666');
        activeMarker.on('click', function () {
            onMarkerClick && onMarkerClick(obj)
        });
    }
}
export default new likeMap()