<template>
  <div> 
    <div class="nav-header">
      <x-header title="待实现的页面" class="nav-header"></x-header>
    </div>
    <div class="wait-todo">{{desc}}</div> 
    <copyright class="fixed"></copyright>	
  </div>
</template>
<script>export default {
	props: {
		desc:{
			type:String,
			default:'待完成的页面'
		}
	}
}</script>
<style scoped>.wait-todo {
	background-color: #fff;
	width: 100%;
	color: hotpink;
	text-align: center;
	padding: 50px 0;
	max-width: 640px;
	margin: 0 auto;
}</style>
