<template>
	<div class="order-detail">
		<div v-if="!isShowTimeline">
		<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
			<div class="nav-header">
				<x-header title="订单详情">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>				
			<div class="main-container top-header-padding">
				<div class="content-wrap" v-if="loaded">
					<group class="status">
						<cell is-link :title="title"  :inline-desc='linkDesc'>
							<div class="font13px" @click="chageShow('log')">进度详情</div>
						</cell>
					</group>
					<div class="amt">
						订单总额：<span class="price">¥{{model.totalAmt}}</span>
						<div class="float-right">{{formatCategory(model.category)}}</div>
					</div> 
					<collapsible>
						<span class="iconfont icon-menu" slot="icon"></span>
						<div slot="title">订单摘要</div>
						<div>
							<group label-align="right" label-width="5em" class="no-border">
							 	<cell v-if="model.paymentState==0&&model.status==0" primary="content" title="自动取消" :value="`${model.overTimeAfterBooking}后未付款将自动取消。`"></cell>
							 	<cell primary="content" title="商品分类" :value="formatCategory(model.category)"></cell>
							 	<cell primary="content" title="预订数量" :value="`${model.totalNum}${model.unit}`"></cell>
							 	<cell primary="content" title="预约时间" v-if="!model.noAppointment">{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}至{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}</cell>							 	
		   				        <cell primary="content" title="有效期至" :value="`${model.overTime} 后失效`"></cell>
		   				        <cell primary="content" title="房态先知"  v-if="model.category==1&&model.roomId>0&&model.priceTypeId>0">
		   				        	<div>想提前知道哪天有房可预约吗？<x-button :gradients="['#FF61AD','#FF2719']" mini type="primary" @click.native="viewRoomState(model)">立即点击</x-button></div>
		   				        </cell>
		   				        <template v-if="model.isGroupon">
		   				        	<cell primary="content" title="团购要求" :value="`参团人数达到${model.grouponNum}人`"></cell>
		   				        	<cell primary="content" title="已团人数" :value="`已有${model.bookedNum}人成功参团`"></cell>
		   				        	<cell primary="content" title="团购状态" :value="model.status>4?'团购失败':model.grouponNum<=model.bookedNum?'团购成功':'等待组团'"></cell>
		   				        </template>
						    </group>
						    <div class="text-center m-t-m" @click="viewDetail(model)">
						    	查看更多
						    </div>
					    </div>						
					</collapsible>
					
					<div class="bar">
						<x-button type="primary" v-if="model.paymentState==0&&model.status<4" @click.native="isShowOrderPayment=true">立即支付</x-button>
						<x-button type="primary" v-if="model.paymentState==1&&model.status==2" @click.native="showCouponCode">消费券码</x-button>
						<x-button type="warn" v-if="model.status<3&&model.allowCancel" @click.native="cancelOrder">取消订单</x-button>
						<x-button type="warn" @click.native="deleteOrder" v-if="showDeleteButton">删除订单</x-button>
						<!--<x-button type="warn">删除</x-button>-->
					</div>
					<div class="detail-items">
						<div>
							<div class="field">&nbsp;&nbsp;订单号：</div>							
							<div class="text">
								{{model.orderNO}}
							</div>
						</div> 
						<div>
							<div class="field">预订时间：</div>							
							<div class="text">
								{{model.insertTime}}
							</div>
						</div>
						<div v-if="model.paymentState>0">
							<div class="field">支付单号：</div>							
							<div class="text">
								{{model.paymentNO}}
							</div>
						</div>
						<div v-if="model.paymentState>0&&model.status==5">
							<div class="field">退款状态：</div>							
							<div class="text">
								{{model.paymentState==1?'待退款':'已退款'}}
							</div>
						</div> 
						<div class="border-top">
							<div class="field">&nbsp;&nbsp;联系人：</div>							
							<div class="text">
								{{model.buyerName}}
							</div>
						</div> 
						<div>
							<div class="field">联系手机：</div>							
							<div class="text">
								{{model.mobile}}
							</div>
						</div> 
						<div v-if="model.buyerMessage">
							<div class="field">预订留言：</div>							
							<div class="text">
								{{model.buyerMessage}}
							</div>
						</div> 
					</div>
					<div class="p-a-m text-left bg-desc">
						<div class="font16px">
							温馨提示
						</div>
						<template v-if="model.paymentState==0&&model.status==0">
							<div class="desc-text">
								请于{{model.overTimeAfterBooking}}前支付订单，否则订单将自动过期。 
							</div>
						</template>
						<template v-if="model.paymentState==1&&model.status==0">
							<div class="desc-text">
								该订单预约消费时间为： {{model.appointmentBeginTime}} 至  {{model.appointmentEndTime}} 。
							</div>
							<div class="desc-text">
								请在该时段内预约。
							</div>							
						</template>
						<!--<template v-if="model.paymentState==1&&model.status==2">
							<div class="desc-text">
								您已预约在： {{model.appointmentTime}} 消费。
							</div>
							<div class="desc-text">
								请尽量准时赴约喔。
							</div>							
						</template>-->
						<template v-if="model.paymentState==1&&model.status<3">
							<div class="desc-text">
								该订单已预订成功，有效期至： {{model.overTime}} 。
							</div>
							<div class="desc-text">
								请在有效期内消费，过期将失效。
							</div>							
						</template>
						<div class="desc-text" v-if="model.status==3||model.status==4">
							该订单已经消费。
						</div>	
						<div class="desc-text" v-if="model.status==5">
							<template v-if="model.paymentState==1">
								该订单已经取消，待客服处理完成后，将应退金额返还给您。
							</template>
							<template v-else>
								该订单已经取消，应退金额已退还，请查收。
							</template>
						</div>
						<div class="desc-text" v-if="model.status==6">
							抱歉，该订单已经过期。
						</div>
					</div>
				</div>
			</div>
	    </popup>
		</div>
		<div v-if="isShowTimeline">
			<div class="main-container top-header-padding">
				<div class="nav-header">
					<x-header title="进度详情">
						<div slot="overwrite-left" @click="onHide">
				          	<span class="iconfont icon-xiangzuojiantou"></span>返回
			            </div>
					</x-header>
				</div>
				<div class="content-wrap p-a-l bg-white full-height text-left">
					<div class="font16px border-bottom">订单号：{{model.orderNO}}</div>
					<timeline>
						<timeline-item v-if="model.status==6">
							<h4 class="p-l-m">订单过期</h4>
							<p class="p-l-m">{{model.overTimeAfterBooking}}</p>
						</timeline-item>
						<timeline-item v-if="model.status==5">
							<h4 class="p-l-m">订单取消</h4>
							<p class="p-l-m">{{model.cancelTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.status==4">
							<h4 class="p-l-m">订单完成</h4>
							<p class="p-l-m">{{model.finishedTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.status==3">
							<h4 class="p-l-m">订单消费</h4>
							<p class="p-l-m">{{model.sendTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.status>=2&&model.status<4&&model.sendTime!='0001-01-01 00:00:00'">
							<h4 class="p-l-m">{{model.isGroupon?'团购成功':'抢购成功'}}</h4>
							<p class="p-l-m">{{model.sendTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.status>=1&&model.status<4&&model.confirmTime!='0001-01-01 00:00:00'">
							<h4 class="p-l-m">{{model.isGroupon?'参团成功':'预约成功'}}</h4>
							<p class="p-l-m">{{model.confirmTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.paymentState>0">
							<h4 class="p-l-m">支付订单</h4>
							<p class="p-l-m">{{model.paymentTime}}</p>
						</timeline-item>
						<timeline-item>
							<h4 class="p-l-m">提交订单</h4>
							<p class="p-l-m">{{model.insertTime}}</p>
						</timeline-item>
					</timeline>
				</div>
			</div>
		</div>
		<repast-item-detail :isShow.sync="itemDetail.show" v-if="itemDetail.show" :item="itemDetail.item"></repast-item-detail>
		<room-state :maxDate="rommStateEndDate" :minDate="roomStateBeginDate" v-if="isShowRoomState" :roomStates="roomStates" :isShow.sync="isShowRoomState"></room-state>
		<coupon-code :tid="model.tid" v-if="isShowCouponCode" :isShow.sync="isShowCouponCode"></coupon-code>
		<order-payment 
			@onCancelPay="onCancelPay"
			@onValidedPassowrd="onValidedPassowrd"
			:canWeiXinPay="model.canWeiXinPay"
			:canCashPay="model.canCashPay"
			:canPrestorePay="model.canPrestorePay"
			:canBonusPay="model.canBonusPay"
			:orderNO="model.orderNO" 
			:amt="model.totalAmt"
			:orderType="model.isGroupon?31:32"
			:isShow.sync="isShowOrderPayment"
			:orderDetailUrl="orderDetailUrl"
			v-if="isShowOrderPayment">
		</order-payment>
		<order-submited-success :orderDetailUrl="orderDetailUrl" :noticeStatus="noticeStatus" :paymentState="paymentState" v-if="isSuccessed"></order-submited-success>
	</div>
</template>

<script>
import { categories } from "@/utils/const.js";
import validator from "@/utils/validator";
export default {
  data() {
    return {
      loaded: false,
      orderDetailUrl: "",
      paymentState: 0,
      noticeStatus: 0,
      isSuccessed: false, //是否已经预订成功
      isShowOrderPayment: false,
      isShowRoomState: false,
      roomStateBeginDate: "",
      rommStateEndDate: "",
      roomStates: [], //房态
      hasChangedOrder: false,
      isShowCouponCode: false, //显示券码
      isShowTimeline: false,
      itemDetail: {
        show: false,
        item: {}
      },
      showPopup: this.isShow,
      title: "",
      linkDesc: "",
      model: {}
    };
  },
  components: {
    collapsible: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/znCollapsible.vue"),
    repastItemDetail: () =>
      import(/* webpackChunkName: "myOrder" */ "./discounts_item_detail.vue"),
    roomState: () =>
      import(/* webpackChunkName: "hotelBooking" */ "@/components/calendar/room_state.vue"),
    couponCode: () =>
      import(/* webpackChunkName: "myOrder" */ "./coupon_code.vue"),
    OrderPayment: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/order_payment.vue"),
    OrderSubmitedSuccess: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/OrderSubmitedSuccess.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    id: {
      required: true
    },
    groupAccount: {
      //如果非空则是独立页面打开的访问的，否则是从订单列表以弹窗方式打开的
      type: String,
      default: ""
    }
  },
  computed: {
    showDeleteButton() {
      let model = this.model;
      if (model.status == 0 && model.paymentState == 0) return true;
      if (model.status == 5 && model.paymentState == 1) return false;
      return model.status > 2;
    }
  },
  methods: {
    formatCategory(category) {
      let ct = categories.find(c => c.value == category);
      if (ct) return ct.label;
      return "未知";
    },
    showCouponCode() {
      let that = this;
      that.$tips.prompt({
        title: "该操作需要验证登录码密码",
        placeholder: "请填写登录密码",
        inputAttrs: { type: "password" },
        onConfirm: function(msg) {
          //test-begin
          that.isShowCouponCode = true;
          return;
          //test-end
          if (msg == "") {
            that.$tips.warn("请填写登录密码", 1000 * 3);
            setTimeout(function() {
              that.showCouponCode();
            }, 1000 * 3.1);
            return false;
          }
          if (!validator.isPassword(msg)) {
            that.$tips.warn(
              "密码只能由数字、英文符号或字母组成，6-20位",
              1000 * 4
            );
            setTimeout(function() {
              that.showCouponCode();
            }, 1000 * 4.1);
            return false;
          }
          that
            .$axios({
              url: "/Api.Web/ZnMember/CheckPassword",
              params: {
                password: msg
              }
            })
            .then(res => {
              if (res.data) {
                //验证原密码通过后
                that.isShowCouponCode = true;
              } else {
                that.$tips.alert("密码错误");
              }
            })
            .catch(err => console.log(err));
        }
      });
    },
    viewRoomState(model) {
      let that = this;
      let _d = that.$options.filters.dateFormat(new Date(), "YYYY-MM-DD");
      if (model.appointmentBeginTime == "0001-01-01 00:00:00") {
        model.appointmentBeginTime = "";
      }
      let params = {
        beginDate: model.appointmentBeginTime || _d,
        endDate: model.overTime,
        storeId: model.storeId,
        roomId: model.roomId,
        priceTypeId: model.priceTypeId
      };
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceProduct/QueryRoomState",
          params
        })
        .then(res => {
          that.roomStates = res.data;
          that.roomStateBeginDate = params.beginDate;
          that.rommStateEndDate = params.endDate;
          that.isShowRoomState = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    _doCancel() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Cancel",
          params: {
            id: that.model.tid
          }
        })
        .then(res => {
          //console.log(res);
          that.loadDetail();
          let status = res.data.status;
          if (status != 200) {
            that.$tips.warn(res.data.message);
            return;
          }
          //that.$tips.done('取消成功');
          //that.hasChangedOrder=true;
          that.noticeStatus = data.data;
          if (that.noticeStatus == 43004) {
            that.paymentState = 3;
            that.isSuccessed = true;
          } else {
            that.loadDetail();
            that.$tips.done("取消成功");
            that.hasChangedOrder = true;
          }
        })
        .catch(err => console.log(err));
    },
    _doDelete() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Delete",
          params: {
            id: that.model.tid
          }
        })
        .then(res => {
          //console.log(res);
          that.$tips.done("删除成功");
          that.hasChangedOrder = true;
          that.onHide();
        })
        .catch(err => console.log(err));
    },
    deleteOrder() {
      let that = this;
      that.$tips.confirm({
        content: "确认要删除该订单吗？",
        onConfirm: function() {
          that._doDelete();
        }
      });
    },
    cancelOrder() {
      let that = this;
      if (!that.model.allowCancel) {
        that.$tips.warn("该订单不允许取消");
        return;
      }
      let poundageRate =
        that.model.poundage > 0
          ? `，将扣取手续费（订单金额的${that.model.poundage}%)`
          : "";
      let tipsMsg =
        that.model.paymentState == 1
          ? `该订单已付款${poundageRate}，是否取消？`
          : "确认要取消该订单吗？";
      that.$tips.confirm({
        content: tipsMsg,
        onConfirm: function() {
          that._doCancel();
        }
      });
    },
    viewDetail(item) {
      this.itemDetail.item = item;
      this.itemDetail.show = true;
    },
    onValidedPassowrd(paymentType) {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Pay",
          params: {
            orderNO: that.model.orderNO,
            payType: paymentType
          }
        })
        .then(res => {
          //console.log(res);
          that.hasChangedOrder = true;
          //that.loadDetail();
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
      //console.log('取消支付，跳转到订单中心');
    },
    onHide() {
      let th = this;
      if (th.isShowTimeline) {
        th.isShowTimeline = false;
        return;
      }
      if (th.groupAccount) {
        //单页面打开来访问的
        th.$router.push({
          //返回个人中心
          name: "my",
          params: th.$storeGetter.getOrg()
        });
      } else {
        if (th.hasChangedOrder) {
          th.$emit("afterChangeOrder");
        }
        th.$emit("update:isShow", false);
      }
    },
    chageShow(type = "log") {
      if (type == "log") {
        this.isShowTimeline = true;
      }
    },
    goRestaurant() {
      let params = this.$storeGetter.getOrg();
      this.$router.push({
        name: "restaurant",
        params
      });
    },
    toStatusShow() {
      let th = this;
      let status = th.model.status,
        isGroupon = th.model.isGroupon,
        payState = th.model.paymentState;
      if (status == 0) {
        th.title = "待付款";
        th.linkDesc =
          payState == 0 ? "该订单还未付款，请及时付款，以免过期。" : "已付款";
        return;
      }
      if (status == 1) {
        if (isGroupon) {
          th.title = "待组团";
          th.linkDesc = `参团成功，当参团人数达${
            th.model.grouponNum
          }人，团购成功！`;
        } else {
          th.title = "待预约";
          th.linkDesc = "抢购成功，请与商家预约确认消费时间。";
        }
        return;
      }
      if (status == 2) {
        th.title = "待消费";
        th.linkDesc = isGroupon
          ? "团购成功，请在有效期内消费。"
          : "抢购成功，请在有效期内消费。";
        return;
      }
      if (status == 3) {
        th.title = "已消费";
        th.linkDesc = "订单已消费结束，欢迎再次光临！";
        return;
      }
      if (status == 4) {
        th.title = "已完成";
        th.linkDesc = "订单已完成，欢迎再次光临！";
        return;
      }
      if (status == 5) {
        th.title = "已取消";
        th.linkDesc =
          payState == 1
            ? "订单已取消，待退款。"
            : "订单已取消，您可以重新预订。";
        return;
      }
      if (status == 6) {
        th.title = "已过期";
        th.linkDesc = "订单已过期，您可以重新预订。";
        return;
      }
    },
    loadDetail() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Detail",
          params: {
            id: that.id
          }
        })
        .then(res => {
          //console.log(res);
          that.model = res.data;
          let org = that.$storeGetter.getOrg();
          that.orderDetailUrl = `/my/order/discounts/${org.groupAccount}/${
            that.model.tid
          }`;
          that.toStatusShow();
          that.loaded = true;
          //console.log(that.model.everydayPrice)
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    let that = this;
    if (that.groupAccount) {
      that.$storeGetter
        .getStores(that.groupAccount, that.storeId, false)
        .then(defaultStore => {
          //console.log(defaultStore);
          that.loadDetail();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      that.loadDetail();
    }
  },
  mounted() {
    document.title = "订单详情";
  },
  destroyed() {
    document.title = "酒店订单";
  }
};
</script>
 