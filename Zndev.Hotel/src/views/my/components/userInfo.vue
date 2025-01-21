<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header :title="title">
					<div slot="overwrite-left" @click="back">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
					<div slot="right" @click="submit">
						{{isModifyPassword?'修改':isEditing?'保存':'编辑'}}
						<span class="iconfont" :class="{'icon-xiugai':!isEditing,'icon-check':isEditing}"></span>
					</div>
				</x-header>
			</div>
			<div class="content-wrap">
				<group class="user-info">
				  <template v-if="!isModifyPassword">
					  <cell-box primary="content">
				      	<div class="full-width p-r-m header">
				      		<div class="float-left">头像</div>
		        			<img :src="form.headerUrl" class="header mini float-right m-r-m" />
		        		</div>
				      </cell-box>	
				      <cell title="账号" primary="content">
				      	 {{form.account}}
				      </cell>
				      <cell title="姓名" primary="content">
				      	<div v-if="!isEditing">{{form.name}}</div>
				      	<x-input v-model="form.name" :max="8" v-else placeholder="请填写姓名"></x-input>
				      </cell>
				      <!-- <cell title="性别" primary="content">
				      	<div v-if="!isEditing">{{form.sex==1?'男':'女'}}</div>
				      	<checker v-model="form.sex" class="text-left m-l-l" v-else radio-required default-item-class="checker-item-default" selected-item-class="checker-item-selected">
			      		  <checker-item :value="1">男</checker-item>
					      <checker-item :value="0">女</checker-item>
					    </checker>
				      </cell> -->
				      <cell title="手机" primary="content">
				      	<div v-if="!isEditing">{{form.mobile?form.mobile:'未绑定'}}</div>
				      	<x-input v-else v-model="form.mobile" is-type="china-mobile" placeholder="请填写手机号码"></x-input>
				      </cell>
				      <!-- <cell title="联系方式" primary="content">
				      	<div v-if="!isEditing">{{form.contact?form.contact:'未填写'}}</div>
				      	<x-input v-else v-model="form.contact" placeholder="如：微信	12345678"></x-input>
				      </cell> -->
			      </template>
			      <template v-else>
			      	<!-- <cell primary="content">
			      	 	<div class="font20px bold text-center p-tb-m">
			      	 		账号：{{form.account}}
			      	 	</div>
			      	 </cell> -->
			      	 <cell primary="content">
			      	 	<div class="font20px bold text-center p-t-m">
			      	 		登录密码
			      	 	</div>
			      	 </cell>
			      	 <cell title="登录密码" primary="content">
				      	<x-input type="password" :min="6" :max="20" v-model="newPassword" placeholder="请填写新的登录密码"></x-input>
				     </cell>
					 <cell title="确认密码" primary="content">
				      	<x-input type="password" :min="6" :max="20" v-model="confirmPassword" placeholder="请再次填写"></x-input>
				     </cell>
				     <cell primary="content">
			      	 	<div class="font20px bold text-center p-t-m">
			      	 		支付密码
			      	 	</div>
			      	 </cell>
			      	 <cell title="支付密码" primary="content">
				      	<x-input type="password" :min="6" :max="20" v-model="newSecondPassword" placeholder="请填写新的支付密码"></x-input>
				     </cell>
					 <cell title="确认密码" primary="content">
				      	<x-input type="password" :min="6" :max="20" v-model="confirmSecondPassword" placeholder="请再次填写"></x-input>
				     </cell>
				     <!--<cell primary="content">
			      	 	<div class="text-left m-tb-l">
			      	 		说明：说明：原始密码为123456.
			      	 		 <ul class="p-l-l">
			      	 			<li>1、微信注册的会员，原始的密码与账号相同。</li>
			      	 			<li>2、原始的【支付密码】为【123456】。</li>
			      	 		</ul> 
			      	 		
			      	 	</div>
			      	 </cell>-->
			      </template>
			   </group>
			   <group v-if="!isModifyPassword&&!isEditing">
			   	 <cell-box primary="content" is-link>
			      	<div class="full-width" @click="beginModifyPassword">
			      		<div class="float-left">修改密码</div>
	        		</div>
			      </cell-box>
			      <cell primary="content">
			      	 	<div class="text-left m-tb-l">
			      	 		说明：原始密码为【123456】。
			      	 		<!--<ul class="p-l-l">
			      	 			<li>微信注册的会员，原始的密码与账号相同。</li>
			      	 			 <li>2、原始的【支付密码】为【123456】。</li> 
			      	 		</ul>-->
			      	 		
			      	 	</div>
			      	 </cell>
			   </group>
		    </div>
        </div>
        <copyright class="fixed-bottom"></copyright>
	</popup>
