<template>
<div>	
	<popup position="top" :is-transparent="true" :show-mask="false" v-model="showPopup" @on-hide="onHide" class="full-height">
		<div class="main-container">
			<div class="content-wrap">
				<actionsheet v-model="showPayTypes" 
					:menus="payTypes" 
					:close-on-clicking-menu="false"
					:close-on-clicking-mask="false"
					@on-click-menu="onClickMenu"
					show-cancel 
					cancel-text="关闭"
					@on-click-menu-cancel="cancelPay"
					>
					<p slot="header" class="bold">请选择支付方式</p>
				</actionsheet>
		    </div>
        </div>
	</popup>
	<input-payment-password title="订单在线支付" @onCancelPay="onClosePasswordBox" :money="amt" @onValidedPassowrd="onValidedPassowrd" v-if="showPassowrdBox" :isShow.sync="showPassowrdBox"></input-payment-password>	
</div>	
</template>
<script>
export default {
  data() {
    return {
      showPassowrdBox: false,
      showPayTypes: false,
      showPopup: this.isShow,
      payTypes: [],
      selectedPaymentType: 0
    };
  },
  components: {
    inputPaymentPassword: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/input_payment_password.vue")
  },
  props: {
    orderNO: {
      type: String,
      required: true
    },
    orderType: {
      //订单类型 对应 enum OrderType
      type: Number,
      required: true
    },
    amt: {
      type: Number,
      required: true
    },
    canWeiXinPay: {
      type: Boolean,
      default: true
    },
    canCashPay: {
      type: Boolean,
      default: true
    },
    canPrestorePay: {
      type: Boolean,
      default: true
    },
    canBonusPay: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    orderDetailUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    onValidedPassowrd() {
      this.$emit("onValidedPassowrd", this.selectedPaymentType);
      this.onHide();
    },
    onClosePasswordBox() {
      this.showPassowrdBox = false;
    },
    onClickMenu(key, item) {
      let that = this;
      if (key != "cancel" && item) {
        if (key == 2) {
          //微信支付
          //先去获取openid
          let org = that.$storeGetter.getOrg();
          that
            .$axios({
              url: "/Api.WeChat/OAuth2/AuthorizeUrl",
              data: {
                groupId: org.groupId,
                returnUrl: "http://www.0898so.com/znhotel/WxPay",
                action: "pay",
                state: {
                  orderNO: that.orderNO,
                  orderType: that.orderType,
                  groupId: org.groupId,
                  redirectUrl: that.orderDetailUrl
                },
                snsapiType: 0,
                isGetUserInfo: false
              }
            })
            .then(res2 => {
              window.location.href = res2.data; //请求微信服务器
            })
            .catch(error => console.log(error));
        } else {
          that.selectedPaymentType = key;
          that.showPassowrdBox = true;
        }
      }
    },
    cancelPay() {
      this.showPayTypes = false;
      this.$emit("onCancelPay");
      this.onHide();
    },
    initShow() {
      let that = this;
      that.payTypes.push({
        label: "微信",
        type: that.canWeiXinPay ? "" : "disabled",
        value: 2
      });
      //that.payTypes.push({label:'现金',value:1,type:that.canCashPay?'':'disabled'})
      that.payTypes.push({
        label: "预充值",
        value: 4,
        type: that.canPrestorePay ? "" : "disabled"
      });
      that.payTypes.push({
        label: "奖金",
        value: 5,
        type: that.canBonusPay ? "" : "disabled"
      });
      that.showPayTypes = true;
    }
  },
  created() {
    this.initShow();
  }
};
</script>
