<template>
	<div class="serviceMap container">
		<div class="dispatch-search">
		    <search 
				@selectBranch = 'selectSearchItem' 
				ref='search'
				:search_name="''"
				:plac_txt="'请输入网点名称'"
				:apiUrl="'/vehicle-problem/search'"
				:search_type='2'
				>
			</search>
		    <span class="icon">&#xe605;</span>
		</div>
		<div id="dispatch-map"></div>
		<!--刷新页面-->
		<div class="refure-dispatchpage" :class="currentBranchId?'slide':''" @click="refreshPage">
		    <img src="../images/refresh.png"/>
		</div>
		<!--导航弹框-->
		<div class="navition-bottom" v-show="currentBranchId">
		    <div class="left">
		        <span class="net">{{currentBranch.name}}</span><br/>
		        <span class="address">{{currentBranch.address}}</span>
		    </div>
		    <div class="right">
		        <img @click="navigation" class="navition-icon" src="../images/like/navition-icon.png"/><br/>
		        <span class="">导航</span>
		        <input type="hidden" value="" class="lng"/>
		        <input type="hidden" value="" class="lat"/>
		    </div>
		</div>
		<div :class="currentBranchId?'check_btn':'bgcff'" @click="comfirmBtn">
			{{currentBranchId?'确认选择':'请选择网点'}}
		</div>
		
	</div>
</template>

<script>
  	import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import search from '../components/search'

    import { mapState, mapMutations ,mapActions, mapGetters} from 'vuex'
    import { Toast } from 'mint-ui'
    import likeMap from '../js/map'
	export default {
	    name: "serviceMap",
	     components: {
	      LikeButton,
	      search
        },
        computed:{
            ...mapGetters('dotMap',[
                'user_poi',
                'currentBranch'
            ]),
            ...mapState('dotMap',[
                'list',
                'provice',
                'city',
                'lat',
                'lng',
                'currentBranchId',
                'selectBranch'
            ]),
        },
	    data () {
	      return {

	      }
        },
        created(){
            this.$DD.init()
        },
	    mounted () {
	    	this.creatMap();
        },
	    methods: {
            ...mapMutations('dotMap',[
                'setLngLat',
                'setCurrentBranchId',
                'emptyData',
            ]),
            ...mapMutations('finish',[
                'setBranchName',
                'setBranchId'
            ]),
            ...mapActions('dotMap',[
                'getList'
            ]),
            refreshPage(){
                this.emptyData()
                this.creatMap()
            },
            getLocation(){
                const _this = this;
                return new Promise((resolve,reject)=>{
                    if(_this.$DDBase.inDDApp){
                        _this.$DD.getLocation({
                            targetAccuracy: 200,
                            coordinate: 1,
                            withReGeocode: true,
                            useCache: true
                        }).then(res => {
                            let lat = res.latitude
                            let lng = res.longitude
                            _this.setLngLat({
                                lat,
                                lng,
                                provice:res.provice,
                                city:res.citye,
                            })
                            resolve(res)
                        }).catch(err=>{
                            Toast('定位失败')
                            reject(err)
                        })
                    }else{
                        let lat = this.$route.query.lat
                        let lng = this.$route.query.lng
                        if(lat){
                            this.setLngLat({
                                lat,
                                lng
                            })
                            resolve(lat)
                        }else{
                            reject('请在url添加经纬度以便于测试')
                        } 
                    }
                })
            },
	    	selectSearchItem(){
                this.map.panTo(this.user_poi)
                this.drawBranch()
            },
	    	async creatMap(){
                await this.getLocation()
                let _this = this;
                this.map = likeMap.initMap({
                    el:'dispatch-map',
                    center:_this.user_poi,
                    moveCenter:positionResult=>{
                         _this.computeDis(positionResult.position.lng,positionResult.position.lat);
                    }
                })
                //导航
                AMap.plugin(["AMap.Driving"], function () {
                    var drivingOption = {
                        policy: AMap.DrivingPolicy.LEAST_TIME,
                        map: ''
                    };
                    _this.driving = new AMap.Driving(drivingOption); //构造驾车导航类
                });
	    	},
	    	computeDis(lng,lat){//计算拖动距离
	    		var _this = this;
				var m1 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(this.lng, this.lat)
			    });
	        	var m2 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(lng, lat)
			    });
		        var p1 = m1.getPosition();
		        var p2 = m2.getPosition();
		        var distances = Math.round(p1.distance(p2));
		        var path = [p1,p2];
               	if(distances==0||distances>=1000){
                    _this.setLngLat({lng,lat})
               		_this.drawBranch()
               	}
          	},
	    	async drawBranch(){
                await this.getList()
                this.map.clearMap();
                const _this = this;
                let result = this.list;
                this.list.map(item=>{
                    likeMap.addMarker(item,_this.currentBranchId,marker=>{
                        _this.setCurrentBranchId(marker.branch_id)
                    })
                    likeMap.addActiveMarker(item,_this.currentBranchId,marker=>{
                         _this.setCurrentBranchId(marker.branch_id)
                    })
                })

	    	},
	    	navigation(){
                var that = this;
                let { currentBranch, user_poi } = this;
	    		this.driving.search(
                    user_poi, [currentBranch.lng,currentBranch.lat],
                    function (status, result) {
                        that.driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    }
                );
            },
            comfirmBtn(){

                this.setBranchName(this.currentBranch.name)
                this.setBranchId(this.currentBranch.branch_id)
                this.$router.go(-1)
            }
	    },
  	}
