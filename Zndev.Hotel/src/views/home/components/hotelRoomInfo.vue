<template>
	<div class="room-info">
		<div class="room-detail">
			<div class="info-title">
				{{info.roomName}}
				<span class="iconfont icon-close" @click="hideRoomInfo"></span>
			</div>
			<swiper :aspect-ratio="320/480" dots-position="center">
				<swiper-item v-for="(item, index) in info.sliders" :key="index"><img :src="_getImgUrl(item.src)"></swiper-item>
			</swiper>
			<div class="info-service">
				<ul>
					<li>
						<span class="iconfont icon-m2"></span> {{info.acreages}}平米
					</li>
					<li>
						<span class="iconfont icon-chuangweiyuyue"></span> {{info.bedType}}{{info.bedSize}}米
					</li>
					<li>
						<span class="iconfont icon-loutistairs7"></span>{{info.floordiStribution}}层
					</li>
					<li>
						<span class="iconfont icon-person2"></span> 可入住{{info.checkInPopulation}}人
					</li>
					<li>
						<span class="iconfont" :class="{'icon-youchuang-':info.hasWindow,'icon-wuchuang-':!info.hasWindow}"></span> {{info.hasWindow?'有窗':'无窗'}}
					</li>
					<li v-if="info.noSmoking">
						<span class="iconfont icon-jinzhixiyan"></span> 禁止吸烟
					</li>
					<li v-if="info.affordWifi">
						<span class="iconfont icon-wifi4"></span> Wifi
					</li>
					<li v-if="info.affordCarport">
						<span class="iconfont icon-yingyuanxinxitingchechang"></span> 停车场
					</li>
					<li v-if="info.affordStrongbox">
						<span class="iconfont icon-baoxiangui1"></span> 保险柜
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
						<span class="iconfont icon-xiyiji"></span> 洗衣机
					</li>
					<li v-if="info.affordSurf">
						<span class="iconfont icon-computer"></span> 电脑上网
					</li>
					<li v-if="info.affordAwaken">
						<span class="iconfont icon-jiaoxing"></span> 叫醒服务
					</li>
					<li v-if="info.affordDeposit">
						<span class="iconfont icon-save"></span> 行李寄存
					</li>
					<li v-if="info.affordPickup">
						<span class="iconfont icon-jipiao"></span> 接机服务
					</li>
					<li v-if="info.affordMettingRoom">
						<span class="iconfont icon-huiyishi"></span> 会议室
					</li>
					<li v-if="info.affordRestaurant">
						<span class="iconfont icon-canyin"></span> 餐厅
					</li>
				</ul>
			</div>
			<hr />
			<div class="p-lr-s">
			<div class="info-desc">
				<div class="desc-item">
					<label>入离通知：</label>
					<p>{{info.checkInTime}}以后入住，{{info.checkOutTime}}以前退房</p>
				</div>
				<div class="desc-item" v-if="info.facility">
					<label>客房设施：</label>
					<p>{{info.facility}}&nbsp;</p>
				</div>
				<div class="desc-item" v-if="info.attention">
					<label>预订须知：</label>
					<p>{{info.attention}}&nbsp;</p>
				</div>
				<div class="desc-item" v-if="info.policy">
					<label>退改政策：</label>
					<p>{{info.policy}}&nbsp;</p>
				</div>
				<div class="desc-item">
					<label>综合评分：</label>
					<p  v-if="score>0"><span class="f-red">{{score}}	分</span></p>
					<p v-else>暂无评分</p>
				</div>
			</div>
			</div>
			<flexbox>
		        <flexbox-item v-if="score>0">
		          <x-button @click.native="showComment=true" class="weui-btn_orange">查看会员评价</x-button>
		        </flexbox-item>
		        <flexbox-item>
		          <x-button type="primary" @click.native="hideRoomInfo">返回继续预订</x-button>
		        </flexbox-item>
	        </flexbox>
		</div>
		<popup :show-mask="false" v-if="showComment" v-model="showComment" position="top" class="full-height">
			<div class="main-container bg-white">
				<div class="nav-header">
					<x-header :title="`【${info.roomName}】的评价`"> 
					 	<div slot="overwrite-left" @click="showComment=false">
				          	<span class="iconfont icon-xiangzuojiantou"></span>返回
			            </div>
					</x-header>
				</div>
				<div class="content-wrap top-header-padding p-a-l text-left">
					<comment-list class="comment-lg"
						:roomId="info.tid"
						> 
					</comment-list>
			    </div>
	        </div>
		</popup>
	</div>
</template>

<script>
export default {
  data() {
    return {
      showComment: false,
      score: 0,
      info: {}
    };
  },
  components: {
    commentList: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/commentList.vue")
  },
  props: {
    roomId: {
      type: Number,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    roomInfo: {} //如果传递过来的对象非空，则直接显示，不再请求接口
  },
  methods: {
    getRoomInfo() {
      let that = this;
      if (that.roomInfo) {
        that.info = that.roomInfo;
        that.getRoomScore();
        return;
      }
      that
        .$axios({
          url: "/Api.Hotel/HTHotel/RoomInfo",
          params: {
            roomId: that.roomId
          }
        })
        .then(res => {
          let detail = res.data;
          detail.sliders = JSON.parse(detail.sliders);
          //console.log(detail.sliders)
          that.info = detail;
          that.$emit("onRoomInfoLoaded", detail);
          that.getRoomScore();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRoomScore() {
      let that = this;
      that
        .$axios({
          url: "/Api.Hotel/HTHotel/RoomScore",
          params: {
            roomId: that.roomId
          }
        })
        .then(res => {
          this.score = res.data;
          //console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    hideRoomInfo() {
      this.$emit("update:isShow", false);
    }
  },
  created() {
    this.getRoomInfo();
  }
};
</script>