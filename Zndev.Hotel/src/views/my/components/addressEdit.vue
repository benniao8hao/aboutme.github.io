<template>
	<popup v-model="showPopup" :hide-on-blur="false" :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="nav-header" v-if="isShowHeader">
			<x-header title="常用地址">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="main-container" :class="{'top-header-padding':isShowHeader,'top-header-and-tab-padding':!isShowHeader}">
			<div class="content-wrap">
				<group label-width="5em" label-margin-right="2em" label-align="justify">
			      <x-input title="联系人" :required="true" :min="2" :max="4" v-model="form.name"></x-input>
			      <x-input title="手机号" is-type="china-mobile" :required="true" v-model="form.phone"></x-input>
			      <x-address @on-hide="afterAddressHide" v-if="!editModel" v-model="addressArea" :raw-value="true" title="所在地区" :placeholder="placeholder" :list="addressData" value-text-align="left" label-align="justify"></x-address>
			      <x-textarea title="详细地址" placeholder="不需要重复以上已选的部分" :required="true" :show-counter="true" :rows="3" :max="30" v-model="form.address"></x-textarea>
			   </group>
			   <div class="fixed-bottom full-width">
			   		<div class="content-wrap p-a-m bg-white">
			   			<x-button type="primary" slot="right" @click.native="submit">保存</x-button>
			   			<x-button v-if="editModel" type="warn" slot="right" @click.native="deleteRecivers">删除</x-button>
			   		</div>
			   </div>
		    </div>
        </div>
	</popup>
</template>
<script>
import { ChinaAddressV4Data, Value2nameFilter as value2name } from "vux";
import validator from "@/utils/validator";
export default {
  data() {
    return {
      addressData: ChinaAddressV4Data,
      showPopup: this.isShow,
      placeholder: "请选择所在地区",
      addressArea: [],
      form: {
        name: "",
        address: "",
        phone: ""
      }
    };
  },
  props: {
    editModel: {
      type: Object,
      default: null
    },
    isShow: {
      type: Boolean,
      required: true
    },
    isShowHeader: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    afterAddressHide() {
      let element = document.querySelector("body>.vux-popup-mask");
      element.style.zIndex = -1;
    },
    onHide() {
      this.$emit("update:isShow", false);
    },
    getSelectedAddress() {
      let ads = value2name(this.addressArea, ChinaAddressV4Data);
      return ads.replace(/\s/g, ""); //移除空格
    },
    submit() {
      let that = this;
      let f = that.form;
      if (f.name == "") {
        that.$tips.warn("请填写联系人");
        return;
      }
      if (f.phone == "") {
        that.$tips.warn("请填写联系手机");
        return;
      }
      if (!validator.isMobile(f.phone)) {
        that.$tips.warn("请填写正确的手机号码");
        return;
      }
      if (!that.editModel && that.addressArea.length == 0) {
        that.$tips.warn("请选择地址");
        return;
      }
      if (f.address == "") {
        that.$tips.warn("请填写详细地址");
        return;
      }
      if (!that.editModel)
        //新增的时候才处理
        f.address = that.getSelectedAddress() + f.address;
      //console.log(f);
      let urlAction = that.editModel ? "ModifyRecivers" : "AddRecivers";
      that
        .$axios({
          url: "/Api.Web/ZnMember/" + urlAction,
          data: f
        })
        .then(res => {
          //console.log(res);
          if (!that.editModel) {
            //新增
            that.$emit("afterAddNew", Object.assign(f, { tid: res.data }));
            that.$tips.done("新增成功");
          } else {
            that.$emit("afterModify", f);
            that.$tips.done("修改成功");
          }
          that.onHide();
        })
        .catch(err => console.log(err));
    },
    deleteRecivers() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/DeleteRecivers",
          params: {
            tid: that.editModel.tid
          }
        })
        .then(res => {
          if (res.data) {
            that.$emit("afterDelete");
            that.$tips.done("删除成功");
            that.onHide();
          } else {
            that.$tips.warn("服务器繁忙，请稍后重试");
          }
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    if (this.editModel) this.form = this.editModel;
    document.title = "常用地址";
  }
};
</script>
