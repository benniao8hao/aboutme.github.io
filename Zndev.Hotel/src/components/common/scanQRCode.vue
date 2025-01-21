<template>
    <div class="main-container scan-bd">
        <span  @click="beginScan" class="iconfont icon-iconfontscan">
        </span> 
        <x-button type="primary" @click.native="beginScan">扫码点餐</x-button>
        <x-button  @click.native="back">返回</x-button>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$emit("onScanClose");
    },
    beginScan() {
      //   this.$emit(
      //     "onScanSuccess",
      //     "http://localhost:8081/#/restaurant/zndev/3/?tableId=3"
      //   );
      //   return;

      let that = this;
      let _url = location.href.split("#")[0]; //window.entryUrl; //
      that
        .$axios({
          //baseURL:'http://localhost:1477',
          url: "/Api.Web/Common/JSSDKTicket",
          params: {
            url: encodeURIComponent(_url),
            groupId: that.$storeGetter.getOrg().groupId
          }
        })
        .then(res => {
          let cfg = res.data;
          //console.log(cfg)
          wx.config({
            //debug: true,
            appId: cfg.appId,
            timestamp: cfg.timeStamp,
            nonceStr: cfg.nonceStr,
            signature: cfg.signature,
            jsApiList: ["scanQRCode"]
          });

          wx.ready(function() {
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function(codeData) {
                var url = codeData.resultStr; // 当needResult 为 1 时，扫码返回的结果
                that.$emit("onScanSuccess", url);
              },
              fail: function(msg) {
                console.log(msg);
                //that.$tips.alert(msg);
                that.$tips.warn(
                  "该功能暂时不可用，请使用微信自带的扫码功能",
                  1000 * 2
                );
              },
              complete: function(r) {
                console.log(r);
              }
            });
          });
          wx.error(function(res) {
            console.log("wx err", res);
            //that.$tips.alert(res);
            //that.$tips.alert(cfg);
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>