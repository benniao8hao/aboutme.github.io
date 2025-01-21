<template>
	<popup v-model="isShowPopup" :show-mask="false" class="full-height full-width bg-white" style="overflow: hidden;">
		<div ref="canvasContainer"></div>
	</popup>
</template>

<script>
import Canvas2Image from "canvas2image";
export default {
  data() {
    return {
      isShowPopup: true
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    querySelector: {
      type: String,
      required: true
    }
  },
  methods: {
    onHide() {
      this.isShowPopup = false;
      this.$emit("update:isShow", false);
    }
  },
  mounted() {
    let that = this;
    var shareContent = document.querySelector(that.querySelector); //需要截图的包裹的（原生的）DOM 对象
    var width = document.documentElement.clientWidth; // document.body.clientWidth; //获取屏幕 宽度
    var height = document.documentElement.clientHeight; // document.body.clientHeight; //获取屏幕 高度
    // console.log(
    //   `${document.documentElement.clientHeight}====${
    //     document.body.clientHeight
    //   }`
    // );
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
    var opts = {
      scale: scale, // 添加的scale 参数
      canvas: canvas, //自定义 canvas
      // logging: true, //日志开关，便于查看html2canvas的内部执行流程
      width: width, //dom 原始宽度
      height: height,
      allowTaint: false,
      useCORS: true // 【重要】开启跨域配置
    };
    let canvasContainer = that.$refs.canvasContainer;
    html2canvas(shareContent, opts).then(function(canvas) {
      var context = canvas.getContext("2d");
      // 【重要】关闭抗锯齿
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      // 【重要】默认转化的格式为png,也可设置为其他格式
      var img = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height);
      canvasContainer.appendChild(img);

      window.setTimeout(function() {
        that.$store.dispatch("app/updateLoadingStatus", { isLoading: false });
        that.$tips.alert("长按图片可保存或发送给好友");
        //that._done("长按图片可保存或发送给好友");
      }, 1000);
    });
  }
};
</script>
