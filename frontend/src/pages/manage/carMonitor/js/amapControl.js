/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: amapControl.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/30-下午4:50
 Description:
 Param:
 Return:
 *************************************************/
import toast from "../../../activity/spread/js/toast";
import Reflux from 'reflux'

const carInfoWindowBox = require('../template/carInfoWindowForAMap.pug')
import Time from '../../../../js/function/Time'
import CarActions from '../component/Stores/CarActions'
import BranchActions from '../component/Stores/BranchActions'
import carStatus from '../../../../js/database/carStatus.json'

const Base = {
    // base
    map: null,
    map_fence:null,
    AMap: window.AMap,
    AMapUI: window.AMapUI,
    PointSimplifier: null,
    PathSimplifier: null,

    geocoder: null,

    //初始化地图
    initMap: function () {
        this.map = new this.AMap.Map('mapContainer', {
            resizeEnable: true,
            zoom: 5,
            // 西安，中国中心
            center: [108.894324, 34.285013]
        });

        // 初始化UI组件
        if (this.PointSimplifier === null || this.PathSimplifier === null) {
            this.AMapUI.load(['ui/misc/PointSimplifier', 'ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function (PointSimplifier, PathSimplifier, $, utils) {
                if (!PointSimplifier.supportCanvas) {
                    console.log('当前环境不支持 Canvas！');
                    return;
                }
                // 海量点控件
                this.PointSimplifier = PointSimplifier
                // 轨迹控件
                this.PathSimplifier = PathSimplifier
            }.bind(this));
        }

        if (typeof AMap.Geocoder === 'undefined') {
            this.map.plugin(["AMap.Geocoder"], function () {
                this.geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "base"
                });
            }.bind(this))
        }


        /*

        this.geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        */
    },

    initMapFence: function () {
        this.map_fence = new this.AMap.Map('map_fence', {
            resizeEnable: true,
            zoom:11
        });
        this.map_fence.plugin("AMap.PolyEditor",function(){})
    },

    // 显示/隐藏 monitor图层组
    toggleMonitorLayerGroup: function (opt) {
        if (opt.showMonitor) {
            this.destroyCarTrack()
            if (this.carsLayer !== null) {
                if (opt.showAllCars) {
                    this.carsLayer.show()
                }
            }
            if (this.plateNoLayer !== null) {
                if (opt.showPlateNo) {
                    this.plateNoLayer.show()
                }
            }
            if (this.branchesLayer !== null) {
                if (opt.showBranch) {
                    this.branchesLayer.show()
                }
            }
        } else {
            if (this.carsLayer !== null) {
                this.carsLayer.hide()
            }
            if (this.plateNoLayer !== null) {
                this.plateNoLayer.hide()
            }
            if (this.branchesLayer !== null) {
                this.branchesLayer.hide()
            }
        }
    },

    // 坐标-地址转换
    getAddress: function (array, cb) {
        if (this.geocoder === null) {
            setTimeout(function () {
                this.getAddress(array, cb)
            }.bind(this), 1000)
        } else {
            this.geocoder.getAddress(array, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    cb(result)
                } else {
                    console.warn("mapControl地址转换出错")
                }
            })
        }
    },

    // 改变当前视窗
    setCity: function (city) {
        this.map.setCity(city)
    },

    panTo: function (point) {
        this.map.setZoom(13)
        this.map.panTo(point)
    },

    destroy() {
        this.map = null
        this.carsLayer = null
        this.activeCarInfoWindow = null
        this.plateNoLayer = null
        this.branchesLayer = null
    }
}

