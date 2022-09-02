<template>
	<div class="check_modal" v-show="modal"> 
		<!--取消-->
		<div class="modal_content">
			<div class="modal_det">
				<div id="cance_type">
					<p><span class="f15b">*</span>请填写取消类型：</p>
					<p class="check_down" @click="type_dec?type_dec=false:type_dec=true">
						<span class="fc99">{{type_cont}}</span>
						<span class="todown">
						</span>
					</p>
					<p class="type_con" v-show="type_dec">
						<span
							class='selec'
							@click="selectDec(item,$event,index)" 
							v-for="(item,index) in select_con"
							:key = 'index'
						>
							{{item}}
						</span>
						
						
					</p>
				</div>
				
				<p><span class="f15b">*</span>备注：</p>
				<textarea v-show="!type_dec" type="textarea" v-model="textarea1" id="textarea" placeholder="请添加描述，200字内（必填）" name="" maxlength ="200">
				</textarea>
			</div>
			<div class="alert_btn">
				<p class="cancel_btn" @click="modal=false">
					<a>我再想想</a>
				</p>
				<p class="tel_con confirm_btn" @click="cancelOrder()">
					<a>确认取消</a>
				</p>
				
			</div>
		</div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
	require("../css/modal.css")
export default {
    name: "cancle",
    props: {
    },
    data () {
      return {
        select_con:['车辆已被租走','需要更换车辆','临时有其他事情'],
         type_dec:false,
         type_cont:'',
         textarea1:'',
         modal:false,
         type_num:''
      }
    },
    methods: {
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