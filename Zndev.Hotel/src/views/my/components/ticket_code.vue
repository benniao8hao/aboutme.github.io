<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container bg-white top-header-padding">
			<div class="nav-header">
				<x-header title="票券凭证">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap form-group p-a-l">
				 <div class="bold font20px">{{model.ticketType==1?'早餐券':model.ticketType==2?'客房券':'未知类型'}}</div>
				 <div class="font16px">
				 	{{model.storeName}}
				 </div>				 
		    </div>
		    <div class="content-wrap border-top">
		    	<div class="coupon-code">
		    		<div class="code"> 
		    			{{formatCode(model.ticketNo)}}
		    		</div>
		    		<qrcode :size="180" :value="scanUrl"></qrcode>
		    		<div class="desc">
		    			请出示此券码给核验人员
		    		</div>
		    	</div>
		    </div>
		   	<div class="content-wrap border-top p-a-l">
		   		<div>
		   			票券编号作为持票凭证，须妥善保管，请勿泄露。
		   		</div>
		   	</div>
		    <copyright class="fixed-bottom"></copyright>
        </div>
	</popup>
</template>
<script>
export default {
  data() {
    return {
      showPopup: this.isShow,
      scanUrl: ""
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    formatCode(code) {
      let charArr = code.split(""),
        str = "";
      for (let i = 0; i < charArr.length; i++) {
        if (i % 4 == 0) str += " ";
        str += charArr[i];
      }
      //console.log(str);
      return str;
    },
    onHide() {
      this.$emit("update:isShow", false);
    },
    init() {
      let that = this;
      that.scanUrl = `${process.env.BASE_API}/ZnAdmin/#/check_ticket/${
        that.model.ticketNo
      }`;
    }
  },
  created() {
    this.init();
  }
};
</script>
