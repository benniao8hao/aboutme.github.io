<template>
<div>	
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
				<div class="content-wrap">
					<group class="status">
						<cell is-link :title="title"  :inline-desc='linkDesc'>
							<div class="font13px" @click="chageShow('log')">进度详情</div>
						</cell>
					</group>
					<div class="amt">
						订单总额：<span class="price">¥{{model.totalAmt}}</span>
						<div class="float-right">{{model.logisticsType==0?'到店消费':'外卖派送'}}</div>
					</div>
					
					<collapsible>
						<span class="iconfont icon-menu" slot="icon"></span>
						<div slot="title">订单商品</div>
						<div class="store-pro-list">
					      	<flexbox class="car-item" v-for="(p,j) in model.items" slot="after-title" :key="j">
						      <flexbox-item :span="3" class="pro-img">
						      	<img :src="_getImgUrl(p.snapShot)" :alt="p.productName" @click.prevent="viewDetail(p)"/>
						      </flexbox-item>
						      <flexbox-item>
						      	<div class="pro-name"  @click="viewDetail(p)">{{p.productName}}</div>
						      	<div class="price-bd">
						      		<div class="price" :class="{'text-through':p.deleted||p.disabled}">
						      			¥<strong>{{p.price}}</strong>/{{p.unit}}
						      		</div>
						      		<div class="num">
						      			 x{{p.num}}
						      		</div>
						      	</div>
						      </flexbox-item>
						    </flexbox>
					    </div>						
					</collapsible>
					
					<div class="bar">
						<x-button type="primary" v-if="model.paymentState==0&&model.status<5" @click.native="isShowOrderPayment=true">立即支付</x-button>
						<x-button type="primary" v-if="model.paymentState==1&&model.status==4&&model.evaluateStatus==0" @click.native="toComment">立即评价</x-button>
						<x-button type="warn" v-if="model.status<2" @click.native="cancelOrder">取消订单</x-button>
						<x-button type="warn" @click.native="deleteOrder" v-if="showDeleteButton">删除订单</x-button>
					</div>
					<div class="map-bd">
						<div class="map-hd">
							{{model.storeName}}
						</div>
						<map-location-simple v-if="model.latitude" @onClickLocation="isShowMap=true" @onMapClose="onMapClose" :lng="model.longitude" :lat= "model.latitude"></map-location-simple>
						<div class="over-layer" @click="isShowMap=true">
						</div>
						<div class="address" @click="isShowMap=true">
							<span class="iconfont icon-location"></span>
							{{model.address}}
						</div>
						<div class="btn-bar">
							<div @click="goRestaurant">餐厅主页</div>
							<div><a :href="'tel:'+model.tel">联系餐厅</a></div>
						</div>
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
						<template v-if="model.logisticsType==1">
							<div class="border-top">
								<div class="field">收货地址：</div>							
								<div class="text">
									{{model.receiveAddress}}
								</div>
							</div>
							<div>
								<div class="field">&nbsp;&nbsp;收货人：</div>							
								<div class="text">
									{{model.contacter}}
								</div>
							</div>
							<div>
								<div class="field">联系电话：</div>							
								<div class="text">
									{{model.contacterMobile}}
								</div>
							</div>
							<div v-if="model.expressCompany||model.expressNO">
								<div class="field">派送信息：</div>							
								<div class="text">
									{{model.expressCompany}}<strong>【{{model.expressNO}}】</strong>
								</div>
							</div>
						</template>
					</div>
					<div class="p-a-m text-left bg-desc">
						<div class="font16px">
							温馨提示
						</div>
						<div class="desc-text">
							餐厅营业时间为 {{model.workBeginTime}} 至  {{model.workEndTime}}
						</div>
						<div class="desc-text">
							{{model.tips}}
						</div>
						<div class="desc-text" v-if="model.paymentState==0&&model.status==0">
							请于{{model.overTimeAfterBooking}}前支付订单，否则订单将自动过期。
						</div>
						<div class="desc-text" v-if="model.paymentState==1&&model.status==2">
							<template v-if="model.logisticsType==1">
								订单正在派送中，请保持手机通讯正常，以便派送员与您联系。
							</template>
							<template v-else>
								订单已消费，祝您消费愉快！
							</template>
						</div>
						<div class="desc-text" v-if="model.paymentState==1&&(model.status==3||model.status==4)">							
							订单已消费完成，感谢惠顾，欢迎再次光临！
						</div>
						<div class="desc-text" v-if="model.status==5">
							<template v-if="model.paymentState==1">
								该订单已经取消，待客服处理完成后，将应退金额返还给您。
							</template>
							<template v-else>
								该订单已经取消，应退金额已退还，请查收。
							</template>
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
						<!-- <timeline-item v-if="model.status==3">
							<h4 class="p-l-m">订单{{model.logisticsType==0?'离店':'签收'}}</h4>
							<p class="p-l-m">{{model.checkOutTime}}</p>
						</timeline-item> -->
						<timeline-item v-if="model.status>=2&&model.status<5">
							<h4 class="p-l-m">订单{{model.logisticsType==0?'消费':'派送'}}</h4>
							<p class="p-l-m">{{model.sendTime}}</p>
						</timeline-item>
						<timeline-item v-if="model.status>=1&&model.status<5&&model.confirmTime!='0001-01-01 00:00:00'">
							<h4 class="p-l-m">餐厅确认</h4>
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
		<map-location @onMapClose="onMapClose" :lng="model.longitude" :lat= "model.latitude" :title="model.storeName" :address="model.address" :tel="model.tel" :logo="model.storeLogo" v-if="isShowMap"></map-location>
		<repast-item-detail :isShow.sync="itemDetail.show" v-if="itemDetail.show" :item="itemDetail.item"></repast-item-detail>			
		<order-payment 
			@onCancelPay="onCancelPay"
			@onValidedPassowrd="onValidedPassowrd"
			:canWeiXinPay="model.canWeiXinPay"
			:canCashPay="model.canCashPay"
			:canPrestorePay="model.canPrestorePay"
			:canBonusPay="model.canBonusPay"
			:orderNO="model.orderNO" 
			:amt="model.totalAmt"
			:orderType="21"
			:orderDetailUrl="orderDetailUrl"
			:isShow.sync="isShowOrderPayment" 
			v-if="isShowOrderPayment">
		</order-payment>	
	</div>
	<order-submited-success :orderDetailUrl="orderDetailUrl" :noticeStatus="noticeStatus" :paymentState="paymentState" v-if="isSuccessed"></order-submited-success>
	<product-comment :isShow.sync="comment.show" v-if="comment.show" :storeId="comment.storeId" :products="comment.products"  :orderType="comment.orderType" :orderId="comment.orderId" :commentType="comment.commentType"></product-comment>
