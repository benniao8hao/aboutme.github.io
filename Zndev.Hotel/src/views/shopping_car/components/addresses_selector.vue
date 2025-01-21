<template>
	<div>
		<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
			<div class="nav-header">
				<x-header title="选择收货地址">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>取消
		            </div>
		            <div slot="right" @click="showManage=true">
						管理<span class="iconfont icon-xiugai"></span>
					</div>
				</x-header>
			</div>
			<div class="main-container top-header-padding">
				<div class="content-wrap">
					<msg class="empty-tips-msg" v-if="addresses.length==0" title="您还没有常用地址喔" description="添加常用地址填写订单更便捷" icon="info"></msg>
					<group class="md-group" v-else>
				      <cell-box primary="content" v-for="(address,i) in addresses" :key="i">
				      	<div class="full-width" @click="chooseAddress(address)">
					      	<div class="full-width float-left">
			        			<div class="float-left bold">{{address.name}}</div>
			        			<div class="float-right m-r-l">{{address.phone}}</div>
			        		</div>
			        		<div class="full-width float-left text-left p-r-m">{{address.address}}</div>
		        		</div>
				      </cell-box>
				    </group>
			    </div>
	        </div>
	    </popup>
	    <address-manager v-if="showManage" @afterDataChanged="loadList" :isShow.sync="showManage"></address-manager>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showManage: false,
      showPopup: this.isShow,
      addresses: []
    };
  },
  components: {
    addressManager: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "@/views/my/components/addresses.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  created() {
    this.loadList();
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyRecivers"
        })
        .then(res => {
          //console.log(res);
          that.addresses = res.data;
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    chooseAddress(address) {
      this.$emit("onSelected", address);
      this.onHide();
    }
  },
  mounted() {
    document.title = "选择收货地址";
  },
  destroyed() {
    document.title = "确认订单";
  }
};
</script>
