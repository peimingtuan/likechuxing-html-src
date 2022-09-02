<template>
	<div class="check_modal" v-show="pageModal"> 
			<!--取消-->
			<div class="modal_content  page_modal" >
					<div class="modal_det page_det">
						{{modal_txt}}
					</div>
					<div class="alert_btn">
						<p class="cancel_btn" @click="cancelOrder" v-if='isDelete||isCharge||endThree'>
							<a>取消</a>
						</p>
						<p class="tel_con confirm_btn" @click="subOrder">
							<a>{{isDelete?'确认':isCharge?'确认提交':endTwo?'确定':'继续提交'}}</a>
						</p>
						
					</div>
			</div>
		
		</div>
</template>

<script>
	import $ from 'jquery'
	require("../css/modal.css")
export default {
    name: "delete",
    props: {
    	pageModal:Boolean,
    	modal_txt:'',
    	isDelete:Boolean,
    	isCharge:Boolean,
    	endTwo:Boolean,
    	endThree:Boolean,
    },
    data () {
      return {
        subType:''
      }
    },
    methods: {
      subOrder(){
      	this.subType =this.endTwo?1:2;//为1时不可提交，为2时展示可强制提交
      	this.$emit('subOrder');
      },
      cancelOrder(){
      	this.$emit('cancelOrder');
      },
      selectDec(item,e,index){
      	$(e.target).addClass('fc44a');
      	$(e.target).siblings().removeClass('fc44a');
      	this.type_cont=item;
      	this.type_num = index;
      	setTimeout(()=>{
      		this.type_dec=false;
      	},500)
      	
      },
      
    }
}
	
	
</script>

<style scoped>
	
</style>