</template>
<script>
import validator from "@/utils/validator";
export default {
  data() {
    return {
      title: "个人信息",
      isEditing: false,
      isModifyPassword: false,
      showPopup: this.isShow,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      newSecondPassword: "",
      confirmSecondPassword: "",
      form: Object.assign({}, this.info)
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    back() {
      if (this.isModifyPassword || this.isEditing) {
        this.isEditing = false;
        this.isModifyPassword = false;
        this.title = "个人信息";
        document.title = this.title;
      } else {
        this.onHide();
      }
    },
    beginModifyPassword() {
      let that = this;
      that.$tips.prompt({
        title: "此操作需要验证原登录密码",
        placeholder: "请填写登录原密码",
        inputAttrs: { type: "password" },
        onConfirm: function(msg) {
          if (msg == "") {
            that.$tips.warn("请填写原密码", 1000 * 3);
            setTimeout(function() {
              that.beginModifyPassword();
            }, 1000 * 3.1);
            return false;
          }
          if (!validator.isPassword(msg)) {
            that.$tips.warn(
              "密码只能由数字、英文符号或字母组成，6-20位",
              1000 * 4
            );
            setTimeout(function() {
              that.beginModifyPassword();
            }, 1000 * 4.1);
            return false;
          }
          that
            .$axios({
              url: "/Api.Web/ZnMember/CheckPassword",
              params: {
                password: msg,
                type: 1
              }
            })
            .then(res => {
              //console.log(res);
              if (res.data) {
                //验证原密码通过后
                that.isEditing = false;
                that.isModifyPassword = true;
                that.title = "修改密码";
                that.oldPassword = msg;
                document.title = that.title;
              } else {
                that.$tips.alert("密码错误");
              }
            })
            .catch(err => console.log(err));
        }
      });
    },
    submit() {
      let that = this;
      if (that.isModifyPassword) {
        //正在修改密码
        if (that.newPassword == "") {
          that.$tips.warn("请填写新的登录密码");
          return;
        }
        if (that.newPassword != that.confirmPassword) {
          that.$tips.warn("登录密码与确认密码不一致", 1000 * 4);
          return;
        }
        if (!validator.isPassword(that.newPassword)) {
          that.$tips.warn(
            "密码只能由数字、英文符号或字母组成，6-20位",
            1000 * 4
          );
          return;
        }
        if (that.newSecondPassword == "") {
          that.$tips.warn("请填写6位的新的支付密码");
          return;
        }
        if (that.newSecondPassword.length != 6) {
          that.$tips.warn("支付密码必须是6位的");
          return;
        }
        if (that.newSecondPassword != that.confirmSecondPassword) {
          that.$tips.warn("支付密码与确认密码不一致", 1000 * 4);
          return;
        }
        if (!validator.isPassword(that.newSecondPassword)) {
          that.$tips.warn(
            "密码只能由数字、英文符号或字母组成，6-20位",
            1000 * 4
          );
          return;
        }
        that
          .$axios({
            url: "/Api.Web/ZnMember/ModifyPassword",
            params: {
              oldPassword: that.oldPassword,
              password: that.newPassword,
              secondPassword: that.newSecondPassword
            }
          })
          .then(res => {
            if (res.data) {
              that.$tips.done("修改成功");
              that.back();
            } else {
              that.$tips.warn("服务器繁忙，请稍后重试");
            }
          })
          .catch(err => console.log(err));
        return;
      }
      if (that.isEditing) {
        //正在编辑个人信息
        //提交个人信息修改
        //console.log(that.form);
        if (that.form.name == "") {
          that.$tips.warn("请填写姓名");
          return;
        }
        if (!validator.isMobile(that.form.mobile)) {
          that.$tips.warn("请正确填写手机号码");
          return;
        }
        that
          .$axios({
            url: "/Api.Web/ZnMember/ModifyBaseInfo",
            data: that.form
          })
          .then(res => {
            if (res.data) {
              that.$tips.done("修改成功");
              that.isEditing = false;
              that.$emit("afterModifyBaseInfo", that.form);
              that.onHide();
            } else {
              that.$tips.warn("服务器繁忙，请稍后重试");
            }
          })
          .catch(err => console.log(err));
        return;
      }
      //进行个人资料编辑
      that.isEditing = true;
    }
  },
  created() {},
  mounted() {
    document.title = this.title;
  },
  destroyed() {
    document.title = "个人中心";
  }
};
</script>
<style scoped>
.checker-item-default {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  display: inline-block;
  line-height: 30px;
  border-radius: 50%;
  text-align: center;
}
.checker-item-selected {
  border-color: green;
}
</style>