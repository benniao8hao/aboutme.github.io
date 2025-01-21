<template>
<div>
	<div class="main-container" ref="scrollBox">
		<loading :show="!isLoadComplete"></loading>
		<div class="nav-header" :class="{'transparent':scrollPosition<100}" v-if="isLoadComplete">
			<x-header :title="scrollPosition<100?'':'团购详情'">
			</x-header>
		</div>
		<div class="content-wrap" v-if="isLoadComplete">
			<div class="item-detail special">
				<div class="previewer-img-container" @click="show(0)">
					<img class="previewer-img" v-lazy="model.snapShot"  :key="model.snapShot" width="100%">
					<span class="nums">{{model.sliders.length}}张</span>
					<h1 class="name tips">
						<template v-if="countDonw.stop">
							<div class="tips-left">此团购活动已经结束，敬请期待下一轮！</div>
						</template>
						<template v-else>
							<div class="tips-left">拼团进行中</div>
							<div class="tips-right" v-if="statusInfo.status==1">
								{{ticktTimeTips}}
							</div>
						</template>
					</h1>
				</div>
				<div class="block">
					<section class="pro-info">
						<div class="wrap">
							<div class="field">
								<h1 class="name p-a-m">{{model.name}}</h1>
								<div class="price">
									<span class="tag">{{model.grouponNum}}人起拼</span>
									¥<strong>{{model.priceNow}}</strong>
									<span class="cost">原价 ￥<strong>{{model.priceOld}}</strong></span>
									<span class="tag tag-right" v-if="model.bookedNum">已拼{{model.bookedNum}}人</span>
								</div>
							</div>
						</div>
						<div class="cert-box">
							<span class="iconfont icon-roundcheck1" v-for="(tag,x) in model.tags.split(',')" :key="x"  v-if="tag">{{tag}}</span>
							<span class="iconfont icon-roundcheck1" v-if="model.noAppointment">免预约</span>
							<span class="iconfont icon-roundcheck" v-if="model.flagReturn">返现</span>
						</div>
					</section>
				</div>
				<div v-transfer-dom>
					<previewer :list="model.sliders" ref="previewer" :options="options"></previewer>
				</div>
			</div>
		</div>
		<div class="content-wrap item-detail-tab-wrap" v-if="isLoadComplete">
			<div v-sticky="{
					zIndex: 110,
					stickyTop:0
				}">
				<tab :line-width=1 active-color='#f39709'>
					<tab-item  @on-item-click="onChangeTab(index)" class="vux-center" :selected="index==curIndex" v-for="(item, index) in tabItems" :key="index">{{item}}</tab-item>
				</tab>
			</div>
			<div v-show="curIndex==0">
				<collapsible>
					<span class="iconfont icon-shuoming1" slot="icon"></span>
					<div slot="title">团购摘要</div>
					<div>
						 <group label-align="right" label-width="5em" class="no-border">
						 	<cell primary="content" title="门市价格" :value="`￥ ${model.priceOld}/${model.unit}`"></cell>
						 	<cell primary="content" title="团购价格" :value="`￥ ${model.priceNow}/${model.unit}`"></cell>
						 	<cell primary="content" title="剩余库存" v-if="!model.ignoreRepertory" :value="`${model.repertory}${model.unit}`"></cell>
	   				        <cell primary="content" title="限购数量" v-if="!model.ignoreRepertory&&model.allowOrderNum>0" :value="`每人限购${model.allowOrderNum}${model.unit}`"></cell>
						 	<cell v-if="model.invalidMinutes>0" primary="content" title="自动取消" :value="`在 ${model.invalidMinutes}分钟内不完成支付自动取消。`"></cell>
						 	<cell primary="content" title="开始抢购" :value="`${model.beginTime} 准时开售`"></cell>
						 	<cell primary="content" title="停止抢购" :value="`${model.endTime} 截止抢购`"></cell>
						 	<cell primary="content" title="预约时间" v-if="!model.noAppointment">{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}至{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}</cell>
	   				        <cell primary="content" title="有效期至" :value="`${model.overTime} 后失效`"></cell>	   				        
	   				        <cell primary="content" title="房态先知"  v-if="model.category==1&&model.roomId>0&&model.priceTypeId>0">
	   				        	<div>想提前知道哪天有房可预约吗？<x-button mini type="primary" :gradients="['#FF61AD','#FF2719']" @click.native="viewRoomState(model)">立即点击</x-button></div>
	   				        </cell>
					    </group>
					</div>
				</collapsible>
				<collapsible>
					<span class="iconfont icon-tese2" slot="icon"></span>
					<div slot="title">团购特色</div>
					<div class="intro">
						{{model.feature}}
					</div>
				</collapsible>
			</div>
			<div v-show="curIndex==1">
				<collapsible>
					<span class="iconfont icon-shuoming" slot="icon"></span>
					<div slot="title">套餐介绍</div>
					<div v-html="model.details"></div>
				</collapsible>
				<collapsible v-if="model.specialAnnouncement!=''">
					<span class="iconfont icon-tishi1" slot="icon"></span>
					<div slot="title">特别声明</div>
					<div v-html="model.specialAnnouncement"></div>
				</collapsible>
				<collapsible v-if="model.purchaseNotes!=''">
					<span class="iconfont icon-jinggao" slot="icon"></span>
					<div slot="title">购买须知</div>
					<div v-html="model.purchaseNotes"></div>
				</collapsible>
				<collapsible v-if="model.remark!=''">
					<span class="iconfont icon-dingdan" slot="icon"></span>
					<div slot="title">备注</div>
					<div v-html="model.remark"></div>
				</collapsible>
				<collapsible v-if="model.transportationGuide!=''">
					<span class="iconfont icon-jiaotong" slot="icon"></span>
					<div slot="title">交通指南</div>
					<div v-html="model.transportationGuide"></div>
				</collapsible>
			</div>
		</div>
		<copyright class="bottom-buy-bar-padding" v-if="isLoadComplete"></copyright>
		<div class="buy-bar fixed-bottom" v-if="isLoadComplete">
			<flexbox class="content-wrap" :gutter="0" v-if="statusInfo.status==1">
		      <flexbox-item :span="9">
		      	<div class="time">
	      			<div class="price-tips">
	      				<span class="iconfont icon-rmb">{{model.priceNow}}</span>
	      			</div>
		      	</div>
		      </flexbox-item>
		      <flexbox-item>
		      	<div class="buy-btn btn-groupbuy" :class="{'disabled':countDonw.stop}" @click="toBook(1)">
		      		{{countDonw.stop?'已经结束':'立即拼团'}}
		      	</div>
		      </flexbox-item>
		    </flexbox>
		    <div class="wait-begin content-wrap" v-else>
	    		<span class="iconfont icon-naozhong"></span>距离开团时间还有
  				<template v-if="countDonw.d>0">
  					<span>{{countDonw.d}}</span>天
  				</template>
  				<span>{{countDonw.h}}</span>小时
  				<span>{{countDonw.m}}</span>分
  				<span>{{countDonw.s}}</span>秒
		    </div>
		</div>
	</div>
	<book :storeId="storeId" :mobile="mobile" :name="name" :product="model" :id="id" v-if="isShowBook" :isShow.sync="isShowBook"></book>
	<room-state :maxDate="rommStateEndDate" :minDate="roomStateBeginDate" v-if="isShowRoomState" :roomStates="roomStates" :isShow.sync="isShowRoomState"></room-state>
