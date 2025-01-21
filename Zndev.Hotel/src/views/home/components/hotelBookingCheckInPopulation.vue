<template>
	<div class="write-book bt-z-index100">
		<div class="booking-desc">
			<p>请选择真实入住人，以保证后续正常审核、返现。</p>
		</div>
		<div class="weui-panel__bd" v-if="!isAddNew" @click="isAddNew=true"> 
		  <div class="weui-media-box weui-media-box_small-appmsg">
		    <div class="weui-cells">
		      <a href="javascript:void(0)" class="weui-cell weui-cell_access">
		        <div class="weui-cell__hd">
		          <span class="iconfont icon-add"></span>
				</div>
		        <div class="weui-cell__bd">
		          <p>新增常用入住人</p>
		        </div>
		        <span class="weui-cell__ft"></span>
		      </a> 
		    </div>
		  </div>
		</div>
		<x-input v-if="isAddNew" :should-toast-error=false :min=2 :max=4 is-type="china-name" placeholder="请填写入住人姓名" :required="true" v-model="nameNew">
			<!--<span class="iconfont icon-check" slot="right" @click="addCheckInPopulation">新增</span>-->
			<x-button type="primary" mini  slot="right" @click.native="addCheckInPopulation">新增</x-button>
		</x-input>	
		<checklist required :max=1 label-position="left" :options="names" v-model="selectedName" @on-change="change"></checklist>
		<div class="bt">
			<div>
				<x-button type="primary" @click.native="close">确定</x-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      isAddNew: false,
      selectedName: [],
      nameNew: "",
      name: "",
      names: []
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    addCheckInPopulation() {
      let that = this;
      if (that.nameNew == "") {
        that.$tips.warn("请填写入住人姓名");
        return;
      }
      that
        .$axios({
          url: "/Api.Hotel/HTRenter/Add",
          params: {
            name: that.nameNew
          }
        })
        .then(res => {
          that.name = that.nameNew;
          that.close();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCheckInPopulations() {
      let that = this;
      that
        .$axios({
          url: "/Api.Hotel/HTRenter/CheckInPopulations"
        })
        .then(res => {
          res.data.forEach((e, i, a) => {
            that.names.push({ key: i + 1, value: e.name });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    change(value, label) {
      //console.log(label)
      this.name = label[0];
      return false;
    },
    close() {
      //console.log(this.name);
      if (this.name) {
        this.$emit("onSelectedCheckInPopulation", this.name);
      }
      this.$emit("update:isShow", false);
    }
  },
  created() {
    this.getCheckInPopulations();
  }
};
</script> 

<style type="text/less" scoped>
.write-book {
  right: 0;
  top: 0;
  bottom: 0;
  text-align: left;
  z-index: 11;
}
.booking-hotel .write-book .booking-desc {
  padding-top: 10px;
  margin-top: 0;
  font-size: 14px;
  min-height: auto;
}
.booking-hotel .write-book .bt > div {
  padding: 10px;
}
.vux-x-input {
  background-color: #fff;
  font-size: 16px;
}
</style>