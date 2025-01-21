<template>
	<div class="wrapper">
	    <div class="cell">
	        <div><inline-loading></inline-loading></div>
	    </div>
	</div>
</template>

<script>
//为处理微信支付而设的页面
export default {
  data() {
    return {
      state: "", //微信回调回来的参数
      code: "", //微信回调回来的参数
      redirectUrl: ""
    };
  },
  created() {
    let params = this.$route.query;
    if (params.state && params.code) {
      //微信端回调传过来的参数
      this.state = params.state;
      this.code = params.code;
      this.wechatCallback();
    }
  },
  methods: {
    //跳转
    redirect(flag) {
      let that = this;
      let text = flag ? "支付成功" : "支付失败",
        type = flag ? "success" : "warn";
      that.$vux.toast.show({
        text,
        type,
        onHide() {
          if (that.redirectUrl && that.redirectUrl != "") {
            if (that.redirectUrl.indexOf("http") > -1) {
              window.location.replace(that.redirectUrl);
              return;
            }
            that.$router.replace({
              path: that.redirectUrl
            });
            return;
          }
          that.$router.replace({
            name: "home",
            params: that.$storeGetter.getOrg()
          });
        }
      });
    },
    wechatCallback() {
      let that = this;
      that
        .$axios({
          url: "/Api.WeChat/OAuth2/AuthorizeCallback",
          params: {
            code: that.code,
            state: that.state
          }
        })
        .then(res => {
          let openId = res.data.openid, //授权后获取到的微信用户信息
            action = res.data.redirectInfo.action, //回调要执行的操作
            stateModel = res.data.redirectInfo.stateModel; //请求授权时携带的对象
          if (stateModel.redirectUrl) {
            that.redirectUrl = stateModel.redirectUrl;
          }
          if (action == "pay") {
            let params = {
              openId,
              groupId: stateModel.groupId,
              orderNO: stateModel.orderNO,
              orderType: stateModel.orderType
            };
            that
              .$axios({
                url: "/Api.WeChat/WeChatPay/ConstructJsApiPayment",
                params
              })
              .then(res1 => {
                params = res1.data;
                if (params == 1) {
                  that.redirect(true);
                  return;
                }
                function onBridgeReady() {
                  WeixinJSBridge.invoke(
                    "getBrandWCPayRequest",
                    params,
                    function(res2) {
                      if (res2.err_msg == "get_brand_wcpay_request:ok") {
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res2.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        //当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面
                        that
                          .$axios({
                            url: "/Api.WeChat/WeChatPay/CheckPaymentState",
                            params: {
                              groupId: stateModel.groupId,
                              orderNo: stateModel.orderNO
                            }
                          })
                          .then(res3 => {
                            let flag = res3.data;
                            that.redirect(flag);
                          })
                          .catch(error3 => {
                            that.redirect(false);
                          });
                      } else {
                        that.redirect(false);
                      }
                    }
                  );
                }
                if (typeof WeixinJSBridge == "undefined") {
                  if (document.addEventListener) {
                    document.addEventListener(
                      "WeixinJSBridgeReady",
                      onBridgeReady,
                      false
                    );
                  } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      onBridgeReady
                    );
                  }
                } else {
                  onBridgeReady();
                }
              })
              .catch(err1 => console.log(err1));
          } else {
            that.redirect(false);
          }
        })
        .catch(error => {
          that.redirect(false);
        });
    }
  },
  mounted() {
    document.title = "在线支付";
  }
};
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: table;
}

.cell {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 16px;
}
.cell .weui-loading {
  width: 40px;
  height: 40px;
}
</style>
