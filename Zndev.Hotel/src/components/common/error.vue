<template>
	<div class="main-container top-header-padding">
		<msg title="抱歉，发生了错误" :description="errorMsg" :buttons="buttons" :icon="icon"></msg>
	</div>
</template>

<script>
	export default{
		data(){
			let errorMsg=this.$route.params.errorMsg;
			return {
				errorMsg,
				icon: 'warn',
			      buttons: [
	//			      {
	//			        type: 'primary',
	//			        text: '返回首页',
	//			        onClick: function(){
	//			        	
	//			        }
	//			      }, 
			      {
			        type: 'default',
			        text: '返回首页',
			        //link: '/demo'
			        onClick: this.goHome.bind(this)
			    }]
			}
		},
		methods:{
			goHome(){
				let that=this;
				let org=that.$storeGetter.getOrg();
				that.$router.push({
					name:'home',
					params:{
						groupAccount:org.groupAccount
					}
				});
			}
		}
	}
</script> 