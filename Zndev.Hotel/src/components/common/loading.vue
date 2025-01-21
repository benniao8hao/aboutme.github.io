<template>
	<loading v-model="isLoading"></loading>
</template>

<script>
	export default{
		data(){
			return {
				isLoading:true,
				redirect:''
			}
		}, 
		created(){
			console.log(this.$route.query)
			let redirect= this.$route.query.redirect;
			console.log(redirect);
			if(redirect)
				this.redirect=redirect;
//			else 
//				this.$router.push({name:'404'});
		},
		mounted(){
			let that=this;
			setTimeout(function(){
				that.$router.push({path:that.redirect});
			},1000*10);
		}
	}
</script> 