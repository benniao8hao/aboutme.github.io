<template>
<div class="main-container">
    <div class="my-share" :style="{backgroundImage: 'url(http://web-img.0898so.com/hotel_bg.png)'}">
        <div class="booking-hotel">
            <div class="share-hotel" v-if="info">
                <img :src="info.storePic" alt="">
                <section class="shop-info">
                    <div class="wrap">
                        <h3 class="avatar"><img width="100%" height="100%" v-lazy="info.storeLogo" :key="info.storeLogo"></h3>
                        <div class="field">
                            <h1 class="name">{{info.storeName}}</h1>
                            <div class="shop-type ellipsis">{{info.address}}</div>
                            <div class="cert-box" @click="isShowPopup=true">
                                <div v-if="info.affordShower">
                                    <span class="iconfont icon-reshui"></span> 
                                    <b>热水器</b>
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
                            </div>
                        </div> 
                    </div> 
                </section>       
                <div class="p-tb-l">
                    <div>
                        微信订房就上 <b>{{info.storeName}}</b>
                    </div> 
                    <qrcode class="qrcode"  :size="140" :value="info.refererUrl" type="img"></qrcode>
                    <div>长按识别图中二维码</div>
                </div> 
                <!-- fixed-bottom -->
                <div class="footer full-width"> 
                    <copyright></copyright>
                </div>         
            </div>
        </div>
    </div>
    <html-to-canvas :querySelector="'.my-share'" v-if="isShowHtmlToCanvas" :isShow.sync="isShowHtmlToCanvas"></html-to-canvas>
</div>
</template>
<script>
import { getToken } from "@/utils/auth.js";
export default {
  data() {
    return {
      info: null,
      isShowHtmlToCanvas: false,
      loaded: false
    };
  },
  props: {
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      type: Number,
      required: true
    }
  },
  components: {
    htmlToCanvas: () =>
      import(/* webpackChunkName: "myShare" */ "@/components/common/htmlToCanvas.vue")
  },
  created() {
    this.getHotelInfo(this.storeId);
  },
  watch: {
    loaded() {
      if (this.loaded) {
        this.showHtmlToCanvas();
      }
    }
  },
  methods: {
    getHotelInfo(storeId) {
      let that = this;
      that
        .$axios({
          url: "/Api.Hotel/HTHotel/HotelDetail",
          params: { storeId }
        })
        .then(res1 => {
          let token = getToken(that.groupAccount);
          if (token) {
            that
              .$axios({
                url: "/Api.Web/ZnMember/MyShareInfo"
              })
              .then(res2 => {
                let data = res2.data;
                that.info = Object.assign(res1.data, {
                  refererUrl: `http://${document.domain}/znhotel/#/home/${
                    that.groupAccount
                  }/${that.storeId}?referer=${data.uid}`
                });
                that.loaded = true;
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            that.info = Object.assign(res1.data, {
              refererUrl: `http://${document.domain}/znhotel/#/home/${
                that.groupAccount
              }/${that.storeId}`
            });
            that.loaded = true;
          }
          //   window.setTimeout(function() {
          //     that.showHtmlToCanvas();
          //   }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    showHtmlToCanvas() {
      let that = this;
      that.$store.dispatch("app/updateLoadingStatus", { isLoading: true });
      setTimeout(function() {
        that.isShowHtmlToCanvas = true;
      }, 1000);
    }
  },
  mounted() {
    document.title = "酒店分享";
  }
};
</script>
