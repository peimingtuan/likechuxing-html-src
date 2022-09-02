<template>
	<div class="check_modal" v-show="pageModal"> 
			<!--取消-->
			<div class="modal_content  page_modal" v-if='isDrive||isOne'>
					<div class="modal_det page_det">
						{{modal_txt}}
					</div>
					<div class="alert_btn">
						<p class="tel_con confirm_btn" @click="subOrder">
							<a>确认</a>
						</p>
					</div>
			</div>
			<div class="modal_content  page_modal" v-if='isDelete'>
					<div class="modal_det page_det">
						{{modal_txt}}
					</div>
					<div class="alert_btn">
						<p class="cancel_btn" @click="cancelOrder">
							<a>取消</a>
						</p>
						<p class="tel_con confirm_btn" @click="subOrder">
							<a>确认</a>
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
    	isDrive:Boolean,
    	isDelete:Boolean,
    	isOne:Boolean,
    },
    data () {
      return {
        subType:''
      }
    },
    methods: {
      subOrder(){
      	this.subType = this.isDelete?1:this.isDrive?2:3;
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