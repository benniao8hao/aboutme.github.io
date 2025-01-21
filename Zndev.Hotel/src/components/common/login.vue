<template>
	<div class="login-wrapper">
		<div class="container">
			<div class="top">
				<img src="http://web-img.0898so.com/zndev.logo.png"/>
				<div>{{isRegist?'会员注册':'会员登录'}}</div>
			</div>
			<group>
		      <x-input placeholder="手机号码/会员账号" v-model="postModel.account">
		        <span class="iconfont icon-account" slot="label"></span>
		      </x-input>
		    </group>
		    <group>
		      <x-input placeholder="密码" :type="passwordDispalyType" v-model="postModel.password">
		        <span class="iconfont icon-password" slot="label"></span>
		        <span class="iconfont icon-yanjing" :class="{'iconfont-normal':passwordDispalyType=='password'}" @click="changePasswordDisplay" slot="right"></span>
		      </x-input>
		    </group>
		    <div class="btn-area">
		    	<x-button type="primary" @click.native="submit">{{isRegist?'注册':'登录'}}</x-button>
		    	<x-button @click.native="isRegist=!isRegist">{{isRegist?'返回':'注册'}}</x-button>
		    </div>
		    <div class="reverse" v-if="!isRegist">
		    	<!--<a href="javascript:void(0)">立即注册</a>
		    	|-->
		    	<!-- <a href="javascript:void(0)">忘记密码？</a> -->
          <a :href="getPasswordUrl">忘记密码？</a>
		    </div>
		    <divider>其他{{isRegist?'注册':'登录'}}方式</divider>
		    <div class="other m-b-l">
		    	<img src="http://web-img.0898so.com/wechat.png" @click="wechatRegist"/>
		    </div>
		    <copyright class="copyright m-t-l no-line"></copyright>
		</div>
	</div>
</template>

<script>
import validator from "@/utils/validator.js";
import { login, regist } from "@/api/author.js";
import { setToken } from "@/utils/auth.js";
import { getReferer, setReferer } from "@/utils/referer";
export default {
  data() {
    let redirect = this.$route.query.redirect;
    return {
      submiting: false,
      redirect,
      passwordDispalyType: "password",
      isRegist: false,
      redirectUrl: "",
      postModel: {
        account: "zndevcn",
        password: "123456",
        referer: "",
        groupId: this.groupId,
        groupAccount: this.groupAccount
      },
      getPasswordUrl:""
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
    // console.log(this.groupAccount);
    // console.log(this.groupId);
    this.getPasswordUrl=`http://about.zndev.cn/zndiscounts/#/login/${this.groupAccount}/${this.groupId}?getpassword=1`;
    //console.log(params);
    if (params.referer && params.referer.length == 32) {
      this.postModel.referer = params.referer;
      this.isRegist = true;
    } else {
      let uid = getReferer();
      if (uid && uid.length == 32) {
        this.postModel.referer = uid;
      }
    }
    if (params.redirect) {
      this.redirectUrl = params.redirect;
    }
  },
  methods: {
    changePasswordDisplay() {
      this.passwordDispalyType =
        this.passwordDispalyType == "password" ? "text" : "password";
    },
    onEnter(e) {
      if (this.submiting) return;
      //				console.log(e)
      //				console.log(e.target)
      //				this.submiting=true;
      if (e.keyCode === 13) {
        //console.log("enter")
        this.submit();
      }
    },
    wechatRegist() {
      let that = this;
      if (that.submiting) {
        return;
      }
      that.submiting = true;
      that
        .$axios({
          url: "/Api.WeChat/OAuth2/AuthorizeUrl",
          data: {
            groupId: that.groupId,
            returnUrl: `http://www.0898so.com/znhotel/oauth/${
              that.groupAccount
            }/${that.groupId}`,
            action: "regist",
            state: {
              redirectUrl: that.redirectUrl,
              referer: that.postModel.referer
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
    callback(res) {
      let that = this;
      let data = res.data; 
      setToken(data.token, that.groupAccount);
      data.info = Object.assign(data.info, { groupAccount: that.groupAccount });
      that.submiting = false;
      that.$tips.done(that.isRegist ? "注册成功" : "登录成功", function() {
        if (that.isRegist && that.postModel.referer) {
          setReferer("");
        }
        if (that.redirect) {
          that.$router.replace({
            path: that.redirect
          });
          return;
        }
        that.$router.replace({
          name: "home",
          params: {
            groupAccount: that.groupAccount
          }
        });
      });
    },
    submit() {
      let that = this;
      if (!that.postModel.account) {
        that.$tips.warn("请填写登录账号");
        return;
      }
      if (!validator.isAccount(that.postModel.account)) {
        that.$tips.alert(
          "账号由6至20位数字或字母组成(原账号不足六位的，在前边加数字6补齐六位)",
          "提示"
        );
        return;
      }
      if (!that.postModel.password) {
        that.$tips.warn("请填写登录密码");
        return;
      }
      if (!validator.isPassword(that.postModel.password)) {
        that.$tips.warn("密码只能由数字、英文符号或字母组成，6-20位", 1000 * 4);
        return;
      }
      that.submiting = true;
      //console.log(that.postModel)
      if (that.isRegist) {
        regist(that.postModel)
          .then(res => {
            that.callback(res);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        login(
          that.postModel.account,
          that.postModel.password,
          1,
          0,
          that.postModel.groupId
        )
          .then(res => {
            that.callback(res);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  mounted() {
    document.title = this.isRegist ? "会员注册" : "会员登录";
  }
};
</script>
 