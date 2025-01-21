<template>
	<div class="my-share" v-if="loaded"  :style="{backgroundImage: 'url(http://web-img.0898so.com/hotel_bg.png)'}">
		<div class="header" :style="{backgroundImage: 'url(http://web-img.0898so.com/tuijian-header-1.jpg)'}">
		</div>
		<div class="body">
			<div class="user-info">
				<img :src="info.header" alt="" />
				<div class="name"><span>{{info.name}}</span></div>
				<div>为您推荐一个</div>
				<div>集酒店、餐饮、抢购、团购的消费返现的公众号</div>
			</div>
			<div class="qr-code">
				<qrcode class="qrcode" size="150" :value="info.refererUrl" type="img"></qrcode>
				<div>长按识别图中二维码</div>
				<!-- <div class="p-a-l">
					<x-button v-if="isShowBtn" type="primary" @click.native="showHtmlToCanvas">生成图片</x-button>
				</div> -->
			</div>
		</div>
    <!-- fixed-bottom -->
		<div class="footer full-width ">
			<copyright></copyright>
		</div>
		<html-to-canvas :querySelector="'.my-share'" v-if="isShowHtmlToCanvas" :isShow.sync="isShowHtmlToCanvas" @on-close="onClose"></html-to-canvas>
	</div>
</template>

<script>
//import htmlToCanvas from '@/components/common/htmlToCanvas.vue'
export default {
  data() {
    return {
      info: {
        name: "",
        header: "",
        refererUrl: ""
      },
      loaded: false,
      isShowHtmlToCanvas: false,
      isShowBtn: true
    };
  },
  components: {
    htmlToCanvas: () =>
      import(/* webpackChunkName: "myShare" */ "@/components/common/htmlToCanvas.vue")
  },
  created() {
    this.getStoreInfo();
  },
  watch: {
    loaded() {
      if (this.loaded) {
        this.showHtmlToCanvas();
      }
    }
  },
  methods: {
    onClose() {
      console.log("onClose");
    },
    getStoreInfo() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyShareInfo"
        })
        .then(res => {
          //console.log(res)
          //that.test='data:image/png;base64,'+res.data;
          let org = that.$storeGetter.getOrg();
          let data = res.data;
          that.info.name = data.name;
          that.info.header = "data:image/png;base64," + data.headerUrl;
          that.info.refererUrl = `http://${document.domain}/znhotel/#/login/${
            org.groupAccount
          }/${org.groupId}?referer=${data.uid}`;
          that.loaded = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showHtmlToCanvas() {
      //return;
      let that = this;
      that.$store.dispatch("app/updateLoadingStatus", { isLoading: true });
      that.isShowBtn = false;
      setTimeout(function() {
        document.title = "推荐分享";
        that.isShowHtmlToCanvas = true;
      }, 100);
    }
  }
};
</script>
