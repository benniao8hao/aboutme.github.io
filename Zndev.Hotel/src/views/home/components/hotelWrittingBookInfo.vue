<template>
<div>
	<div class="write-book">
		<div class="tp">
			<div class="hotel">
				<div class="ht-name">{{storeName}}</div>
				<div>
					<span>{{bookingParams.inText}}({{bookingParams.inDesc}})</span>
					<span class="check">入住</span>
					<span>{{bookingParams.outText}}({{bookingParams.outDesc}})</span>
					<span class="check">离店</span>
					<span class="days">
					共
					<b>{{bookingParams.days}}</b>晚
					</span>
				</div>
				<div>
					<span>{{priceInfo.roomName}}</span>
					<span>{{priceInfo.containBreakfast==0?'不含早':priceInfo.containBreakfast==1?'含单早':priceInfo.containBreakfast==2?'含双早':priceInfo.containBreakfast==3?'含多早':''}}</span>
					<span v-if="priceInfo.flagReturn">返现</span>
					<span v-if="priceInfo.isPromotion">促销</span>
					<span v-if="priceInfo.onlyNewMember" class="f-red">新人独享</span>
				</div>
				<div class="room-detail"><span @click="viewRoomInfo">房型详情</span><span class="iconfont icon-right" @click="viewRoomInfo"></span></div>
			</div>
		</div>
		<template v-if="loaded">
			<group label-width="5em" class="ft" label-margin-right="2em" label-align="justify">
				<popup-picker title="房间数" @on-change="roomsNumChange" :data="roomNums" v-model="selectedRoomQty" value-text-align="left" :display-format="formatSelectRoomNumShow"></popup-picker>
			</group>
			<group label-margin-right="1em"  label-align="justify">
				<x-input :title="`入住人(房间${index+1})`" is-type="china-name" :should-toast-error=false :min=2 :max=4 :required="true" v-model="bookingModel.checkInPopulation[index]" v-for="(person,index) in bookingModel.checkInPopulation" :key="index">
					<!--<x-button slot="right" type="primary" mini>选择</x-button>-->
					<span class="iconfont icon-my1" slot="right" @click="selectCheckInPopulation(index)"></span>
				</x-input>
			</group>
			<group label-width="5em" label-margin-right="2em" label-align="justify">
				<x-input title="联系手机" :max=11 is-type="china-mobile" v-model="bookingModel.contacterMobile" :should-toast-error=false :required="true"></x-input>
			</group>
			<group label-width="5em" label-margin-right="2em" label-align="justify">
				<x-input title="联系人" :min=2 :max=4 is-type="china-name" :should-toast-error=false  v-model="bookingModel.contacter" :required="true"></x-input>
			</group>
			<group label-width="7em" label-margin-right="2em" label-align="justify">
				<popup-picker title="预计抵店时间" :data="arriveTimes" v-model="bookingModel.arriveTime" value-text-align="left"></popup-picker>
			</group>
			<div class="booking-desc">
				<div class="tl">退改政策</div>
				<p>{{priceInfo.policy}}</p>
				<div class="tl">入住提示</div>
				<p>{{priceInfo.checkInTime}}前到店可能需要等待</p>
			</div>
			<div class="bt">
				<div>
					<span class="iconfont icon-rmb">{{priceInfo.amtTotal}}</span>
					<span @click="isShowPriceDetail=true" v-if="!isShowPriceDetail">明细</span>
					<a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary" :class="{'weui-btn_disabled':!allowBook}"  @click="submitBooking">{{isSubmiting?'数据提交中':'提交订单'}}</a>
					<a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default" @click="cancelBooking">取消返回</a>
				</div>
			</div>
		</template>
		<div class="bk-room-info" v-if="isShowRoomInfo&&roomInfoModel">
			<div class="room-detail">
				<div class="info-title">
					{{roomInfoModel.roomName}}
				</div>
				<hr />
				<div class="info-service">
					<ul>
						<li>
							<span class="iconfont icon-loutistairs7"></span>{{roomInfoModel.floordiStribution}}层
						</li>
						<li>
							<span class="iconfont icon-m2"></span> {{roomInfoModel.acreages}}平米
						</li>
						<li>
							<span class="iconfont icon-chuangweiyuyue"></span> {{roomInfoModel.bedType}}{{roomInfoModel.bedSize}}米
						</li>
						<li>
							<span class="iconfont icon-person2"></span> 可入住{{roomInfoModel.checkInPopulation}}人
						</li>
						<li>
							<span class="iconfont" :class="{'icon-youchuang-':roomInfoModel.hasWindow,'icon-wuchuang-':!roomInfoModel.hasWindow}"></span> {{roomInfoModel.hasWindow?'有窗':'无窗'}}
						</li>
						<li v-if="roomInfoModel.noSmoking">
							<span class="iconfont icon-jinzhixiyan"></span> 禁止吸烟
						</li>
						<li v-if="roomInfoModel.affordWifi">
							<span class="iconfont icon-wifi4"></span> Wifi
						</li>
						<li v-if="roomInfoModel.affordCarport">
							<span class="iconfont icon-yingyuanxinxitingchechang"></span> 停车场
						</li>
						<li v-if="roomInfoModel.affordStrongbox">
							<span class="iconfont icon-baoxiangui1"></span> 保险柜
						</li>
						<li v-if="roomInfoModel.affordIcebox">
							<span class="iconfont icon-bingxiang1"></span> 冰箱
						</li>
						<li v-if="roomInfoModel.affordShower">
							<span class="iconfont icon-reshui"></span> 热水器
						</li>
						<li v-if="roomInfoModel.affordSwimmingPool">
							<span class="iconfont icon-youyongchi"></span> 游泳池
						</li>
						<li v-if="roomInfoModel.affordWasher">
							<span class="iconfont icon-xiyiji"></span> 洗衣机
						</li>
						<li v-if="roomInfoModel.affordSurf">
							<span class="iconfont icon-computer"></span> 电脑上网
						</li>
						<li v-if="roomInfoModel.affordAwaken">
							<span class="iconfont icon-jiaoxing"></span> 叫醒服务
						</li>

						<li v-if="roomInfoModel.affordDeposit">
							<span class="iconfont icon-save"></span> 行李寄存
						</li>
						<li v-if="roomInfoModel.affordPickup">
							<span class="iconfont icon-jipiao"></span> 接机服务
						</li>
						<li v-if="roomInfoModel.affordMettingRoom">
							<span class="iconfont icon-huiyishi"></span> 会议室
						</li>
						<li v-if="roomInfoModel.affordRestaurant">
							<span class="iconfont icon-canyin"></span> 餐厅
						</li>
					</ul>
				</div>
				<hr />
				<div class="info-desc">
					<div class="desc-item">
						<label>入离通知：</label>
						<p>{{roomInfoModel.checkInTime}}以后入住，{{roomInfoModel.checkOutTime}}以前退房</p>
					</div>
					<div class="desc-item" v-if="roomInfoModel.facility">
						<label>客房设施：</label>
						<p>{{roomInfoModel.facility}}</p>
					</div>
					<div class="desc-item" v-if="roomInfoModel.attention">
						<label>预订须知：</label>
						<p>{{roomInfoModel.attention}}</p>
					</div>
					<div class="desc-item" v-if="roomInfoModel.policy">
						<label>退改政策：</label>
						<p>{{roomInfoModel.policy}}</p>
					</div>
				</div>
				<hr />
				<div class="close">
					<span class="iconfont icon-close" @click="isShowRoomInfo=false"></span>
				</div>
			</div>
		</div>
		<div class="bk-price-detail" v-if="isShowPriceDetail">
			<div>
				<div class="title">费用明细 <span class="iconfont icon-close" @click="isShowPriceDetail=false"></span></div>
				<div class="caption">
					<label>房费</label>
					<span class="iconfont icon-rmb">{{priceInfo.amtTotal}}</span>
				</div>
				<div class="ds scroller-bar">
					<template v-for="(detail,i) in priceDetails">
						<div class="l" :key="i">{{detail.priceDate}}</div>
						<div class="c" :key="i">{{detail.containBreakfast==0?'不含早':detail.containBreakfast==1?'含单早':detail.containBreakfast==2?'含双早':detail.containBreakfast==3?'含多早':''}}</div>
						<div class="r" :key="i">
							<span class="iconfont icon-rmb">{{detail.price}}X{{bookingModel.roomQty}}</span>
						</div>
					</template>
				</div>
				<template v-if="priceInfo.amtReturn>0">
					<div class="caption">
						<label>享受优惠</label>
						<span class="iconfont icon-rmb yh">{{priceInfo.amtReturn}}</span>
					</div>
					<div class="ds scroller-bar">
						<div class="l">红包返现</div>
						<div class="r">
							<span class="iconfont icon-rmb">{{priceInfo.amtReturn}}</span>
						</div>
					</div>
				</template>
				<div class="caption desc">
					<label>费用总计</label>
					<span class="iconfont icon-rmb">{{priceInfo.amtTotal}}</span>
				</div>
				<div class="caption desc" v-if="priceInfo.amtReturn>0">
					<label>离店可返现</label>
					<span class="iconfont icon-rmb yh">{{priceInfo.amtReturn}}</span>
				</div>
			</div>
		</div>
		<check-in-population v-if="isShowCheckInPopulation" :isShow.sync="isShowCheckInPopulation" @onSelectedCheckInPopulation="onSelectedCheckInPopulation"></check-in-population>
	</div>
	<order-payment
		@onCancelPay="onCancelPay"
		@onValidedPassowrd="onValidedPassowrd"
		:canWeiXinPay="payTypes.canWeiXinPay"
		:canCashPay="payTypes.canCashPay"
		:canPrestorePay="payTypes.canPrestorePay"
		:canBonusPay="payTypes.canBonusPay"
		:orderNO="newOrderNO"
		:orderType="11"
		:orderDetailUrl="orderDetailUrl"
		:amt="priceInfo.amtTotal"
		:isShow.sync="isShowOrderPayment"
		v-if="isShowOrderPayment">
	</order-payment>
    <order-submited-success :orderDetailUrl="orderDetailUrl" :noticeStatus="noticeStatus" :paymentState="paymentState" v-if="isSuccessed"></order-submited-success>
