<template>
<div class="main-container">
	<div class="my-wrap">
		<div class="my-tips" v-if="needModifyPasswordTips">
			{{needModifyPasswordTips}}
			<span class="iconfont icon-xiugai" @click="isShowInfo=true">立即修改</span>
		</div>
		<div class="top-header" :style="{backgroundImage: 'url(http://web-img.0898so.com/bg-member-center-top.png)'}">
			<div class="info">
				<img v-show="loaded" @click="isShowInfo=true" :src="myInfo.headerUrl" />
				<div>
					<span>{{myInfo.name}}</span>
					<span>{{myInfo.account}}</span>
				</div>
				<span class="iconfont icon-settings" @click="isShowInfo=true"></span>
				<template v-if="loaded">
					<strong @click="bindWechat" v-if="isWecharBrower&&myInfo.headerUrl.indexOf('qlogo.cn')==-1">绑定微信</strong>
				</template>
			</div>
			<div class="card-flex card-content01" v-if="loaded">
				<div class="vux-1px-r"  @click="showDaybook(1,-1,false,'消费记录')">
					<span>¥</span>
					<countup :start-val="0" :decimals="2" :end-val="myInfo.amtBet" :duration="1"></countup>
					<br/> 累计消费
				</div>
				<div class="vux-1px-r" @click="isShowBonus=true">
					<span>¥</span>
					<countup :start-val="0"  :decimals="2" :end-val="myInfo.amtBalance" :duration="1"></countup>
					<br/> 可用奖金
				</div>
				<div class="vux-1px-r"  @click="showDaybook(4,-1,false,'提现记录')">
					<span>¥</span>
					<countup :start-val="0"  :decimals="2" :end-val="myInfo.amtCash" :duration="1"></countup>
					<br/> 提现累计
				</div>
				<div @click="isShowRecharge=true">
					<span>¥</span>
					<countup :start-val="0"  :decimals="2" :end-val="myInfo.amtPrestore" :duration="1"></countup>
					<br/> 充值余额
				</div>
			</div>
		</div>
		<grid :cols="4">
			<grid-item :link="{name:'my_hotel_order'}">
				<span class="iconfont icon-jiudian"></span> 客房订单
			</grid-item>
			<grid-item :link="{name:'my_repast_order'}">
				<span class="iconfont icon-canyin"></span> 餐饮订单
			</grid-item> 
      <grid-item>
				<div class="full-height full-width" @click="showDaybook(-1,-1,true,'流水账单')">
					<span class="iconfont icon-zhangdan1"></span> 流水账单	
				</div>
			</grid-item>
			<grid-item>
				<div class="full-height full-width" @click="isShowEquities=true">
					<span class="iconfont icon-quanyishuoming"></span> 优惠权益
				</div>
			</grid-item> 
		</grid>
		<group> 
      <cell-box is-link>
        <div @click="isShowComments=true" class="full-width" >
          <span class="iconfont icon-pinglun"></span>我的点评
        </div>
      </cell-box> 
      <cell-box is-link>
        <div @click="isShowTickets=true" class="full-width" >
          <span class="iconfont icon-menpiao3"></span>我的票券
        </div>
      </cell-box> 
      <cell-box is-link>
        <div @click="isShowReferrals=true" class="full-width" >
          <span class="iconfont icon-guanyuwomen2"></span>我的推荐
        </div>
      </cell-box> 
    </group> 
    <group> 
      <cell-box is-link>
        <div @click="isShowComInfo=true" class="full-width" >
          <span class="iconfont icon-changyongxinxi"></span>常用信息
        </div>
      </cell-box> 
      <cell-box is-link> 
        <div @click="toShare('my_share')" class="full-width" >
          <span class="iconfont icon-fenxiang1"></span>推荐分享
        </div>
      </cell-box>  
      <cell-box is-link>
        <div @click="isShowQAs=true" class="full-width" >
          <span class="iconfont icon-wenhaoxiao"></span>常见问题
        </div>
      </cell-box> 
    </group>
    <group>
      <cell-box is-link>
        <div @click="logOut" class="full-width" >
          <span class="iconfont icon-tuichu1"></span>注销登录
        </div>
      </cell-box>
    </group>
 		<copyright></copyright>
		<navbar></navbar>
		<com-info v-if="isShowComInfo" :isShow.sync="isShowComInfo"></com-info>
		<my-comment v-if="isShowComments" :isShow.sync="isShowComments"></my-comment>
		<daybook v-if="daybookOptions.isShow" 
			:showFilterBar="daybookOptions.showFilterBar" 
			:daybookType="daybookOptions.daybookType"
			:daybookStatus="daybookOptions.daybookStatus"
			:headerTitle="daybookOptions.headerTitle"
			:isShow.sync="daybookOptions.isShow"></daybook>
		<equities v-if="isShowEquities" :isShow.sync="isShowEquities"></equities>
		<referrals v-if="isShowReferrals" :isShow.sync="isShowReferrals"></referrals>
    <tickets v-if="isShowTickets" :isShow.sync="isShowTickets"></tickets>
		<qas v-if="isShowQAs" :isShow.sync="isShowQAs"></qas>
		<info @afterModifyBaseInfo="afterModifyBaseInfo" v-if="isShowInfo" :info="myInfo" :isShow.sync="isShowInfo"></info>
		<bonus v-if="isShowBonus"  :isShow.sync="isShowBonus" ></bonus>
		<recharge v-if="isShowRecharge"  :isShow.sync="isShowRecharge" ></recharge>
		<div class="my-car" @click="toShoppingCarCenter">
			<span class="iconfont icon-gouwuche7"></span>
			<badge :text="productCountIncar" v-if="productCountIncar>0"></badge>
		</div>
	</div>
