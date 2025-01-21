<template>
	<div class="map-location"> 
		<div class="map-container">
			<iframe :src="iframeUrl" frameborder="0" style="width:100%;height:100%;"></iframe>
		</div>
		<div class="map-back">
			<div @click="back" class="close full-width">关闭地图</div>			
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      iframeUrl: ""
    };
  },
  props: {
    lng: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    }
  },
  created() {
    this.initUrlParam();
  },
  methods: {
    back() {
      this.$emit("onMapClose");
    },
    initUrlParam() {
      // this.iframeUrl = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院|coord:39.87803,116.19025;title:成都园;addr:北京市丰台区射击场路15号北京园博园|coord:39.88129,116.27062;title:老成都;addr:北京市丰台区岳各庄梅市口路西府景园六号楼底商|coord:39.9982,116.19015;title:北京园博园成都园;addr:北京市丰台区园博园内&key=ROKBZ-ZGAR2-PXDUH-C3ELC-SVVLJ-RJBCK&referer=zndev`;
      // return;
      this.iframeUrl = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${
        this.lat
      },${this.lng};title:${this.title};addr:${
        this.address
      }&key=ROKBZ-ZGAR2-PXDUH-C3ELC-SVVLJ-RJBCK&referer=zndev`;
    }
  }
};
</script>