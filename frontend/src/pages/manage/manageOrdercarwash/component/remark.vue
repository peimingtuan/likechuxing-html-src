<template>
	<div id="remark">
		<div class="remark-info">
			<span v-if="showblock">*</span>
			  <textarea class="void_writeinfo"  :placeholder="text_value" maxlength="200">
			</textarea>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	export default {
		name:'remark',
		props: {
			showblock:Boolean,
			text_value:''
	    },
		data(){
			return {

			}
		},
		mounted () {
			
		},
	    methods: {

	    	}
	}
</script>

<style>
	/*备注信息样式*/
	#remark .remark-info {
		margin: .12rem .12rem .82rem;
		width: 3.51rem;
		height: 1.4rem;
		border: 1px solid gray;
		position: relative;
	}

	#remark .remark-info span {
		position: absolute;
		left: -.09rem;
		top: 0;
		color: red;
	}

	#remark .void_writeinfo {
		box-sizing: border-box;
		width: 3.48rem;
		height: 1.37rem;
		padding: .12rem;
		outline: none;
		background: #f7f7f7;
		border: none;
		border-radius: 2px;
	}
</style>