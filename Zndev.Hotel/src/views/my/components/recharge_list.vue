<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="充值套餐">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>			
			<div class="content-wrap" v-if="loaded">
				<group>
			      <cell-box>
			      		<div class="text-center full-width">
			      			{{groupName}}
			      		</div>
			      </cell-box>
			    </group>
			    <msg class="empty-tips-msg" v-if="packages.length==0" title="亲，本轮充值活动已经结束了" description="下期将推出更优惠的充值活动，敬请期待！" icon="info"></msg>
			    <div class="recharge-packages" v-else>
				    <div class="package-item" v-for="(pack,i) in packages" :key="i">
				      <div class="time">活动时间：{{pack.beginTime|dateFormat('YY-MM-DD HH:mm:ss')}}至{{pack.overTime|dateFormat('YY-MM-DD HH:mm:ss')}}</div>
				      <div class="float-left m-r-m">
				      	<div class="iconfont" :class="{'icon-xiadanyouhui':pack.amtDonate>0,'icon-chongzhi4':pack.amtDonate<=0}"></div>
				      </div>
				      <div class="float-left">
				      	<div class="font14px text-left">{{pack.packageName}}</div>
				      	<div class="text-left">充¥{{pack.amtRecharge}} <span v-if="pack.amtDonate>0">送¥{{pack.amtDonate}}</span></div>
				      	<div class="text-left">实际到账 <span class="money">¥{{pack.amtRecharge+pack.amtDonate}}</span></div>
				      </div>
				      <div class="float-right action-btn" @click="recharge(pack.tid)">
				      	<div>立即<br/>充值</div>
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
    },
    groupName: {
      type: String,
      required: true
    },
    groupId: {
      type: Number,
      required: true
    }
  },
  methods: {
    recharge(packageId) {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/Recharge",
          params: {
            packageId
          }
        })
        .then(res => {
          let org = that.$storeGetter.getOrg();
          that
            .$axios({
              url: "/Api.WeChat/OAuth2/AuthorizeUrl",
              data: {
                groupId: that.groupId,
                returnUrl: "http://www.0898so.com/znhotel/WxPay",
                action: "pay",
                state: {
                  orderNO: res.data,
                  orderType: 41,
                  groupId: that.groupId,
                  redirectUrl: `/my/${org.groupAccount}`
                },
                snsapiType: 0,
                isGetUserInfo: false
              }
            })
            .then(res2 => {
              window.location.href = res2.data; //请求微信服务器
            })
            .catch(error => console.log(error));
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/RechargePackage",
          params: {
            groupId: that.groupId
          }
        })
        .then(res => {
          //console.log(res);
          that.packages = res.data;
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
