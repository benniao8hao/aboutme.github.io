<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="nav-header">
			<x-header title="常用信息">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="main-container">
			<div v-sticky="{
						zIndex: 1000,
						stickyTop:46
					}">
				<tab :line-width=1 active-color='#f39709' custom-bar-width="80px" v-model="curTabType">
					<tab-item class="vux-center"  v-for="(item, index) in tabs" :key="index">{{item.title}}</tab-item>
				</tab>
			</div>
			<addresses v-if="curTabType==1" :isShow="true" :isShowHeader="false"></addresses>
			<passenger v-else :isShow="true" :isShowHeader="false"></passenger>
        </div>
	</popup>
</template>
<script>
import VueSticky from "vue-sticky";

export default {
  directives: {
    sticky: VueSticky
  },
  data() {
    return {
      curTabType: 0,
      tabs: [
        {
          title: "常用旅客"
        },
        {
          title: "收货地址"
        }
      ],
      showPopup: this.isShow
    };
  },
  components: {
    addresses: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./addresses.vue"),
    passenger: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./passenger.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    }
  },
  created() {}
};
</script>
