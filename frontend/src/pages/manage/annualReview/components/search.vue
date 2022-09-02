<template>
	<div class="search">
		<div class="repair_shop">
			<span>{{search_name}}</span>
			<span class="repair_sear">
				<div class="input-wrap">
					<input  type="text" name="searchWord" @focus="inputFocus" v-model='searchWord'  :placeholder="plac_txt" @input="postSearchRequest"/>
				</div>
				<span class="input_clearn" 
					@click="clearInput" 
					v-show="isShowClearBtn">
					<img src="../images/icon_close.png" alt="" />
				</span>
			</span>
		</div>
		<div class="history_items" v-show="isShowList || isShowHistory">
			<div >
				<div class="search-list"  v-show="isShowList">
					<p  class="his_list" v-for="(item,index) in searchResList" :key="index+'h'" @click="selectResItem(item)">
						{{item.name}}
					</p>
					<!-- <div class="noSearch" v-show='searchResList.length === 0'>
						<img class="icon_nosearch" src="../images/icon_nosearch.png"/>
						<p>无搜索结果</p>
					</div> -->
				</div>
				<div class="history-list" v-show="isShowHistory">
					<p class="his_title">历史记录：</p>
					<p class="history_item" v-for="(item,index) in searchHistory" :key="item.id" data-type = 'index' @click="select(item)">
						{{item.name}}
						<span class="his_clearn" @click.stop="deleteHistoryItem(index)">
							<img src="../images/icon_delete.png" alt="" />
						</span>
					</p>
					<p class="his_close"  @click="closeTip">关闭</p>
				</div>
			</div>	
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
	export default {
		name:'search',
		props: {
	    	search_name:String,
	    	plac_txt:String,
			search_type:Number,//1 维修厂    2地图搜索  3网点搜索
			selectBranch:Function
	    },
		data(){
			return {
				searchWord:'',
				isShowList:false,
				isShowHistory:false
			}
		},
		computed:{
			...mapState('dotMap',[
				'searchResList',
				'searchHistory'
			]),
			...mapGetters('dotMap',[
				'currentBranch'
			]),
			isShowClearBtn(){
				return this.searchWord.length
			}
		},
	    methods: {
			...mapActions('dotMap',[
				'searchDot'
			]),
			...mapMutations('dotMap',[
				'setSearchres',
				'setSearchHistory',
				'setLngLat',
				'setCurrentBranchId'
			]),
	    	inputFocus(){
				if(this.searchWord==''){
					this.isShowList = false
					if(this.searchHistory.length){
						this.isShowHistory = true
					}else{
						this.isShowHistory = false
					}
				}else{
					this.isShowHistory = false
					this.isShowList = true
				}
			},
			closeTip(){
				this.isShowList = false
				this.isShowHistory = false
			},
			postSearchRequest(){
				this.inputFocus()
				let { searchWord } = this
				if(searchWord===''){
					return
				}
				const _this = this;
				this.timer && clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					_this.searchDot(searchWord)
				},200)
			},
			clearInput(){
				this.searchWord = '';
				this.setSearchres([])
				this.closeTip();
			},
			select(item){
				let { lat, lng } = item
				this.setLngLat({lat,lng})
				this.setCurrentBranchId(item.id)
				this.$emit('selectBranch')
				this.searchWord = item.name
				this.closeTip();
			},
			selectResItem(resItem){
				//处理搜索历史
				let histroyList = localStorage.getItem('searchHistory')
				if(histroyList){
					let arr = JSON.parse(histroyList)
					arr.map((item,index)=>{
						if(resItem.id == item.id){
							arr.splice(index,1)
						}
					})
					arr.push(resItem)
					this.setSearchHistory(arr)
					localStorage.setItem('searchHistory',JSON.stringify(arr))
				}else{
					let arr = []
					arr.push(resItem)
					this.setSearchHistory(arr)
					localStorage.setItem('searchHistory',JSON.stringify(arr))
				}
				this.select(resItem)

			},
			deleteHistoryItem(index){
				let arr = this.searchHistory.slice()
				arr.splice(index,1)
				this.setSearchHistory(arr)
				localStorage.setItem('searchHistory',JSON.stringify(arr))
			}
		},
		destoryed(){
			this.timer && clearTimeout(this.timer)
		}
	}
</script>

<style lang="less" scoped>
	@import url('../css/common.less');
	.search{
		background: #FFFFFF;
		.repair_sear{
			.fc();
			.input-wrap{
				flex:1;
				height:.53rem;
				padding-left: .15rem;
				input,div{
					width: 100%;
					height: 100%;
					padding-left: .4rem;
					.fco(.14rem,#333);
				}
				div{
					.fb();
				}
			}
			.input_clearn{
				width: .3rem;
				height: .3rem;
				.fc();
				img{
					width: 100%;
					height: 100%;
				}
			}

		}
		.history_items{
			z-index: 120;
			background: #FFFFFF;
			position: absolute;
			width: 100%;
			left: 0;
			min-height: 1rem;
			border: 1px solid #F0F0F0;
			max-height: 6rem;
			overflow: hidden;
			padding: 0 0.15rem;
		}
	}
	.his_clearn{
		display: inline-block;
		width: .14rem;
		height: .14rem;
	}
	.his_clearn img{
		width: 100%;
		height: 100%;
	}
	.history_item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.1rem 0;
		border-bottom: 1px solid #ededed;
	}
	.noSearch{
		text-align: center;
		margin-top: .15rem;
	}
	.noSearch img{
		width: 0.5rem;
		height: 0.54rem;
	}
	
	
	.his_list,.his_title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		-webkit-align-items: center;
		padding: 0.1rem 0;
	}
	.his_list{
		border-bottom: 1px solid #ededed;
		padding: 0.1rem 0;
	}
	.his_close{
		padding: .1rem 0;
	    text-align: right;
	    color: #ccc;
	}
</style>