const Fence = {
    polygon:null,
    polyEdit:null,

    drawPolygon(points){
        if(this.polygon){
            this.polygon.setMap(null)
        }

        let arr = []
        if(points.length>0){
            arr = points
        }else{
            let center = this.map_fence.getCenter()
            let lng_offset = 0.035
            let lat_offset = 0.03
            arr.push([center.lng-lng_offset,center.lat+lat_offset])
            arr.push([center.lng+lng_offset,center.lat+lat_offset])
            arr.push([center.lng+lng_offset,center.lat-lat_offset])
            arr.push([center.lng-lng_offset,center.lat-lat_offset])
        }

        this.polygon =  new AMap.Polygon({
            map: this.map_fence,
            path: arr,
            strokeColor: "#ff0000",
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: "#f5deb3",
            fillOpacity: 0.35
        });
        if(points.length > 0){
            this.map_fence.setFitView([this.polygon])
        }
    },

    editPolygon(){
        this.polyEdit = new AMap.PolyEditor(this.map_fence, this.polygon);
        this.polyEdit.open()
    },

    editPolygonEnd(){
        if(this.polyEdit!==null){
            this.polyEdit.close()
            return this.polygon.getPath()
        }else{
            return []
        }
    },

    clearPolygon(){
        if(this.polyEdit!==null){
            this.polyEdit.close()
        }
        this.polygon.setMap(null)
        this.polygon = null
        this.polyEdit = null
    }
}

// 车
const Cars = {
    // 海量点
    carsLayer: null,
    activeCarInfoWindow: null,
    drawCars(data) {
        // 绘制网点
        let that = this
        if (this.PointSimplifier === null) {
            setTimeout(function () {
                this.drawCars(data)
            }.bind(this), 1000)
            return
        }

        if(this.carsLayer !== null){
            this.carsLayer.hide()
        }
        this.carsLayer = new this.PointSimplifier({
            map: this.map, //所属的地图实例
            zIndex: 101,
            data: data,
            autoSetFitView: true,
            getPosition: function (item) {
                return item.getGPSArray()
            },
            getHoverTitle: function (dataItem, idx) {
                return dataItem ? dataItem.plate_no : '';
            },
            renderConstructor: this.PointSimplifier.Render.Canvas.GroupStyleRender,
            renderOptions: getPointStyle(this.carsLayer)
        });
        this.carsLayer.on('pointClick', function (e, data) {
            if (this.isHidden()) {
                return
            }
            // 点击激活，再点击取消
            let active_car = data.data.equal(Reflux.GlobalState.car.activeCar) ? {} : data.data
            CarActions.changeActiveCar(active_car)
            this.renderLater()
            if (active_car.hasOwnProperty('id')) {
                that.showActiveCarInfoWindow(data.data)
            } else {
                that.hideActiveCarInfoWindow()
            }
        });
        // 只有首次加载点时自动设置map视野，加载数据后关闭自动调整视野
        this.carsLayer.getOptions().autoSetFitView = false
    },
    updateCars(data) {
        if (this.carsLayer) {
            this.carsLayer.setData(data)
        }
    },
    showCars() {
        if (this.carsLayer) {
            this.carsLayer.show()
        } else {
            toast('车辆数据未就绪')
        }
    },
    hideCars() {
        if (this.carsLayer) {
            this.carsLayer.hide()
        }
    },
    // 展示/新建当前激活车辆的icon
    showActiveCarInfoWindow: function (car) {
        this.activeCarInfoWindow = new AMap.InfoWindow({
            content: getCarInfoWindowBox(car),
            offset: new this.AMap.Pixel(0, -19)
        });
        this.activeCarInfoWindow.open(this.map, [car.lng, car.lat]);
    },
    // 隐藏当前车辆InfoWindow
    hideActiveCarInfoWindow: function () {
        if (this.activeCarInfoWindow !== null) {
            this.activeCarInfoWindow.close()
        }
    }
}