</div>	
</template>

<script>
import { getOrg } from "@/utils/auth";
export default {
  data() {
    return {
      comment: {
        show: false,
        storeId: 0,
        orderType: 12,
        orderId: 0,
        commentType: 1,
        products: []
      },
      orderDetailUrl: "",
      paymentState: 0,
      noticeStatus: 0,
      isSuccessed: false, //是否已经预订成功
      isShowOrderPayment: false,
      isShowMap: false,
      isShowTimeline: false,
      itemDetail: {
        show: false,
        item: {}
      },
      hasChangedOrder: false,
      showPopup: this.isShow,
      title: "",
      linkDesc: "",
      model: {}
    };
  },
  components: {
    MapLocation: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/qqMapLocationOnMobile.vue"),
    MapLocationSimple: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/qqMapLocationSimple.vue"),
    collapsible: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/znCollapsible.vue"),
    repastItemDetail: () =>
      import(/* webpackChunkName: "myOrder" */ "./repast_item_detail.vue"),
    OrderPayment: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/order_payment.vue"),
    OrderSubmitedSuccess: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/OrderSubmitedSuccess.vue"),
    ProductComment: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/znComment.vue")
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
      return model.status > 3;
    }
  },
  methods: {
    onMapClose() {
      this.isShowMap = false;
    },
    onValidedPassowrd(paymentType) {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnOrder/Pay",
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
    viewDetail(item) {
      this.itemDetail.item = item;
      this.itemDetail.show = true;
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
        logisticsType = th.model.logisticsType,
        payState = th.model.paymentState;
      if (status == 0) {
        th.title = "待付款";
        th.linkDesc =
          payState == 0 ? "该订单还未付款，请及时付款，以免过期。" : "已付款";
        return;
      }
      if (status == 1) {
        th.title = "预订成功";
        th.linkDesc = logisticsType == 0 ? "待消费" : "待派送";
        return;
      }
      if (status == 2) {
        th.title = logisticsType == 0 ? "已消费" : "已发货";
        th.linkDesc = logisticsType == 0 ? "已到店消费结束" : "订单正在派送中";
        return;
      }
      if (status == 3) {
        th.title = logisticsType == 0 ? "已离店" : "已签收";
        th.linkDesc =
          logisticsType == 0
            ? "已到店消费结束，欢迎再次光临！"
            : "订单已成功签收，欢迎再次订购！";
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
    _doCancel() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnOrder/Cancel",
          params: {
            id: that.model.tid
          }
        })
        .then(res => {
          //console.log(res);
          let data = res.data;
          let status = data.status;
          if (status != 200) {
            that.$tips.warn(res.data.message);
            return;
          }
          //		    		that.$tips.done('取消成功');
          //		    		that.hasChangedOrder=true;
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
          url: "/Api.Web/ZnOrder/Delete",
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
      let str =
        that.model.status == 4 && that.model.evaluateStatus == 0
          ? "该订单还未评价，"
          : "";
      that.$tips.confirm({
        content: `${str}确认要删除该订单吗？`,
        onConfirm: function() {
          that._doDelete();
        }
      });
    },
    cancelOrder() {
      let that = this;
      let poundageRate =
        that.model.poundageRate > 0
          ? `，将扣取手续费（订单金额的${that.model.poundageRate}%)`
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
    loadDetail() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnOrder/Detail",
          params: {
            id: that.id
          }
        })
        .then(res => {
          //console.log(res);
          that.model = res.data;
          let org = that.$storeGetter.getOrg();
          that.orderDetailUrl = `/my/order/repast/${org.groupAccount}/${
            that.model.tid
          }`;
          that.toStatusShow();
          //console.log(that.model.everydayPrice)
        })
        .catch(err => console.log(err));
    },
    toComment() {
      let that = this;
      that.comment.show = true;
      that.comment.storeId = that.model.storeId;
      that.comment.orderId = that.model.tid;
      that.comment.commentType = that.model.evaluateStatus == 0 ? 1 : 2;
      that.comment.products = [];
      that.model.items.forEach((e, i, a) => {
        that.comment.products.push({
          id: e.productId,
          name: e.productName,
          orderSubId: e.tid,
          image: that._getImgUrl(e.snapShot)
        });
      });
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
    //return;//TODO:断网的时候才使用
    let that = this;
    that.$nextTick(function() {
      let interval = setInterval(firstInit, 1000);
      function firstInit() {
        if (that.model.longitude) {
          clearInterval(interval);
        }
      }
    });
  },
  destroyed() {
    document.title = "酒店订单";
  }
};
</script>
 