<template>
<div>	
<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">	
	<div class="main-container product-book-bd">
		<div class="content-wrap header groupbuy">
			<div class="warp">
				<div class="title">
					{{product.name}}
				</div>
				<!--<div class="desc">{{product.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}到{{product.overTime|dateFormat('YY-MM-DD HH:mm:ss')}}期间有效</div>-->
				<div class="desc">有效期至{{product.overTime|dateFormat('YY-MM-DD HH:mm:ss')}}</div>
				<div class="price">
					¥<strong>{{product.priceNow}}</strong>/{{product.unit}}
				</div>
			</div>
		</div>
		<div class="content-wrap">
			<group  class="form-group m-t-m" label-margin-right="2em" label-align="justify">
		      <x-switch title="私密开团" v-model="model.isPrivacy" :value-map="[0, 1]"></x-switch>
		      <cell primary="content" :title="`${product.priceNow}元/${product.unit}`" :value="`${product.priceNow}元`">
		      	<div slot="title">
		      		<div class="float-left">选择人数</div>
		      		<div class="float-right m-l-m price-color">{{product.priceNow}}元/{{product.unit}}</div>
		      	</div>
				 <inline-x-number @input="onNumChange" :title="`${product.priceNow}元/${product.unit}`" v-model="model.num" :min=1 :max="allowBookingMaxNum" width="50px"></inline-x-number>
			  </cell>
		    </group>
			<group label-width="3em" class="form-group m-t-m" label-margin-right="2em" label-align="justify">
				<x-input title="姓名" v-model="model.name" :max=4 :should-toast-error=false :required="true"></x-input>
				<x-input title="手机" v-model="model.mobile" :max=11 :should-toast-error=false :required="true"></x-input>
				<x-textarea title="备注" v-model="model.remark" :max="255" placeholder="订单留言" :show-counter="true" :rows="3" :cols="30"></x-textarea>
			</group>
		</div>
		<div class="bottom-bar">
			<div class="content-wrap">
			<flexbox :gutter="0">
			  <flexbox-item :span="2">
			  	<div @click="onHide" class="back">
	      			<span class="iconfont icon-xiangzuojiantou"></span>返回
	      		</div>
		      </flexbox-item>
		      <flexbox-item  class="text-center">
      				实付金额:<span class="iconfont icon-rmb">{{model.total}}</span>
		      </flexbox-item>
		      <flexbox-item :span="3" class="btn-submit weui-btn_primary">
		      	<div @click="onSubmit">开团</div>
		      </flexbox-item>
		    </flexbox>
		    </div>
		</div>
	</div>
 </popup>
<order-payment 
		@onCancelPay="onCancelPay"  
		@onValidedPassowrd="onValidedPassowrd" 
		:canWeiXinPay="payTypes.canWeiXinPay"
		:canCashPay="payTypes.canCashPay"
		:canPrestorePay="payTypes.canPrestorePay"
		:canBonusPay="payTypes.canBonusPay"
		:orderNO="newOrderNO"
		:orderType="31"
		:amt="model.total" 
		:orderDetailUrl="orderDetailUrl"
		:isShow.sync="isShowOrderPayment" 
		v-if="isShowOrderPayment">
	</order-payment>
	<order-submited-success :orderDetailUrl="orderDetailUrl" :noticeStatus="noticeStatus" :paymentState="paymentState" v-if="isSuccessed"></order-submited-success>
</div>
</template>

<script>
import validator from "@/utils/validator";
export default {
  data() {
    return {
      orderDetailUrl: "",
      paymentState: 0,
      noticeStatus: 0,
      isSuccessed: false, //是否已经预订成功
      showPopup: this.isShow,
      isShowOrderPayment: false,
      newOrderNO: "",
      payTypes: {
        canWeiXinPay: true,
        canCashPay: true,
        canPrestorePay: true,
        canBonusPay: true
      },
      model: {
        num: 1,
        isGroupon: true,
        price: this.product.priceNow,
        total: this.product.priceNow,
        name: this.name,
        mobile: this.mobile,
        remark: "",
        isPrivacy: 1,
        storeId: this.storeId,
        productId: this.product.tid
      }
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object,
      required: true
    },
    mobile: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    storeId: {
      required: true
    },
    id: {
      required: true
    }
  },
  computed: {
    allowBookingMaxNum() {
      let p = this.product;
      //				if(p.ignoreRepertory){
      //					return 9999;
      //				}
      if (p.allowOrderNum > 0) return p.allowOrderNum;
      return p.repertory;
    }
  },
  components: {
    OrderPayment: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/order_payment.vue"),
    OrderSubmitedSuccess: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/OrderSubmitedSuccess.vue")
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    onNumChange(val) {
      this.model.total = (this.model.price * val).toFixed(2);
    },
    onValidedPassowrd(paymentType) {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Pay",
          params: {
            orderNO: that.newOrderNO,
            payType: paymentType
          }
        })
        .then(res => {
          //console.log(res);
          //that.$tips.done('支付成功');
          that.paymentState = 1;
          that.noticeStatus = res.data;
          that.isSuccessed = true;
        })
        .catch(err => {
          that.isShowOrderPayment = true;
        });
    },
    onCancelPay() {
      this.paymentState = 0;
      this.isSuccessed = true;
    },
    onSubmit() {
      let that = this;
      if (that.model.name == "") {
        that.$tips.warn("请填写姓名");
        return;
      }
      if (!validator.isMobile(that.model.mobile)) {
        that.$tips.warn("请正确填写手机号码");
        return;
      }
      if (that.model.num > that.allowBookingMaxNum) {
        that.$tips.warn(
          "每人最多只能订购${that.allowBookingMaxNum}${that.model.unit}"
        );
        return;
      }
      //console.log(that.model);
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Submit",
          data: that.model
        })
        .then(res => {
          //console.log(res);
          //that.refreshCar();
          that.noticeStatus = res.data.noticeStatus;
          that.newOrderNO = res.data.orderNO;
          that.isShowOrderPayment = true;
          //that.isSuccessed=true;
          let org = that.$storeGetter.getOrg();
          that.orderDetailUrl = `/my/order/groupon/${org.groupAccount}/${
            res.data.orderId
          }`;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>