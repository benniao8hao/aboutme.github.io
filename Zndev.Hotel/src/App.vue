<template>
	<div class="full-height full-width">
		<loading v-model="isLoading" text="loading"></loading>
		<transition>
			<router-view class="router-view"></router-view>
		</transition>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		name: 'app',
		computed: {
			...mapState({
				isLoading: state => state.app.isLoading
			}),
		}
	}
</script>
<style lang="less">
	@import '~vux/src/styles/reset.less';
</style>