</div>
</template>

<script>
import validator from "@/utils/validator.js";
export default {
  data() {
    let org = this.$storeGetter.getOrg();
    let storeName = org.storeName;
    let curStoreId = org.storeId;
    return {
      orderDetailUrl: "",
      paymentState: 0,
      noticeStatus: 0,
      isSuccessed: false, //是否已经预订成功
      isShowOrderPayment: false,
      isSubmiting: false,
      indexOfCheckInPopulation: -1,
      isShowCheckInPopulation: false, //是否显示常用入住人选择列表
      loaded: false,
      allowBook: true, //是否允许预订
      storeName,
      selectedRoomQty: [1],
      roomNums: [[]],
      newOrderNO: "",
      arriveTimes: [
        [
          "00:00-02:00",
          "02:00-04:00",
          "04:00-06:00",
          "06:00-08:00",
          "08:00-10:00",
          "10:00-12:00",
          "12:00-14:00",
          "14:00-16:00",
          "16:00-18:00",
          "18:00-20:00",
          "20:00-22:00",
          "22:00-00:00"
        ]
      ],
      payTypes: {
        canWeiXinPay: false,
        canCashPay: false,
        canPrestorePay: false,
        canBonusPay: false
      },
      isShowRoomInfo: false,
      roomInfoModel: null,
      isShowPriceDetail: false,
      priceDetails: [],
      priceInfo: {
        amtTotal: 0,
        canBonusPay: false,
        canCashPay: false,
        canPrestorePay: false,
        canWeiXinPay: false,
        checkInTime: "",
        containBreakfast: 0,
        flagReturn: false,
        policy: "",
        roomName: "",
        roomNum: 0,
        typeName: ""
      },
      bookingModel: {
        contacter: "",
        arriveTime: ["14:00-16:00"],
        mobile: "",
        roomQty: 1,
        nightQty: 0,
        storeId: curStoreId,
        checkInPopulation: [] //入住人
      }
    };
  },
  props: {
    bookingParams: {
      type: Object,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    roomInfo: {
      default: null
    } //如果传递过来的对象非空，则直接显示，不再请求接口
  },
  components: {
    CheckInPopulation: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./hotelBookingCheckInPopulation.vue"),
    OrderPayment: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/order_payment.vue"),
    OrderSubmitedSuccess: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/OrderSubmitedSuccess.vue")
  },
  methods: {
    selectCheckInPopulation(index) {
      this.indexOfCheckInPopulation = index;
      this.isShowCheckInPopulation = true;
    },
    onSelectedCheckInPopulation(name) {
      this.bookingModel.checkInPopulation[this.indexOfCheckInPopulation] = name;
    },
    formatSelectRoomNumShow(value) {
      return `${value}间`;
    },
    formatPayTypeShow(value) {
      let paytypeText = ["", "现金", "微信", "支付宝", "充值", "奖金"];
      return paytypeText[parseInt(value)];
    },
    roomsNumChange(value) {
      let num = parseInt(value);
      this.bookingModel.roomQty = num;
      this.getBookingPrice();
    },
    viewRoomInfo() {
      let that = this;
      if (that.roomInfo) {
        that.roomInfoModel = that.roomInfo;
        that.isShowRoomInfo = true;
        return;
      }
      that
        .$axios({
          url: "/Api.Hotel/HTHotel/RoomInfo",
          params: {
            roomId: that.bookingParams.roomId
          }
        })
        .then(res => {
          let detail = res.data;
          detail.sliders = JSON.parse(detail.sliders);
          that.roomInfoModel = detail;
          that.isShowRoomInfo = true;
          that.$emit("onRoomInfoLoaded", detail);
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkAllowBook() {
      //检查所选时间段的每一天中，房量是否足够，决定能否预订
      let that = this,
        allow = true;
      let qty = that.bookingModel.roomQty;
      that.priceDetails.forEach((e, i, a) => {
        if (e.usableRoomsNum < qty && allow) {
          allow = false;
          that.$tips.alert(`${e.priceDate}房量不足,仅剩${e.usableRoomsNum}间`);
        }
      });
      that.allowBook = allow;
    },
    getBookingPrice() {
      let that = this;
      let bookRoomQty = that.bookingModel.roomQty;
      that.loaded = false;
      that
        .$axios({
          url: "/Api.Hotel/HTPrice/BookingPriceInfo",
          params: {
            priceTypeId: that.bookingParams.priceTypeId,
            roomId: that.bookingParams.roomId,
            beginDate: that.bookingParams.in,
            endDate: that.bookingParams.out,
            roomsQty: bookRoomQty,
            storeId: that.bookingModel.storeId
          }
        })
        .then(res => {
          let that = this,
            info = res.data.info,
            details = res.data.details;
          //console.log(info)
          that.priceInfo = info;
          that.priceDetails = details;
          //取出所选时间段内房量最少的那天作为最大可订数量
          let maxRoomNum = that.priceDetails[0].usableRoomsNum;
          that.priceDetails.forEach((e, i, a) => {
            if (e.usableRoomsNum < maxRoomNum) {
              maxRoomNum = e.usableRoomsNum;
            }
            e.priceDate = that.$options.filters.dateFormat(e.priceDate);
          });
          maxRoomNum = maxRoomNum >= 10 ? 10 : maxRoomNum;
          that.roomNums = [[]];
          for (let i = 1; i <= maxRoomNum; i++) {
            that.roomNums[0].push({
              name: `${i}间`,
              value: i
            });
          }
          let temp_checkInPopulation = that.bookingModel.checkInPopulation;
          that.bookingModel.checkInPopulation = [];
          for (let i = 0; i < bookRoomQty; i++) {
            let n = temp_checkInPopulation[i] ? temp_checkInPopulation[i] : "";
            that.bookingModel.checkInPopulation.push(n);
          }
          that.bookingModel.contacterMobile = res.data.mobile;
          that.bookingModel.contacter = res.data.name;
          let canPay = false;
          that.payTypes.canWeiXinPay = info.canWeiXinPay;
          that.payTypes.canCashPay = info.canCashPay;
          that.payTypes.canPrestorePay = info.canPrestorePay;
          that.payTypes.canBonusPay = info.canBonusPay;
          //console.log(info);
          if (
            !info.canWeiXinPay &&
            !info.canCashPay &&
            !info.canPrestorePay &&
            !info.canBonusPay
          ) {
            this.tips.alert(
              "错误:店家未设置该房价的支付方式！",
              null,
              function() {
                that.cancelBooking();
              }
            );
            return;
          }
          //console.log(that.roomNums)
          that.loaded = true;
          that.checkAllowBook();
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancelBooking() {
      this.$emit("update:isShow", false);
    },
    onValidedPassowrd(paymentType) {
      let that = this;
      that
        .$axios({
          //baseURL:'http://localhost:1477',
          url: "/Api.Hotel/HTOrder/Pay",
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
    submitBooking() {
      let that = this;
      if (that.isSubmiting) {
        return;
      }
      if (!that.allowBook) {
        return;
      }
      let empty = that.bookingModel.checkInPopulation.find(
        s => s == "" || s.length < 2
      );
      if (empty == "") {
        this.$tips.warn("请正确填写入住人(每间房一个)");
        return;
      }
      if (!validator.isMobile(that.bookingModel.contacterMobile)) {
        this.$tips.warn("请正确填写联系手机");
        return;
      }
      if (
        that.bookingModel.contacter == "" ||
        that.bookingModel.contacter.length < 2
      ) {
        this.$tips.warn("请正确填写联系人");
        return;
      }
      const orderModel = {
        totalAmt: that.priceInfo.amtTotal,
        roomId: that.bookingParams.roomId,
        priceTypeId: that.bookingParams.priceTypeId,
        checkInDate: that.bookingParams.in,
        checkOutDate: that.bookingParams.out,
        roomQty: that.bookingModel.roomQty,
        nightsQty: that.bookingParams.days,
        tenant: that.bookingModel.checkInPopulation.join(),
        contacter: that.bookingModel.contacter,
        contacterMobile: that.bookingModel.contacterMobile,
        arriveTime: that.bookingModel.arriveTime[0],
        paymentType: 0,
        storeId: that.bookingModel.storeId
      };
      //console.log(that.bookingModel);
      //console.log(orderModel)

      that.isSubmiting = true;
      that
        .$axios({
          //baseURL: "http://localhost:1477",
          url: "/Api.Hotel/HTOrder/Submit",
          data: orderModel,
          callback: function(res) {
            that.isSubmiting = false;
          }
        })
        .then(res => {
          //that.$tips.done('提交成功');
          that.isSubmiting = false;
          that.noticeStatus = res.data.noticeStatus;
          that.newOrderNO = res.data.orderNO;
          that.isShowOrderPayment = true;
          //that.isSuccessed=true;
          let org = that.$storeGetter.getOrg();
          that.orderDetailUrl = `/my/order/hotel/${org.groupAccount}/${
            res.data.orderId
          }`;
          //console.log(that.orderDetailUrl);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.bookingModel.nightQty = this.bookingParams.days;
    this.getBookingPrice();
  }
};
</script>
