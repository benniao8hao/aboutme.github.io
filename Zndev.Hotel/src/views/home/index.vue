<template>
	<div class="main-container">
		<loading v-model="isLoading"></loading>
		<div class="booking-hotel">
			<hotel-info :groupAccount="groupAccount" :storeId="storeId" @onLoaded="onStoresLoaded"></hotel-info>
			<hotel-calendar v-if="isLoaded" :check-in-date="bookingParams.checkInDate" :check-out-date="bookingParams.checkOutDate" :min-date="minDate" @onCalendarCallback="onCalendarCallback"></hotel-calendar>
			<hotel-price-conditions v-if="isLoaded" :beds="bedsCanFilter" @onFilterCallback="onFilterCallback" :conditions.sync="conditions"></hotel-price-conditions>
			<div class="price-container" v-if="isLoaded">
				<div v-if="priceRoomSnapShot.length>0" class="price-item" v-for="(room,index) in priceRoomSnapShot" :key="index">
					<div class="room">
						<img :src="room.snapShot" @click="viewRoomInfo(room.roomId)">
						<div class="room-desc">
							<div class="name" @click="pricesOfRoom(index,room.roomId)">
								{{room.roomName}}
							</div>
							<div class="ds" @click="pricesOfRoom(index,room.roomId)">
								{{room.acreages}}平米	{{room.bedType}}	{{room.bedSize}}米	{{room.hasWindow?'有窗':'无窗'}}
							</div>
							<div class="service">
								<span v-if="room.isPromotion">促销</span>
								<span class="fx" v-if="room.flagReturn">返现</span>&nbsp;
							</div>
						</div>
						<div class="price" @click="pricesOfRoom(index,room.roomId)">
							<span class="iconfont icon-rmb"></span> {{room.price}}起
							<span class="iconfont" v-bind:class="{'icon-unfold':!room.expand,'icon-fold1':room.expand}"></span>
						</div>
					</div>
					<div class="prices" v-if="room.expand">
						<div class="it" v-for="(price,index1) in room.prices" :key="'p_'+index1">
							<div class="l">
								<div class="n">{{price.typeName}}</div>
								<div class="b">
									{{price.containBreakfast==0?'不含早':price.containBreakfast==1?'含单早':price.containBreakfast==2?'含双早':price.containBreakfast==3?'含多早':''}}
									<span class="ft" :class="{'alarm':price.usableRoomsNum<=5}">{{price.usableRoomsNum>5?'':price.usableRoomsNum>0?'剩'+price.usableRoomsNum+'间':'满房'}}</span>
									<span v-if="price.isPromotion">促销</span>
									<span class="fx" v-if="price.flagReturn">返现</span>
									<span class="dx" v-if="price.onlyNewMember">新会独享</span>
								</div>
							</div>
							<div class="r">
								<span class="iconfont icon-rmb">{{price.price}}</span>
								<!-- <div class="bk" @click="toBooking(price.roomId,price.priceTypeId)" v-if="price.usableRoomsNum>0"> -->
                <div class="bk" @click="toBooking(price.roomId,price.priceTypeId)">
									<div class="bk-t">
										订
									</div>
									<div class="bk-b">
										{{price.canCashPay?'到店付':'在线付'}}
									</div>
								</div>
								<!-- <div class="bk" v-else>
									<div class="bk-t empty-room">
										满
									</div>
									<div class="bk-b">
										{{price.canCashPay?'到店付':'在线付'}}
									</div>
								</div> -->
							</div>
						</div>
					</div>
				</div>
				<msg class="empty-tips-msg m-t-l" v-if="priceRoomSnapShot.length==0&&!isLoading" title="暂无当前条件的房态" description="要不换换筛选条件再筛一遍呗" icon="info"></msg>
			</div>
			<hotel-room-info :roomInfo="currentViewRoomInfo" @onRoomInfoLoaded="onRoomInfoLoaded" :isShow.sync="isShowRoomInfo" :roomId="viewRoomId" v-if="isShowRoomInfo"></hotel-room-info>
			<hotel-writting-book-info :isShow.sync="isWrittingBookInfo" v-if="isWrittingBookInfo" :roomInfo="currentViewRoomInfo" @onRoomInfoLoaded="onRoomInfoLoaded" :bookingParams="bookingParams"></hotel-writting-book-info>
			<copyright v-if="isLoaded"></copyright>
		</div>
		<navbar v-if="isLoaded"></navbar>
	</div>