</script>
<style lang="less" scoped>
    .container{
        #dispatch-map {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .dispatch-search {
            position: absolute;
            left: 2.5%;
            width: 95%;
            z-index: 100;
            margin-top: .1rem;
            .icon{
                font-family: 'iconfont';
                display: inline-block;
                width: .4rem;
                line-height: .4rem;
                text-align: center;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                left: .15rem;
                top: 0.06rem;
            }
        }
        .refure-dispatchpage {
            position: fixed;
            bottom: .65rem;
            right: .07rem;
            width: .45rem;
            height: .45rem;
            border-radius: 50%;
            z-index: 100;
            &.slide{
                bottom: 1.6rem;
            }
        }
    }
    

    .refure-dispatchpage img {
        width: .45rem;
    }
    .netdispatch-bottom {
        width: 95%;
        position: fixed;
        bottom: .8rem;
        padding: 0 2.5%;
    }
    .netdispatch-bottom button {
        width: 100%;
        height: .8rem;
        background: #187aeb;
        border: none;
        outline: none;
        border-radius: 3px;
        text-align: center;
        color: #fff;
    }
    .navition-bottom {
        box-sizing: border-box;
        position: fixed;
        bottom: .7rem;
        left: 2.5%;
        width: 95%;
        height: .8rem;
        border-radius: 5px;
        background: #fff;
    }

    .navition-bottom .left {
        box-sizing: border-box;
        padding: .18rem;
        width: 80%;
        height: 1rem;
        border-right: 1px solid #dcdcdc;
    }

    .navition-bottom .left span {
        width: 2.5rem;
        display: inline-block;
        /*line-height: .32rem;*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .navition-bottom .left .address {
        color: #999999;
    }

    .navition-bottom .right {
        box-sizing: border-box;
        width: 20%;
        height: .8rem;
        text-align: center;
    }

    .navition-bottom .right img {
        width: .21rem;
        vertical-align: middle;
        margin-top: .21rem;
    }
    .checkout{
        display: none;
        position: absolute;
        bottom: 1.64rem;
        right: .07rem;
        width: .45rem;
        height: .45rem;
        z-index: 100;
        text-align: center;
    }
    .checkout img {
        vertical-align: middle;
        width: .45rem;
    }
    .check_btn,.bgcff{
        
        width: 95%;
        height: .43rem;
        line-height: .43rem;
        position: fixed;
        bottom: .15rem;
        left: 2.5%;
        box-sizing: border-box;
        text-align: center;
    }
    .check_btn{
        color: #FFFFFF;
        background: #333333;
    }
    .bgcff{
            background: #FFFFFF;
            color: #333;
        }
    .serviceMap .repair_shop{
        padding-left: .6rem;
        border-bottom: none;
    }
    .serviceMap .history_items{
        left: 0;
        width:100%
    }
</style>