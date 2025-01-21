<template>
	<div  v-if="info.sliders">
		<div class="previewer-img-container">
			<img class="previewer-img" v-lazy="info.storePic"  :key="info.storePic" width="100%" @click="show(0)">
			<div class="ht-name" v-if="stores.length>1">
				<!--[{{info.groupNameAcronym}}]-->{{info.storeNameAcronym}}
				<span  @click="isShowStoreActionSheet=true">切换分店</span>
			</div>
			<span class="nums iconfont icon-pic"  @click="show(0)">&nbsp;{{info.sliders.length}}张</span>
			<div class="qrcode" @click="toShareHotel">
				<span class="iconfont icon-erweima"></span>
				<div>分享</div>
			</div>
		</div>
		<section class="shop-info">
			<div class="wrap">
				<h3 class="avatar"><img width="100%" height="100%" v-lazy="info.storeLogo" :key="info.storeLogo"></h3>
				<div class="field">
					<h1 class="name">{{info.storeName}}</h1>
					<div class="shop-type">{{info.address}}</div>
					<!-- <div class="cert-level hd_info_childrens">
						<span class="iconfont icon-vip"></span> <span>{{info.hotelType==1?'酒店':info.hotelType==2?'客栈':'旅馆'}}</span>
					</div> -->
				</div>
				<div class="shop-dynamic" @click="changeMapShow(true)">
					<span class="iconfont icon-dibiao"></span>
				</div>
			</div>
			<div class="cert-box" @click="isShowPopup=true">
				<div v-if="info.isRecommend==1">
					<span class="iconfont icon-appreciate"></span>
					<b>平台推荐</b>
				</div>
				<div v-if="info.affordCarport">
					<span class="iconfont icon-yingyuanxinxitingchechang"></span>
					<b>有停车场</b>
				</div>
				<div v-if="info.affordWifi">
					<span class="iconfont icon-wifi4"></span>
					<b>Wifi上网</b>
				</div>
				<div v-if="info.affordWasher">
					<span class="iconfont icon-computer"></span>
					<b>电脑上网</b>
				</div>
				<div v-if="info.affordRestaurant">
					<span class="iconfont icon-canyin"></span>
					<b>内设餐厅</b>
				</div>
				<div class="more">
					详情<span class="iconfont icon-right"></span>
				</div>
			</div>
			 
			<div class="intro" v-if="isShowPopup">
				<div class="scroller-bar">
					<div class="intro-top">
						<div class="l">
							<div class="n">{{info.storeName}}</div>
							<div class="a">
								<span class="iconfont icon-location_light"></span> 
								{{info.address}}
							</div>
						</div>
						<div class="r">
							<a :href="'tel:'+info.tel"><span class="iconfont icon-service1"></span></a>
						</div>
					</div>
					<div class="block first">
						<div class="tl">
							酒店设施
						</div>
						<div class="ct">
							<ul>
								<li v-if="info.affordWifi">
									<span class="iconfont icon-wifi4"></span> Wifi
								</li>
								<li v-if="info.affordCarport">
									<span class="iconfont icon-yingyuanxinxitingchechang"></span> 停车场
								</li>
								<li v-if="info.affordStrongbox">
									<span class="iconfont icon-box"></span> 保险柜
								</li>
								<li v-if="info.affordIcebox">
									<span class="iconfont icon-bingxiang1"></span> 冰箱
								</li>
								<li v-if="info.affordShower">
									<span class="iconfont icon-reshui"></span> 热水器
								</li>
								<li v-if="info.affordSwimmingPool">
									<span class="iconfont icon-youyongchi"></span> 游泳池
								</li>
								<li v-if="info.affordWasher">
									<span class="iconfont icon-lajixiang"></span> 洗衣机
								</li>
								<li v-if="info.affordSurf">
									<span class="iconfont icon-computer"></span> 电脑上网
								</li>
								<li v-if="info.affordAwaken">
									<span class="iconfont icon-naozhong"></span> 叫醒服务
								</li>
								
								<li v-if="info.affordDeposit">
									<span class="iconfont icon-save"></span> 行李寄存
								</li>
								<li v-if="info.affordPickup">
									<span class="iconfont icon-jipiao"></span> 接机服务
								</li>
								<li v-if="info.affordMettingRoom">
									<span class="iconfont icon-edit"></span> 会议室
								</li>
								<li v-if="info.affordRestaurant">
									<span class="iconfont icon-canyin"></span> 餐厅
								</li> 
							</ul>
						</div>
					</div>
					<div class="block">
						<div class="tl">温馨提示</div>
						<div class="ct">
							<div class="desc-row">
								<label>开业日期</label>
								<p>{{info.startBusinessDate | dateFormat('YYYY年MM月DD日')}}</p>
							</div>
							<div class="desc-row">
								<label>最近装修</label>
								<p>{{info.titmentDate | dateFormat('YYYY年MM月DD日')}}</p>
							</div>
							<div class="desc-row">
								<label>入离通知</label>
								<p>入住时间：{{info.checkInTime}}以后，离店时间：{{info.checkOutTime}}以前</p>
							</div>
							<div class="desc-row" v-if="info.attention!=''">
								<label>预订须知</label>
								<p>{{info.attention}}</p>
							</div>
							<div class="desc-row" v-if="info.policy!=''">
								<label>退改政策</label>
								<p>{{info.policy}}</p>
							</div>							
						</div>
					</div>
					<div class="block">
						<div class="tl ht-desc">酒店简介</div>
						<div class="ct ht-desc" v-html="info.storeDesc">
						</div>
					</div>
					<div class="block back">
						<div class="ct">
							<a href="javascript:;" class="weui-btn weui-btn_plain-primary" @click="isShowPopup=false">返回继续预订</a>
						</div>
					</div>
				</div>
			</div>
			 
		</section>
		<div v-transfer-dom>
			<previewer :list="info.sliders" ref="previewer" :options="options"></previewer>
		</div>
		<map-location @onMapClose="onMapClose" :lng="info.longitude" :lat= "info.latitude" :title="info.storeName" :address="info.address" :tel="info.tel" :logo="info.storeLogo" v-if="isShowMap"></map-location>
		
		<actionsheet
		  v-model="isShowStoreActionSheet"
		  :menus="stores"
		  theme="android"
		  show-cancel
		  @on-click-menu="changeStore"
		 >
		</actionsheet>
		
	</div>