// 车牌
const PlateNo = {
    plateNoLayer: null,
    plateNoData:[],
    drawPlateNo(data) {
        this.plateNoData = data
        let bounds = this.map.getBounds()
        // 绘制车牌
        this.plateNoLayer = new AMap.LayerGroup(data.filter(item => bounds.contains(item.getGPSArray())).map(item => {
            return new this.AMap.Text({
                text: item.plate_no,
                textAlign: 'center', // 'left' 'right', 'center',
                verticalAlign: 'middle', //middle 、bottom
                offset: new this.AMap.Pixel(0, -25),
                style: {
                    'font-size': "12px",
                    'background-color': '#fff',
                    'border': 'solid 1px #dbdbdb',
                    'padding': '2px 4px'
                },
                position: item.getGPSArray()
            });
        }))
        this.map.on('moveend', this.moveEnd)
        this.plateNoLayer.setMap(this.map)
    },
    destroyPlateNo() {
        this.map.off('moveend', this.moveEnd)
        if (this.plateNoLayer) {
            this.plateNoLayer.clearLayers()
            this.plateNoLayer = null
        }
    },
    moveEnd(){
        mapControl.destroyPlateNo()
        mapControl.drawPlateNo(mapControl.plateNoData)
    }
}

// 网点
const Branch = {
    branchesLayer: null,
    drawBranches(data) {
 /*给高明截图的
      data.forEach(item=>{
        var circle = new AMap.Circle({
          center: [item.lng,item.lat],// 圆心位置
          radius: 500, //半径
          zIndex:-1,
          strokeColor: "#F33", //线颜色
          strokeOpacity: 0.4, //线透明度
          strokeWeight: 0, //线粗细度
          fillColor: "#ee2200", //填充颜色
          fillOpacity: 0.1//填充透明度
        });

        this.map.add(circle);
      })
      */
        if (this.branchesLayer) {
            this.branchesLayer.setData(data)
        } else {
            // 绘制网点
            let that = this
            if (this.PointSimplifier === null) {
                setTimeout(function () {
                    this.drawBranches(data)
                }.bind(this), 1000)
                return
            }

            this.branchesLayer = new this.PointSimplifier({
                map: this.map,
                zIndex: 100,
                data: data,
                autoSetFitView: false,
                getPosition: function (item) {
                    return item.getGPSArray()
                },
                getHoverTitle: function (item, idx) {
                    return item.name;
                },
                renderConstructor: this.PointSimplifier.Render.Canvas.GroupStyleRender,
                renderOptions: {
                    getGroupId: function (item, idx) {
                        if (item.equal(Reflux.GlobalState.branch.activeBranch)) {
                            return item.biz_type + '_active'
                        }
                        return item.biz_type
                    },
                    groupStyleOptions: {
                        // 合作网点
                        '0': {
                            pointStyle: {
                                //绘制点占据的矩形区域
                                content: that.PointSimplifier.Render.Canvas.getImageContent(
                                    require('../images/point_icon_b.png'),
                                    function onload() {
                                        that.branchesLayer.renderLater();
                                    },
                                    function onerror(e) {
                                        alert('图片加载失败！');
                                    }),
                                width: 40,
                                height: 48,
                                offset: ['-50%', '-88%'],
                                fillStyle: null,
                                strokeStyle: null
                            },
                            pointHardcoreStyle: {
                                width: 5,
                                height: 5
                            }
                        },
                        // 合作网点，放大
                        '0_active': {
                            pointStyle: {
                                //绘制点占据的矩形区域
                                content: that.PointSimplifier.Render.Canvas.getImageContent(
                                    require('../images/point_icon_b.png'),
                                    function onload() {
                                        that.branchesLayer.renderLater();
                                    },
                                    function onerror(e) {
                                        alert('图片加载失败！');
                                    }),
                                width: 60,
                                height: 72,
                                offset: ['-50%', '-88%'],
                                fillStyle: null,
                                strokeStyle: null
                            },
                            pointHardcoreStyle: {
                                width: 5,
                                height: 5
                            }
                        },
                        // 非合作，立刻还网点
                        '1': {
                            pointStyle: {
                                //绘制点占据的矩形区域
                                content: that.PointSimplifier.Render.Canvas.getImageContent(
                                    require('../images/point_icon_b+.png'),
                                    function onload() {
                                        that.branchesLayer.renderLater();
                                    },
                                    function onerror(e) {
                                        alert('图片加载失败！');
                                    }),
                                width: 40,
                                height: 48,
                                offset: ['-50%', '-88%'],
                                fillStyle: null,
                                strokeStyle: null
                            },
                            pointHardcoreStyle: {
                                width: 5,
                                height: 5
                            }
                        },
                        // 非合作，立刻还网点，放大
                        '1_active': {
                            pointStyle: {
                                //绘制点占据的矩形区域
                                content: that.PointSimplifier.Render.Canvas.getImageContent(
                                    require('../images/point_icon_b+.png'),
                                    function onload() {
                                        that.branchesLayer.renderLater();
                                    },
                                    function onerror(e) {
                                        alert('图片加载失败！');
                                    }),
                                width: 60,
                                height: 72,
                                offset: ['-50%', '-88%'],
                                fillStyle: null,
                                strokeStyle: null
                            },
                            pointHardcoreStyle: {
                                width: 5,
                                height: 5
                            }
                        }
                    },
                    pointHoverStyle: {
                        content: 'none'
                    },
                    hoverTitleStyle: {
                        position: 'left',
                        offset: [0, 0]
                    }
                }
            });
            this.branchesLayer.on('pointClick', function (e, data) {
                if (this.isHidden()) {
                    return
                }
                // 点击激活，再点击取消
                let active_branch = data.data.equal(Reflux.GlobalState.branch.activeBranch) ? {} : data.data
                BranchActions.changeActiveBranch(active_branch)
                mapControl.branchesLayer.renderLater()
            })
            // 只有首次加载点时自动设置map视野，加载数据后关闭自动调整视野
            this.branchesLayer.getOptions().autoSetFitView = false
        }
    },
    showBranches() {
        if (this.branchesLayer) {
            this.branchesLayer.show()
        } else {
            toast('网点数据未就绪')
        }
    },
    hideBranches() {
        if (this.branchesLayer) {
            this.branchesLayer.hide()
        }
    },


    // 显示/隐藏所有网点
    toggleAllBranch: function (show, data) {
        if (show) {
            if (this.branchesLayer === null) {
                this.drawBranchesLayer(data)
            } else {
                this.branchesLayer.show()
            }
        } else {
            if (this.branchesLayer !== null) {
                this.branchesLayer.hide()
            }
        }
    }
}