</template>
<script>
import { setReferer } from "@/utils/referer";
export default {
  components: {
    HotelInfo: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./components/hotelInfo.vue"),
    HotelCalendar: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./components/HotelCalendar.vue"),
    HotelPriceConditions: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./components/HotelPriceConditions.vue"),
    HotelRoomInfo: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./components/HotelRoomInfo.vue"),
    HotelWrittingBookInfo: () =>
      import(/* webpackChunkName: "hotelBooking" */ "./components/HotelWrittingBookInfo.vue")
  },
  props: {
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      default: 0
    }
  },
  methods: {
    viewRoomInfo(roomId) {
      let info = this.viewRooms.find(r => {
        return r.tid == roomId;
      });
      this.currentViewRoomInfo = info;
      this.viewRoomId = roomId;
      this.isShowRoomInfo = true;
    },
    onCalendarCallback(result) {
      Object.assign(this.bookingParams, result);
      //console.log(this.bookingParams);
      this.roomSnapShot();
    },
    onFilterCallback() {
      //console.log(this.conditions);
      this.roomSnapShot();
    },
    toBooking(roomId, priceTypeId) {
      let info = this.viewRooms.find(r => {
        return r.tid == roomId;
      });
      console.log(info)
      this.currentViewRoomInfo = info;
      this.bookingParams.roomId = roomId;
      this.bookingParams.priceTypeId = priceTypeId;
      this.isWrittingBookInfo = true;
    },
    pricesOfRoom(index, roomId) {
      let that = this;
      let filters = [];
      that.conditions.forEach((e, i, a) => {
        if (e.selected && !e.onlyForRoomCondition) {
          filters.push({
            field: e.fieldColumn,
            symbol: "=",
            value: e.val
          });
        }
      });
      let room = that.priceRoomSnapShot[index];
      if (room.prices.length == 0) {
        //展开房型主要信息后获取相应的价格
        that
          .$axios({
            url: "/Api.Hotel/HTPrice/PricesOfRoom",
            data: {
              beginDate: that.bookingParams.checkInDate,
              endDate: that.bookingParams.checkOutDate,
              conditions: filters,
              roomId
            }
          })
          .then(res => {
            //console.log(res);
            room.prices = res.data;
            room.expand = true;
            //console.log(roomId);
          })
          .catch(err => console.log(err));
      } else {
        room.expand = !room.expand;
      }
      that.priceRoomSnapShot.splice(index, room);
    },
    roomSnapShot() {
      let that = this;

      //如果附带了推荐人信息则先缓存起来
      let params = that.$route.query;
      if (params.referer && params.referer.length == 32) {
        that.isFromShare = true;
        setReferer(params.referer);
      }

      that.$vux.loading.show({
        text: "loading"
      });
      that.isLoading = true;
      let filters = [];
      that.conditions.forEach((e, i, a) => {
        if (e.selected) {
          filters.push({
            field: e.fieldColumn,
            symbol: "=",
            value: e.val
          });
        }
      });
      //console.log(filters);
      //获取价格列表中的房型主要信息
      that
        .$axios({
          //baseURL:'http://api.zndev.cn',
          url: "/Api.Hotel/HTPrice/RoomSnapShot",
          data: {
            beginDate: that.bookingParams.checkInDate,
            endDate: that.bookingParams.checkOutDate,
            conditions: filters,
            storeId: that.$storeGetter.getOrg().storeId
          }
        })
        .then(res => {
          //console.log(res);
          that.priceRoomSnapShot = [];
          if (res.data == null) return;
          res.data.forEach((e, i, a) => {
            e = Object.assign(e, { prices: [], expand: false });
            that.priceRoomSnapShot.push(e);
            //首次加载，把房型保存下来
            if (that.isFirstTimeGetRoomSnapShot) {
              if (!that.bedsCanFilter.find(bed => bed.val == e.bedType)) {
                that.bedsCanFilter.push({
                  val: e.bedType,
                  field: "bedType",
                  fieldColumn: "BedType",
                  text: e.bedType,
                  onlyForRoomCondition: true, //是否仅仅用于房型过滤
                  selected: false
                });
              }
            }
          });

          if (that.isFirstTimeGetRoomSnapShot) {
            that.isFirstTimeGetRoomSnapShot = false;
            if (that.bedsCanFilter.length > 0) {
              that.conditions.push(that.bedsCanFilter[0]);
            }
          }
          setTimeout(() => {
            that.$vux.loading.hide();
            //加载完成后，如果房型少于4个，则自动展开
            if (
              that.priceRoomSnapShot.length > 0 &&
              that.priceRoomSnapShot.length < 4
            ) {
              setTimeout(function() {
                that.priceRoomSnapShot.forEach((e, i, a) => {
                  setTimeout(that.pricesOfRoom(i, e.roomId), 1000 * 2);
                });
              }, 500);
            }
          }, 500);
          that.isLoading = false;
        })
        .catch(err => console.log(err));
    },
    onStoresLoaded() {
      //console.log('店铺信息加载完成')
      //店铺信息加载完成
      let that = this;
      that.isLoading = false;
      that.isLoaded = true;
      if (that.loadingTipsTimeOut) {
        window.clearTimeout(that.loadingTipsTimeOut);
      }
      that.roomSnapShot();
    },
    onRoomInfoLoaded(roomInfo) {
      //当查看一个房型加载完成后缓存起来，下次不再请求
      this.viewRooms.push(roomInfo);
    }
  },
  created() {
    //console.log(this.$store.state.app);
    //console.log(this.$storeGetter.getOrg())
    //console.log(this.groupAccount)
    //console.log(this.storeId)
    //console.log('created')
    //alert(location.href);

    let that = this;
    if (that.errorCheckInDate) {
      that.$tips.alert(
        "您的入住日期早于可预订时间，无法预订，已帮您修改为默认时间",
        "抱歉"
      );
    }
    that.loadingTips = window.setTimeout(() => {
      if (!that.isLoaded) that.isLoading = true;
    }, 1000 * 3);
  },
  data() {
    let that = this,
      errorCheckInDate = false;
    let today = new Date(),
      endD = new Date(),
      days = 1;
    let beginD = that.$options.filters.dateFormat(today, "YYYY-MM-DD"); //YYYY-MM-DD 格式，否则在 IOS上会报错
    let hour = today.getHours();
    if (hour < 6) {
      //凌晨时间
      today.setDate(today.getDate() - 1);
      beginD = that.$options.filters.dateFormat(today, "YYYY-MM-DD"); //YYYY-MM-DD 格式，否则在 IOS上会报错
    } else {
      endD.setDate(endD.getDate() + 1);
    }
    endD = that.$options.filters.dateFormat(endD, "YYYY-MM-DD"); //YYYY-MM-DD 格式，否则在 IOS上会报错
    let query = that.$route.query;
    if (query.checkInDate) {
      //检查日期是不是已经过期了(早于今天了)
      let d1 = new Date(query.checkInDate.replace(/-/gi, "/"));
      let d2 = new Date(beginD.replace(/-/gi, "/"));
      var dateSpan = d2 - d1;
      if (dateSpan > 0) {
        errorCheckInDate = true;
        query.checkInDate = beginD;
        today.setDate(today.getDate() + 1);
        query.checkOutDate = that.$options.filters.dateFormat(
          today,
          "YYYY-MM-DD"
        );
      } else {
        let d3 = new Date(query.checkOutDate.replace(/-/gi, "/"));
        dateSpan = d3 - d1;
        dateSpan = Math.abs(dateSpan);
        days = Math.floor(dateSpan / (24 * 3600 * 1000));
      }
    }
    return {
      bookingParams: {
        //预订参数
        roomId: 0,
        priceTypeId: 0,
        days: days,
        checkInDate: query.checkInDate ? query.checkInDate : beginD,
        checkOutDate: query.checkOutDate ? query.checkOutDate : endD
      },
      loadingTipsTimeOut: null, //加载提示器
      isLoading: false, //当前是否正在加载
      isLoaded: false, //酒店的基本信息是否已经加载完成
      errorCheckInDate, //URL中是否附带了过期的入住日期
      minDate: beginD,
      viewRoomId: 0, //当前点击要查看的房型ID
      currentViewRoomInfo: null, //当前点击要查看的房型信息
      isShowRoomInfo: false,
      isWrittingBookInfo: false,
      priceRoomSnapShot: [], //房型价格基本信息
      isFirstTimeGetRoomSnapShot: true, //是否初次加载
      bedsCanFilter: [], //可选的床型
      viewRooms: [], //已经查看过的房型信息
      conditions: [
        //默认显示的过滤选项
        {
          text: "返现",
          field: "serviceType",
          fieldColumn: "FlagReturn",
          val: 1,
          selected: false
        },
        {
          text: "促销",
          field: "serviceType",
          fieldColumn: "isPromotion",
          val: 1,
          selected: false
        },
        //					{
        //						text: '新人独享',
        //						field: 'serviceType',
        //						fieldColumn: 'onlyNewMember',
        //						val: 1,
        //						selected: false
        //					},
        //					{
        //						text: '免费取消',
        //						field: 'serviceType',
        //						fieldColumn: 'PoundageRate',
        //						val: 0,
        //						selected: false
        //					},
        {
          text: "双早",
          field: "containBreakfast",
          fieldColumn: "ContainBreakfast",
          val: 2,
          selected: false
        },
        {
          text: "有窗",
          field: "serviceType",
          fieldColumn: "hasWindow",
          val: 1,
          onlyForRoomCondition: true, //是否仅仅用于房型过滤
          selected: false
        }

        //					{
        //						text: '微信',
        //						field: 'payType',
        //						fieldColumn: 'CanWeiXinPay',
        //						val: 1,
        //						selected: false
        //					},
      ]
    };
  },
  mounted() {
    document.title = "酒店预订";
    /*for test
    let that = this;
    let text = "支付成功",
      type = "success";
    that.$vux.toast.show({
      text,
      type,
      onHide() {
        console.log("onHide");
      }
    });
    */
    //首次加载，如果房型个数少于4个时，自动展开价格,改成每次加载数据都按这个条件处理
    //			let interval= setInterval(function(){
    //				if(!that.isFirstTimeGetRoomSnapShot){//加载完房型并设置isFirstTimeGetRoomSnapShot为false了
    //					//console.log('加载完成了');
    //					if(that.priceRoomSnapShot.length<4){
    //						setTimeout(function(){
    //							that.priceRoomSnapShot.forEach((e,i,a)=>{
    //								setTimeout(that.pricesOfRoom(i,e.roomId),1000*2);
    //							});
    //						},500);
    //					}
    //					clearInterval(interval);
    //				}
    //			},10);
  }
};
</script>
