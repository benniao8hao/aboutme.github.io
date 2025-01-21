<template>
	<div class="collapsible">
		<div class="title" :class="{'border-bottom':isExpand}">
			<slot name="icon"></slot>
			<slot name="title"></slot>
			<span class="iconfont" :class="{'icon-xiangxiajiantou':!isExpand,'icon-xiangshangjiantou':isExpand}" @click="isExpand=!isExpand"></span>
		</div>
		<div class="content" v-if="isExpand">
			<slot></slot>
		</div>
	</div> 
</template>

<script>
	export default{
		data(){
			return {
				isExpand:this.expand
			}
		},
		props:{
			expand:{
				type:Boolean,
				default:true
			}
		}
	}
</script>
