<template>
	<div class="map-location">
		<!--<vue-map-location
			:lng="propsMap.lng"
			:lat="propsMap.lat"
			:title="propsMap.title"
			:address="propsMap.address"
			:tel="propsMap.tel"
			:logo="propsMap.logo"
		>			
		</vue-map-location>-->
		<vue-map-location @onClickLocation="onClickLocation"
			:lng="propsMap.lng"
			height="500px"
			:lat="propsMap.lat" 
		>			
		</vue-map-location>
	</div>
	<!--<div class="my-share" v-if="loaded"  :style="{backgroundImage: 'url(http://web-img.0898so.com/share_bg.png)'}">
		<div class="body">
			<div class="user-info">
				<img :src="info.header" alt="" />
				<div><span>{{info.name}}</span></div>
				<div>为您推荐一个</div>
				<div>集酒店、餐饮、抢购、团购的消费返现的公众号</div>
				 
			</div>
			<div class="qr-code">
				<qrcode class="qrcode"  :size="160" :value="info.refererUrl" type="img"></qrcode>
				<div>长按识别图中二维码</div>
				<div class="p-a-l">
					<x-button v-if="isShowBtn" type="primary" @click.native="showHtmlToCanvas">生成图片</x-button>
				</div>
			</div>
		</div>
		<div class="footer full-width">
			<copyright></copyright>
		</div>
		<html-to-canvas :querySelector="'.my-share'" v-if="isShowHtmlToCanvas" :isShow.sync="isShowHtmlToCanvas" @on-close="onClose"></html-to-canvas>
	</div>-->
</template>

<script>
import htmlToCanvas from "@/components/common/htmlToCanvas.vue";
import VueMapLocation from "@/components/common/qqMapLocationSimple.vue";

export default {
  data() {
    return {
      propsMap: {
        lng: "109.228664",
        lat: "19.70102",
        title: "测试标题",
        address: "地球中国北京一坏二街三巷",
        tel: "010-12345678",
        logo: "http://www.zndev.cn/dist/static/images/flswjd.jpg"
      },
      info: {
        name: "好的商品分享",
        header: "http://hotel.zndev.cn/images/wechat.png",
        refererUrl: "http://www.baidu.com"
      },
      loaded: false,
      isShowHtmlToCanvas: false,
      isShowBtn: true
    };
  },
  components: {
    htmlToCanvas,
    VueMapLocation
  },
  created() {
    //console.log('created')
    this.getStoreInfo();
  },
  methods: {
    onClickLocation() {
      alert("click");
    },
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    clear() {
      this.infoWindow.contents = "";
    },
    onClose() {
      console.log("onClose");
    },
    getStoreInfo() {
      let that = this;
      //				that.$axios({
      //					url:'/Api.Web/ZnMember/MyShareInfo'
      //				})
      //				.then(res=>{
      //					that.loaded=true;
      //				})
      //				.catch(err=>{
      //					console.log(err);
      //				});

      //				var str = '<img class="img" src="http://www.0898so.com/images/product_loading_error.png" data-src="undefined" lazy="error">';
      //				var reg = /(\<img\s+.*?)(src=)([\'"]?)/;
      //				str = str.replace(reg, '$1data-src=$3')
      //				console.log(str);

      that.loaded = true;
    },
    showHtmlToCanvas() {
      let that = this;
      that.$store.dispatch("app/updateLoadingStatus", { isLoading: true });
      that.isShowBtn = false;
      setTimeout(function() {
        that.isShowHtmlToCanvas = true;
      }, 100);
    }
  },
  mounted() {
    let th = this;
  }
};
</script>
 