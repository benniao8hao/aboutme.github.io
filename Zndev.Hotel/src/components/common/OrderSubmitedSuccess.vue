<template>
	<popup v-model="showPopup" :show-mask="false" position="top" class="full-height">
		<div class="main-container  bg-white">
			<div class="content-wrap">
				<msg :title="title" :buttons="buttons" icon="success">
					<div slot="description">
						<div v-if="paymentState==1">
							恭喜您预订成功，您的满意，是我们最大的追求。
						</div>
						<template v-else>
							<div v-if="paymentState==3">
								您的订单已经成功取消，期待您再次惠顾。
							</div>
							<div v-else>
								订单提交成功，请尽快完成支付，以免订单过期。
							</div>
						</template>
					</div>
				</msg>
				<div class="my-share" v-if="showQRCode">
					<div class="qr-code">
						<div class="qrcode">
							<img src="http://web-img.0898so.com/qrcode_160x160.jpg" alt="" />
						</div>
						<div>
							敬请关注【梵旗共享】公众号
							<div class="f-red">以便接收订单与资金变动通知</div>
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
      showPopup: true,
      buttons: []
    };
  },
  computed: {
    title() {
      let str =
        this.paymentState == 1
          ? "预订成功"
          : this.paymentState == 0
            ? "提交成功"
            : "取消成功";
      return str;
    },
    showQRCode() {
      //只有梵旗共享公众号设置了消息模板，其他的，以后实现了第三方开放平台后再说
      let org = this.$storeGetter.getOrg();
      return this.noticeStatus == 43004 && org.groupId == 1;
    }
  },
  props: {
    noticeStatus: {
      type: Number,
      required: true
    },
    paymentState: {
      type: Number,
      required: true
    },
    orderDetailUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    goMyCenter() {
      let params = this.$storeGetter.getOrg();
      if (!params) {
        this.$router.push({ name: "404" });
        return;
      }
      this.$router.replace({
        name: "my",
        params
      });
    },
    initButtons() {
      let that = this;
      that.buttons.push({
        type: "primary",
        text: "查看订单",
        link: that.orderDetailUrl
      });
      that.buttons.push({
        type: "default",
        text: "个人中心",
        onClick: that.goMyCenter.bind(this)
      });
    }
  },
  created() {
    this.initButtons();
  }
};
</script>