</div>  
</template>

<script>
import { getToken, removeToken } from "@/utils/auth.js";
import shoppingCar from "@/utils/shopping_car.js";
import { logout } from "@/api/author.js";
export default {
  data() {
    return {
      needModifyPasswordTips: "",
      submiting: false,
      loaded: false,
      isShowComInfo: false,
      isShowComments: false,
      isShowEquities: false,
      isShowReferrals: false,
      isShowTickets: false,
      isShowQAs: false,
      isShowInfo: false,
      daybookOptions: {
        isShow: false,
        showFilterBar: false,
        daybookType: -1,
        daybookStatus: -1,
        headerTitle: "流水账单"
      },
      isShowBonus: false,
      isShowRecharge: false,
      myInfo: {},
      productCountIncar: 0 //购物车中商品件数
    };
  },
  components: {
    comInfo: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/commonInformation.vue"),
    daybook: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/daybook.vue"),
    equities: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/equities.vue"),
    referrals: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/referrals.vue"),
    qas: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "../questions_answers.vue"),
    info: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/userInfo.vue"),
    bonus: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/bonus.vue"),
    recharge: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/recharge.vue"),
    myComment: () =>
      import(/* webpackChunkName: "myComment" */ "./components/myComment.vue"),
    tickets: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./components/tickets.vue")
  },
  props: {
    groupAccount: {
      type: String,
      default: ""
    }
  },
  computed: {
    isWecharBrower() {
      return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
    }
  },
  methods: {
    bindWechat() {
      let that = this;
      if (that.submiting) {
        return;
      }
      that.submiting = true;
      let org = that.$storeGetter.getOrg();
      that
        .$axios({
          url: "/Api.WeChat/OAuth2/AuthorizeUrl",
          data: {
            groupId: org.groupId,
            returnUrl: `http://www.0898so.com/znhotel/oauth/${
              org.groupAccount
            }/${org.groupId}`,
            action: "bindWechat",
            state: {
              redirectUrl: `/my/${org.groupAccount}`
            },
            snsapiType: 1,
            isGetUserInfo: true
          }
        })
        .then(res2 => {
          window.location.href = res2.data; //请求微信服务器
        })
        .catch(error => {
          that.submiting = false;
          console.log(error);
        });
    },
    showDaybook(type = -1, status = -1, isShowBar = true, title = "流水账单") {
      this.daybookOptions.daybookType = type;
      this.daybookOptions.daybookStatus = status;
      this.daybookOptions.showFilterBar = isShowBar;
      this.daybookOptions.headerTitle = title;
      this.daybookOptions.isShow = true;
    },
    toShoppingCarCenter() {
      this.$router.push({
        name: "shopping_cart"
      });
    },
    toShare(name) {
      this.$router.push({
        name,
        props: {
          groupAccount: this.groupAccount
        }
      });
    },
    logOut() {
      let that = this;
      that.$tips.confirm({
        content: "确认要退出吗？",
        onConfirm: function() {
          logout(that.groupAccount)
            .then(res => {
              removeToken(that.groupAccount);
              let params = that.$storeGetter.getOrg();
              //console.log(params);
              that.$router.push({
                name: "home",
                params
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    getMyInfo() {
      let that = this;
      let org = that.$storeGetter.getOrg();
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyInfo",
          params: {
            groupId: org.groupId
          }
        })
        .then(res => {
          //console.log(res);
          that.myInfo = res.data;
          that.loaded = true;
          that.$store.dispatch("app/updateLoadingStatus", { isLoading: false });
          if (res.data.needModifyPassword != 1) {
            that.needModifyPasswordTips =
              "您的登录密码还是初始密码，安全起见，请尽快修改";
          } else if (res.data.needModifyPassword == 2) {
            that.needModifyPasswordTips =
              "您的支付密码还是初始密码，安全起见，请尽快修改";
          } else if (res.data.needModifyPassword == 3) {
            that.needModifyPasswordTips =
              "您的密码还是初始密码，安全起见，请尽快修改";
          }
        })
        .catch(err => console.log(err));
    },
    afterModifyBaseInfo(info) {
      this.myInfo = info;
    },
    loadShoppingCar() {
      let products = shoppingCar.getProducts();
      this.productCountIncar = products.length;
    }
  },
  created() {
    let that = this;
    that.$storeGetter
      .getStores(that.groupAccount, that.storeId, false)
      .then(defaultStore => {
        //console.log(defaultStore);
        let token = getToken(that.groupAccount);
        if (!token) {
          that.$router.replace({
            path: `/login/${defaultStore.groupAccount}/${defaultStore.groupId}`,
            query: { redirect: that.$router.currentRoute.fullPath }
          });
        } else {
          that.loadShoppingCar();
          that.getMyInfo();
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    document.title = "个人中心";
  }
};
</script>