</template>

<script>
import { getToken } from "@/utils/auth.js";
export default {
  data() {
    return {
      hotelsInfo: {}, //店铺列表信息
      selectedStoreId: 0,
      isShowStoreActionSheet: false,
      isShowPopup: false,
      isShowMap: false,
      stores: [],
      info: {},
      options: {
        getThumbBoundsFn(index) {
          index = 0;
          let thumbnail = document.querySelectorAll(".previewer-img")[index];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }
      }
    };
  },
  components: {
    MapLocation: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/qqMapLocationOnMobile.vue")
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
    toShareHotel() {
      let that = this;
      let token = getToken(that.groupAccount);
      if (!token) {
        that.$tips.confirm({
          title: "温馨提示",
          confirmText: "登录再分享",
          cancelText: "直接分享",
          content:
            "登录后再分享，会员通过分享网址注册消费，您将获得推荐奖励。您还未登录，是否先登录再分享？",
          onConfirm: function() {
            that.$router.replace({
              path: `/login/${that.groupAccount}/${that.hotelsInfo.groupId}`,
              query: { redirect: that.$router.currentRoute.fullPath }
            });
          },
          onCancel: function() {
            that.$router.push({
              name: "share_hotel",
              params: {
                groupAccount: that.groupAccount,
                storeId: that.hotelsInfo.storeId
              }
            });
          }
        });
      } else
        that.$router.push({
          name: "share_hotel",
          params: {
            groupAccount: that.groupAccount,
            storeId: that.hotelsInfo.storeId
          }
        });
    },
    getHotels() {
      let that = this;
      //获取全部店铺
      that.$storeGetter
        .getStores(that.groupAccount, that.storeId, true)
        .then(defaultStore => {
          //console.log(defaultStore);
          that.hotelsInfo = defaultStore;
          //console.log(that.hotelsInfo);
          if (!defaultStore.isSelf) {
            //非自营店，设置店铺列表为空，不显示“切换”按钮
            that.stores = [];
          }
          that.getHotelInfo(defaultStore.storeId);
        })
        .catch(err => {
          alert(err);
          console.log(err);
        });
    },
    getHotelInfo(storeId) {
      let that = this;
      that
        .$axios({
          url: "/Api.Hotel/HTHotel/HotelDetail",
          params: {
            storeId
          }
        })
        .then(res1 => {
          let groupId = that.hotelsInfo.groupId;
          let detail = res1.data;
          detail.sliders = JSON.parse(detail.sliders);
          that.info = Object.assign(detail, {
            groupNameAcronym: that.hotelsInfo.groupNameAcronym
          });
          that.selectedStoreId = storeId;
          that.stores = [];
          that.hotelsInfo.stores.forEach((e, i, a) => {
            if (e.id == that.selectedStoreId) {
              that.stores.push({
                label: e.name + "(当前店)",
                value: e.id
              });
            } else {
              that.stores.push({
                label: e.name,
                value: e.id
              });
            }
          });
          that.$emit("onLoaded");
        })
        .catch(err => {
          console.log(err);
        });
    },
    onMapClose() {
		console.log('map close');
      this.isShowMap = false;
    },
    show(index) {
      this.$refs.previewer.show(index);
    },
    changeMapShow(isShow) {
      this.isShowMap = isShow;
    },
    changeStore(menuKey, menuItem) {
      //				console.log(menuKey)
      //				console.log(menuItem)
      this.getHotelInfo(menuKey);
      let org = this.$storeGetter.getOrg();
      org = Object.assign(org, { storeId: menuKey });
      this.$storeGetter.setOrg(org);
      this.$tips.done('简单演示版，没有多店数据')
    }
  },
  created() {
    this.getHotels();
  }
};
</script>