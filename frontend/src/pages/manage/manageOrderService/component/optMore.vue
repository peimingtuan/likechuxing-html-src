<template>
	<div class="check_modal" v-show="modal"> 
    	<div class="modal" @click="modalClose()"></div>
		<!--取消-->
		<div class="modal_content">
			<p class="modal_title">{{title}}<i class="close_modal" @click.stop="modalClose()"></i></p>
			<div class="checkout">
				<div class="checked">
					
					<span class="checked_item" 
						v-for="(item,index) in checkedItem" 
						:key = 'index'
						@click="deleteCheck(index)"
					>{{item.name}}</span>
					<span class="checked_item active" v-show = 'ischeck'>请选择</span>
				</div>
				<div class="check_item">
					<p @click.stop="checkedName('1')" v-show='all'>全部</p>
					<p @click.stop="checkedName('2')" v-show='all&&out_part'>车辆外观</p>
					<p v-for="(cons,index) in checkedCon"
						:key = 'index'
						@click.stop="checkedName(cons)"
					>
						{{cons.name}}
					</p>
				</div>
			</div>
			
		</div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
	require("../css/modal.css")
export default {
    name: "optMore",
    props: {
    	resetAll:false,
    	filterData:{// 预制选项
	        default:[],
	        type:Array
		},
      	title:{
	        default:'',
		},
		all:false,
		source:''
      	
    },
    data () {
      return {
      	checkedItem:[],
      	checkedCon:[],
      	ischeck:true,//是否展示请选择
      	optTxt:'全部',
      	allName:[],
      	isTxt:false,
      	allId:[],
      	optId:'',
      	modal:false,
      	checkData:[],
      	checkId:[],
      	out_part:true,
      	out_keys:''
      }
    },
    created(){
    	this.all?this.out_part=true:this.out_part = false;
    },
    mouted(){
    	this.checkedCon = this.filterData;
    },
    methods: {
      modalClose(){
      	this.$emit('modalClose');
      },
      deleteCheck(index){//title删除
		var nowIndex = index-1
		index!=0?this.checkedCon = this.checkedItem[nowIndex].child:this.checkedCon = this.filterData;
		this.checkedItem.splice(index,this.checkedItem.length);
		this.allName.splice(index,this.allName.length);
		this.allId.splice(index,this.allId.length);
		this.ischeck = true;
		this.optTxt = this.allName.join('-');
		this.optId = this.allId.join('-');
		this.data = [this.optTxt,this.optId]
		this.$emit('optData',true);
		if(this.all&&index==0){
			this.out_part=true
		}
	},
	checkedName(conts){//title添加
		if(conts=='1'){
			this.out_part?this.optTxt = '全部':this.optTxt;
			this.modalClose();
			this.resetAll = false;
			this.$emit('optData',true);
			
		}else if(conts=='2'){
			this.optTxt = '车辆外观';
			this.out_keys = '1';
			this.modalClose();
			this.resetAll = false;
			this.$emit('optData',true);
		}else{
			this.filterData1 = conts.child;
			this.allName.push(conts.name);
			this.allId.push(conts.id);
			this.unique(this.allName,1);
			this.unique(this.allId,2);
			this.optTxt = this.allName.join('-');
			this.optId = this.allId.join('-');
			this.out_part=false;
			if(this.filterData1&&this.filterData1.length!=0){
				this.checkedItem.push(conts);
				this.checkedCon = this.filterData1;
			}else{
				this.allName.splice(this.allName.length-1,1);
				this.allId.splice(this.allId.length-1,1);
				if(this.source=='1'){//无全部和第一级的时候
					this.allName.push(conts.name);
					this.allId.push(conts.id);
				}
				this.checkData.push(this.optTxt);
				this.checkId.push(this.optId);
				this.unique(this.checkData,3);
				this.unique(this.checkId,4);
				this.modalClose();
			}
			this.resetAll = false;
			this.data = [this.optTxt,this.optId]
			this.$emit('optData',true);
		} 
		
		
	},
	unique(allarr,type){//去重1allName,2 allId 3 this.checkData 4 this.checkId
		var res = [];
		var obj = {};
		for(var i=0; i<allarr.length; i++){
		  	if( !obj[allarr[i]] ){
		   		obj[allarr[i]] = 1;
		   		res.push(allarr[i]);
		  	}
		} 
		if(type==1){
			this.allName = res
		}else if(type==2){
			this.allId = res
		}else if(type==3){
			this.checkData = res
		}else if(type==4){
			this.checkId = res;
		}
	},
      
    }
}
	
	
</script>

<style scoped>
	
</style>