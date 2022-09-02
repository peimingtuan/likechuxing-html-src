<!--@xurr on 081611 车辆问题列表页面
	1、列表页。分页。
-->
<template>
	<div class="proList">
		<ul class="stateList">
		    <li class="proli" v-for="(list_item,index) in listData" @click="goDetail(index+1)">
		    	<span>{{list_item}}</span>
		    	<span class="right_icon"><img src="../images/icon_right.png" alt="" /></span>
		    </li>
		</ul>
	</div>
</template>

<script>
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import env from '../../../../../other_modules/like-env'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'

	export default{
		data(){
			return{
				listData:['后视镜有伤需立即处理','轮胎有伤需立即处理','其他有伤需立即处理','全部有伤列表']
			}
		},
		beforeCreate () {
			document.title = '车辆问题列表';
		},
		
		created () {
		  userData.save({
			mobile:18610326236,
			city_ids:'1,197,202,214,235,169,183,74,213'
		  })
		  if(env.isIos) dd.setWebViewBounce(false)

		  dd.getLocation().then(res=>{
			userData.save({
			  lng:res.longitude,
			  lat:res.latitude
			})
            sessionStorage.setItem('lng',res.longitude);
            sessionStorage.setItem('lat',res.latitude);
          }).catch(err=>{
            console.log(err)
		  })
		},
		methods: {
			goDetail(type){
			  this.$router.push({
				path:'/proDetails',
				query:{
				  type
				}
              })
			}
		}
	}
		
</script>

<style lang=less scoped>
	.proList{
		width: 100%;
		height: 100%;
		font-size: .14rem;
		color: #333333;
		-webkit-overflow-scrolling:touch;
		position: relative;
		background-color: #f6f6f6;
		.proli{
			background: #fff;
			padding:0.2rem 0.1rem;
			border-bottom: 1px solid #f6f6f6;
			display: -webkit-box;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			-webkit-align-items: center;
			justify-content: space-between;
			-webkit-justify-content: space-between;
		}
		.right_icon{
			display: inline-block;
			width: .17rem;
			height: .17rem;
			img{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>