</div>
</template>
<script>
import VueSticky from "vue-sticky";
import tickt from "@/utils/count_down.js";

export default {
  directives: {
    sticky: VueSticky
  },
  components: {
    collapsible: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/znCollapsible.vue"),
    book: () => import(/* webpackChunkName: "group_buy" */ "./book.vue"),
    roomState: () =>
      import(/* webpackChunkName: "hotelBooking" */ "@/components/calendar/room_state.vue")
  },
  methods: {
    show(index) {
      this.$refs.previewer.show(index);
    },
    viewRoomState(model) {
      let that = this;
      let _d = that.$options.filters.dateFormat(new Date(), "YYYY-MM-DD");
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
    formatTickTimeTips() {
      let countDonw = this.countDonw;
      if (countDonw.d > 0)
        return `${countDonw.d}天${countDonw.h}小时${countDonw.m}分${
          countDonw.s
        }秒`;
      if (countDonw.h > 0)
        return `${countDonw.h}小时${countDonw.m}分${countDonw.s}秒`;
      if (countDonw.m > 0) return `${countDonw.m}分${countDonw.s}秒`;
      return `${countDonw.s}秒`;
    },
    getDetail() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceProduct/Detail",
          params: {
            storeId: that.storeId,
            id: that.id,
            isGroupon: 1
          }
        })
        .then(res => {
          let data = res.data;
          let product = data.product;
          that.statusInfo = data.statusInfo;
          let sliders = eval(product.sliders);
          sliders.forEach((e, i, a) => {
            e.src = that._getImgUrl(e.src);
          });
          product.sliders = sliders;
          that.model = product;
          that.mobile = data.mobile;
          if (data.name.length > 4) data.name = data.name.substr(0, 4);
          that.name = data.name;
          //处理倒计时
          tickt.milliseconds =
            that.statusInfo.status == 0
              ? that.statusInfo.waitToBeginMilliseconds
              : that.statusInfo.waitToStopMilliseconds;
          let cb = function(obj) {
            that.countDonw = obj;
            that.ticktTimeTips = "距结束还剩 " + that.formatTickTimeTips();
          };
          tickt.countDonw(cb);
          //				setTimeout(function(){
          //					that.isLoadComplete=true;
          //				},500);
          that.isLoadComplete = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeTab(index) {
      this.curIndex = index;
      //this.scrollPosition=0;
      //this.$refs.scrollBox.scrollTop=0;
    },
    toBook(id) {
      let that = this;
      if (that.countDonw.stop) {
        return;
      }
      that.isShowBook = true;
    }
  },
  props: {
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      required: true
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      isShowRoomState: false,
      roomStateBeginDate: "",
      rommStateEndDate: "",
      roomStates: [], //房态
      isShowBook: false,
      curIndex: 0,
      tabItems: ["团购说明", "团购详情"],
      scrollPosition: 0,
      timeCountSeconds: 0, //团购剩余秒数
      isLoadComplete: false, //是否已经加载完成
      countDonw: {}, //倒计剩余时间
      statusInfo: {}, //状态信息
      model: {},
      mobile: "",
      name: "",
      ticktTimeTips: "", //剩余时间提示
      options: {
        getThumbBoundsFn(index) {
          index = 0;
          // find thumbnail element
          let thumbnail = document.querySelectorAll(".previewer-img")[index];

          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    };
  },
  created() {
    let that = this;
    that.$storeGetter
      .getStores(that.groupAccount, that.storeId, false)
      .then(defaultStore => {
        //console.log(defaultStore);
        that.getDetail();
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    let that = this;
    document.title = "发起拼团";
    let scrollBox = that.$refs.scrollBox;
    //console.log(scrollBox)
    let chang_ing = false; //是否正在延迟切换中
    let temp = 0,
      direct = 0; //方向：0向下滚动，1向上滚动
    scrollBox.addEventListener("scroll", () => {
      that.scrollPosition = scrollBox.scrollTop; //scrollPosition为网页被卷起来的高度
      /*
			console.log(`已滚动距离:${this.scrollPosition}`)			
			console.log(`可见高度:${scrollBox.clientHeight}`)
			console.log(`子内容高度 :${scrollBox.scrollHeight}`);
			if(scrollBox.clientHeight+this.scrollPosition==scrollBox.scrollHeight)
			{
				console.log('滚动到底了')
			}
			else{
				let aa=scrollBox.scrollHeight-(scrollBox.clientHeight+this.scrollPosition);
				console.log(`距离底部还有${aa}`);
			}*/
      /*
			if(that.scrollPosition==0&&direct==1&&that.scrollPosition>=1&&that.curIndex>0&&!chang_ing){//滚动到顶
					chang_ing=true;
					setTimeout(function(){//防止闪烁
						that.curIndex--;//切换到第一个标签
						chang_ing=false;
					},500);
				}
			else{
				let scrollMarginBottom=scrollBox.scrollHeight-(scrollBox.clientHeight+this.scrollPosition);
				if(scrollMarginBottom==0&&direct==0&&that.curIndex<that.tabItems.length-1&&!chang_ing){//滚动到距离底部小于10时，切换
					chang_ing=true;
					setTimeout(function(){//防止闪烁
						that.curIndex++;//切换到第下一个标签
						chang_ing=false;
					},500);
				}
				else{
					if(that.scrollPosition>temp){
						direct=0;
					}
					else{
						direct=1;
					}
					temp=that.scrollPosition;
				}
			}*/
    });
  }
};
</script>