<template>
	<div>
	</div>
</template>

<script>
import { setToken } from "@/utils/auth.js";
//为处理微信授权而设的页面
export default {
  data() {
    return {
      state: "", //微信回调回来的参数
      code: "", //微信回调回来的参数
      redirectUrl: ""
    };
  },
  props: {
    groupId: {
      required: true
    },
    groupAccount: {
      type: String,
      required: true
    }
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
    redirect() {
      let that = this;
      that.$vux.toast.hide();
      if (that.redirectUrl && that.redirectUrl != "") {
        that.$router.replace({
          path: that.redirectUrl
        });
        return;
      }
      that.$router.replace({
        name: "home",
        params: {
          groupAccount: that.groupAccount
        }
      });
    },
    /*
			 * info:授权后获取到的微信用户信息
			 * stateMode:请求授权时携带的对象
			 */
    submitBindWechat(info, stateModel) {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/BindWechat",
          params: {
            groupId: that.groupId,
            openId: info.openid,
            sex: info.sex,
            nickname: info.nickname,
            headimgurl: info.headimgurl
          }
        })
        .then(res => {
          that.redirect();
        })
        .catch(err => {
          that.redirect();
          console.log(err);
        });
    },
    /*
			 * info:授权后获取到的微信用户信息
			 * stateMode:请求授权时携带的对象
			 */
    submitRegist(info, stateModel) {
      let that = this;
      let data = {
        openId: info.openid,
        sex: info.sex,
        name: info.nickname,
        headerUrl: info.headimgurl,
        groupId: that.groupId,
        groupAccount: that.groupAccount,
        account: "123456",
        password: "123456",
        referer: stateModel.referer
      };
      that
        .$axios({
          url: "/Api/Author/RegistWithWeChat",
          data
        })
        .then(res1 => {
          let dataAuthor = res1.data;
          setToken(dataAuthor.token, that.groupAccount);
          that.redirect();
        })
        .catch(error1 => {
          that.$vux.toast.hide();
          //console.log(error1);
          that.$tips.warn("授权失败，请稍后重试");
          setTimeout(function() {
            that.$router.replace({
              name: "home",
              params: {
                groupAccount: that.groupAccount
              }
            });
          }, 1000 * 2);
        });
    },
    wechatCallback() {
      let that = this;
      that.$vux.toast.show({
        text: "请稍候……",
        position: "middle",
        isShowMask: true,
        time: 1000 * 20
      });
      that
        .$axios({
          url: "/Api.WeChat/OAuth2/AuthorizeCallback",
          params: {
            code: that.code,
            state: that.state
          }
        })
        .then(res => {
          let info = res.data.userInfo, //授权后获取到的微信用户信息
            action = res.data.redirectInfo.action, //回调要执行的操作
            stateModel = res.data.redirectInfo.stateModel; //请求授权时携带的对象
          if (stateModel.redirectUrl) {
            that.redirectUrl = stateModel.redirectUrl;
          }
          if (action == "regist") {
            that.submitRegist(info, stateModel);
          } else if (action == "bindWechat") {
            that.submitBindWechat(info, stateModel);
          }
        })
        .catch(error => {
          that.$vux.toast.hide();
          console.log(error);
          that.$tips.warn("微信授权失败，请稍后重试。");
          setTimeout(function() {
            that.$router.replace({
              name: "home",
              params: {
                groupAccount: that.groupAccount
              }
            });
          }, 1000 * 2);
        });
    }
  }
};
</script>
  