// 轨迹
const Track = {
    // 轨迹图层
    carTrackLayer: null,
    // 巡航器
    navigate: null,
    // 停留点图层
    trackStopPointsLayer: null,

    // 绘制轨迹点
    drawCarTrack: function (points) {
        let that = this
        if (this.PathSimplifier === null) {
            setTimeout(function () {
                this.drawCarTrack(points)
            }.bind(this), 1000)
            return
        }

        // 清空轨迹图，如果有
        this.destroyCarTrack()

        //创建组件实例
        this.carTrackLayer = new this.PathSimplifier({
            zIndex: 100,
            map: this.map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
                return pathData.path.map(item => item.getGPSArray());
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
                //返回鼠标悬停时显示的信息
                if (pointIndex >= 0) {
                    //鼠标悬停在某个轨迹节点上
                    return new Time(pathData.path[pointIndex].loc_time).getTime('YYYY-MM-DD HH:mm:ss') + '，' + Reflux.GlobalState.car.track.getSpeed(pointIndex) + 'km/h，点:' + pointIndex + '/' + pathData.path.length;
                }
                //鼠标悬停在节点之间的连线上
                return '点数量' + pathData.path.length;
            },
            renderOptions: {
                keyPointTolerance: 1,
                renderAllPointsIfNumberBelow: 1000,
                //轨迹线的样式
                pathLineStyle: {
                    strokeStyle: 'red',
                    lineWidth: 6,
                    dirArrowStyle: true
                }
            }
        });

        this.carTrackLayer.setData([{
            name: '轨迹0',
            path: points
        }]);

        //创建一个巡航器
        this.navigate = this.carTrackLayer.createPathNavigator(0, //关联第1条轨迹
            {
                loop: true, //循环播放
                speed: 1000
            });
        this.navigate.on('move', this.navigateMoveCallback.bind(this))
    },
    // destroy现存的轨迹
    destroyCarTrack: function () {
        if (this.carTrackLayer !== null) {
            this.carTrackLayer.setData()
            this.carTrackLayer = null
        }
        if (this.navigate !== null) {
            this.navigate.destroy()
            this.navigate = null
        }
    },

    // 移动轨迹导航点
    moveNavigatePoint: function (target_time) {
        if (this.carTrackLayer === null) {
            return false
        }
        let list = this.carTrackLayer.getPathData(0).path
        let length = list.length - 1

        let target_index = 0
        let target_tail = 0
        // 如果选择的时间范围超出轨迹范围，则停留在最大或最小值
        if (target_time < list[0].loc_time) {
            // 停留在第一个点，index和tail都是0
        } else if (target_time > list[length].loc_time) {
            // 停留在最后一个点，index = list.length-1，tail是0
            target_index = length
        } else {
            // 计算高德地图moveToPoint方法所需参数
            for (let i = 0; i < length; i++) {
                if (list[i].loc_time <= target_time && target_time <= list[i + 1].loc_time) {
                    target_index = i
                    target_tail = (target_time - list[i].loc_time) / (list[i + 1].loc_time - list[i].loc_time)
                }
                if (target_time < list[i]) {
                    break;
                }
            }
        }
        this.navigate.moveToPoint(target_index, target_tail)
        this.carTrackLayer.renderLater()
    },
    // 巡航器播放
    navigatePlay: function () {
        if (this.navigate !== null) {
            switch (this.navigate.getNaviStatus()) {
                case 'stop':
                    this.navigate.start(this.navigate.getCursor().idx)
                    break;
                case 'pause':
                    this.navigate.resume()
            }
        }
    },
    // 巡航器暂停
    navigatePause: function () {
        if (this.navigate !== null) {
            this.navigate.pause()
        }
    },
    // 巡航器变速
    navigateSetSpeed: function (speed) {
        if (this.navigate !== null) {
            this.navigate.setSpeed(speed)
        }
    },
    // 巡航器move事件回调
    navigateMoveCallback: function (e) {
        let idx = e.target.cursor.idx
        let tail = e.target.cursor.tail

        let path = this.carTrackLayer.getPathData(0).path
        let loc_time_past = path[idx].loc_time
        let loc_time_future
        if (idx < path.length - 1) {
            loc_time_future = path[idx + 1].loc_time
        } else {
            loc_time_future = loc_time_past
        }
        let current_time = loc_time_past + tail * (loc_time_future - loc_time_past)
        CarActions.navigateMove(current_time)
    },

    // 展示/隐藏停留点
    drawStopPoints: function (data) {
        // 绘制停留点
        this.trackStopPointsLayer = new AMap.LayerGroup(data.map(item => {
            return new this.AMap.Marker({
                map: this.map,
                title: '停留' + new Time().duration(item.duration),
                position: [item.stay_point.longitude, item.stay_point.latitude],
                offset: new AMap.Pixel(-20, -38),
                icon: new AMap.Icon({
                    size: new AMap.Size(40, 40),  //图标大小
                    imageSize: new this.AMap.Size(40, 40),
                    image: require('../images/stopPointMarker.png'),
                })
            });
        }))
    },
    destroyStopPoints: function () {
        if (this.trackStopPointsLayer !== null) {
            this.map.remove(this.trackStopPointsLayer.getLayers())
            this.trackStopPointsLayer = null
        }
    }
}

