<template>
<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
	<div class="main-container" ref="scrollBox">
		<loading :show="!isLoadComplete"></loading>
		<div class="nav-header" :class="{'transparent':scrollPosition<100}" v-if="isLoadComplete">
			<x-header :title="scrollPosition<100?'':'交易商品快照'">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="content-wrap" v-if="isLoadComplete">
			<div class="item-detail special">
				<div class="previewer-img-container" @click="show(0)">
					<img class="previewer-img" :src="model.snapShot" width="100%">
					<span class="nums">{{model.sliders.length}}张</span>
					<h1 class="name">{{model.productName}}</h1>
				</div>
				<div class="block">
					<section class="pro-info">
						<div class="wrap">
							<div class="field">
								<div class="price">									
									¥<strong>{{model.priceNow}}</strong>
									<span class="cost">原价 ￥<strong>258</strong></span>
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
					<div slot="title">套餐摘要</div>
					<div>
						 <group label-align="right" label-width="5em" class="no-border">
						 	<cell primary="content" title="门市价格" :value="`${model.priceNow}元`"></cell>
						 	<cell primary="content" title="抢购价格" :value="`${model.priceOld}元`"></cell>
						 	<cell v-if="model.invalidMinutes>0" primary="content" title="自动取消" :value="`在 ${model.invalidMinutes}分钟内不完成支付自动取消。`"></cell>
						 	<cell primary="content" title="预约时间" v-if="!model.noAppointment">{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}至{{model.appointmentBeginTime|dateFormat('YY-MM-DD HH:mm:ss')}}</cell>
	   				        <cell primary="content" title="有效截止" :value="`${model.overTime} 后失效`"></cell>
	   				        <cell primary="content" title="房态先知"  v-if="!model.noAppointment&&model.category==1&&model.roomId>0&&model.priceTypeId>0">
	   				        	<div>想提前知道哪天有房可预约吗？<x-button mini :gradients="['#FF61AD','#FF2719']" type="primary" @click.native="viewRoomState(model)">立即点击</x-button></div>
	   				        </cell>
	   				        <template v-if="model.isGroupon">
	   				        	<cell primary="content" title="团购要求" :value="`参团人数达到${model.grouponNum}人`"></cell>
	   				        	<cell primary="content" title="已团人数" :value="`已有${model.bookedNum}人成功参团`"></cell>
	   				        	<cell primary="content" title="团购状态" :value="model.status>4?'团购失败':model.grouponNum<=model.bookedNum?'团购成功':'等待组团'"></cell>
	   				        </template>
					    </group>
					</div>
				</collapsible>
				<collapsible>
					<span class="iconfont icon-tese2" slot="icon"></span>
					<div slot="title">套餐特色</div>
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
	</div>
	<room-state :maxDate="rommStateEndDate" :minDate="roomStateBeginDate" v-if="isShowRoomState" :roomStates="roomStates" :isShow.sync="isShowRoomState"></room-state>
</popup>
</template>
<script>
import VueSticky from "vue-sticky";
export default {
  directives: {
    sticky: VueSticky
  },
  components: {
    collapsible: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/znCollapsible.vue"),
    roomState: () =>
      import(/* webpackChunkName: "hotelBooking" */ "@/components/calendar/room_state.vue")
  },
  methods: {
    show(index) {
      this.$refs.previewer.show(index);
    },
    viewRoomState(model) {
      let that = this;
      let params = {
        beginDate: model.appointmentBeginTime,
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
    onHide() {
      let th = this;
      th.$emit("update:isShow", false);
    },
    initModel() {
      let that = this;
      if (typeof that.model.sliders == "string")
        that.model.sliders = JSON.parse(that.model.sliders);
      that.isLoadComplete = true;
    },
    onChangeTab(index) {
      this.curIndex = index;
      //this.scrollPosition=0;
      //this.$refs.scrollBox.scrollTop=0;
    }
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isShowRoomState: false,
      roomStateBeginDate: "",
      rommStateEndDate: "",
      roomStates: [], //房态
      model: this.item,
      showPopup: this.isShow,
      curIndex: 0,
      tabItems: ["套餐说明", "套餐详情"],
      scrollPosition: 0,
      isLoadComplete: false, //是否已经加载完成
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
    this.initModel();
  },
  mounted() {
    document.title = "抢购详情";
    let that = this;
    let scrollBox = that.$refs.scrollBox;
    //console.log(scrollBox)
    let chang_ing = false; //是否正在延迟切换中
    let temp = 0,
      direct = 0; //方向：0向下滚动，1向上滚动
    scrollBox.addEventListener("scroll", () => {
      that.scrollPosition = scrollBox.scrollTop; //scrollPosition为网页被卷起来的高度
    });
  }
};
</script>