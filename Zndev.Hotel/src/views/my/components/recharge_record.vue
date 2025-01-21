<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="充值记录">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>			
			<div class="content-wrap" v-if="loaded">
			    <msg class="empty-tips-msg" v-if="packages.length==0" title="亲，您还没充值过喔" description="赶紧去看看有没有优惠的充值活动吧" icon="info"></msg>
			    <div class="recharge-packages" v-else>
				    <div class="package-item record-item" v-for="(pack,i) in packages" :key="i">
				      <div class="time">充值时间/店铺：{{pack.insertTime|dateFormat('YY-MM-DD HH:mm:ss')}}/{{pack.groupName}}</div>
				      <div class="float-left m-r-m">
				      	<div class="iconfont" :class="{'icon-xiadanyouhui':pack.amtDonate>0,'icon-chongzhi4':pack.amtDonate<=0}"></div>
				      </div>
				      <div class="float-left">
				      	<div class="font14px text-left">{{pack.packageName}}</div>
				      	<div class="text-left">充¥{{pack.amtRecharge}} <span v-if="pack.amtDonate>0">送¥{{pack.amtDonate}}</span></div>
				      	<div class="text-left">实际到账 <span class="money">¥{{pack.amtRecharge+pack.amtDonate}}</span></div>
				      </div>
				    </div>
			    </div>
		    </div>
        </div>
	</popup>
</template>
<script>
export default {
  data() {
    return {
      showPopup: this.isShow,
      packages: [],
      loaded: false
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/RechargeRecord"
        })
        .then(res => {
          //console.log(res);
          that.packages = res.data ? res.data : [];
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    onHide() {
      this.$emit("update:isShow", false);
    }
  },
  created() {
    this.loadList();
  }
};
</script>