window.mapControl = Object.assign({}, Base, Fence, Cars, PlateNo, Branch, Track)

function getCarInfoWindowBox(car) {
    let data = {
        plate_no: car.plate_no,
        status_desc: carStatus.find(item => item.status == car.status).desc,
        vin: car.vin,
        distance_remain: car.max_km * car.soc / 100 + 'km',
        modify_time: new Time(car.tbox_time).fromNow()
    }
    return carInfoWindowBox(data)
}

// 返回标注点的样式 车/圆点
function getPointStyle() {
    let that = window.mapControl

    function getImageContentRotate(src, deg, onload) {
        let canvas, image, isLoaded = !1;
        canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        let ctx = canvas.getContext('2d');
        image = document.createElement("img");
        image.crossOrigin = "Anonymous";
        image.addEventListener("load", function () {
            ctx.translate(64, 64)
            ctx.rotate(deg * Math.PI / 180);
            ctx.translate(-64, -64)
            ctx.drawImage(image, 0, 0, 128, 128)
            isLoaded = !0;
            onload && onload.call(this);
        }, !1);
        image.src = src;
        return function (ctx, x, y, width, height) {
            if (isLoaded) {
                ctx.drawImage(canvas, x, y, width, height);

            }
        };
    }

    function getGroupStyleOptions() {
        let type = ['car', 'circle']
        let active = ['1', '0']
        let status = ['gray','blue','green','red','yellow']
        let deg = []
        for (let i = 0; i <= 360; i += 20) {
            deg.push(i)
        }
        let options = {}

        type.forEach(_type =>{
            active.forEach(_active => {
                status.forEach(_status =>{
                    deg.forEach(_deg => {
                        let size = _active === '1' ? 50 : 30
                        if(_type === 'car'){
                            let src = ''
                            switch (_status){
                                case "red":
                                    src = require('../images/icon_car_red.png')
                                    break;
                                case "blue":
                                    src = require('../images/icon_car_blue.png')
                                    break;
                                case "green":
                                    src = require('../images/icon_car_green.png')
                                    break;
                                case "yellow":
                                    src = require('../images/icon_car_yellow.png')
                                    break;
                                default:
                                    src = require('../images/icon_car_gray.png')
                            }
                            options[_type+'_' + _active +'_'+_status+ '_' + _deg] = {
                                pointStyle: {
                                    //绘制点占据的矩形区域
                                    content: getImageContentRotate(
                                        src,
                                        _deg,
                                        function onload() {
                                            that.carsLayer.renderLater();
                                        }),
                                    width: size,
                                    height: size,
                                    offset: ['-50%', '-50%'],
                                    fillStyle: null,
                                    strokeStyle: null
                                },
                                pointHardcoreStyle: {
                                    width: Math.round(size/5),
                                    height: Math.round(size/5)
                                }
                            }
                        }else{
                            let color = _active === '1' ? '#ff9900' : "#1f77b4"
                            options[_type+'_' + _active] = {
                                //点的样式
                                pointStyle: {
                                    "content": "circle",
                                    "width": Math.round(size/4),
                                    "height": Math.round(size/4),
                                    "fillStyle":color,
                                    "lineWidth": 1,
                                    "strokeStyle": null
                                },
                                pointHardcoreStyle: {
                                    width: Math.round(size/6),
                                    height: Math.round(size/6)
                                }
                            }
                        }
                    })
                })

            })
        })
        return options
    }

    return {
        getGroupId: function (item, idx) {
            let type = Reflux.GlobalState.setting.setting_layer_useCarIcon ? 'car' : 'circle'
            let active = item.equal(Reflux.GlobalState.car.activeCar) ? '1' : '0'
            let status_config= [
                {
                    key:'blue',
                    status:[4]
                },
                {
                    key:'green',
                    status:[2]
                },
                {
                    key:'red',
                    status:[]
                },
                {
                    key:'gray',
                    status:[1, 3]
                }
            ]
            let res = status_config.find(conf=>conf.status.indexOf(Number(item.status)) > -1)
            let status = res ? res.key : 'yellow'
            let deg = Math.round(item.direction/20)*20
            return type === 'car' ? (type +'_'+ active +'_'+status+'_'+ deg) : (type +'_'+ active)
        },
        groupStyleOptions:getGroupStyleOptions(),
        pointHoverStyle: {
            content: 'none'
        },
        hoverTitleStyle: {
            position: 'left',
            offset: [0, 0]
        }
    }
}

