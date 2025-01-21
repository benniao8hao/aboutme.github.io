<template>
<div>	
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="可用奖金">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>			
			<div class="content-wrap">
				<group>
			      <cell-box>
			      		<div class="text-center full-width">
			      			可用总计：¥	{{total}}
			      		</div>
			      </cell-box>
			    </group>
				 <group v-for="(store,i) in lists" :key="i">
				      <cell-box>
				      	<div class="full-width text-left">
				      		{{store.groupName}}
				      	</div>
				      </cell-box>
				      <cell-form-preview  :list="store.list"></cell-form-preview>
				      <div class="m-a-l">
				      	<x-button v-if="store.amtBalance>0"  @click.native="applyCash(store)" :gradients="['#FF9500','#FF5E3A']">申请提现</x-button>
				      	<x-button v-else :disabled="true">无奖金可提</x-button>
				      </div>
			    </group>	    
		    </div>
        </div>
	</popup>
	<popup v-model="showPopupCash"  :show-mask="false" v-if="showPopupCash" @on-hide="onHideCash" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="申请提现">
					<div slot="overwrite-left" @click="onHideCash">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap">
				<group>
					<cell title="申请店铺" primary="content">
			      	 	{{cashModel.groupName}}
			        </cell>
			        <cell title="可提金额" primary="content">
			      	 	¥	{{cashModel.amtBalance}}
			        </cell>
			        <cell title="申请金额" primary="content">
			      	 	<x-input v-model="cashModel.money" type="number" step="0.01" placeholder="请输入本次申请提现金额"></x-input>
			        </cell> 				     
				</group>
				 <div class="m-a-m">
				 	<x-button type="primary" @click.native="submitCash">提交申请</x-button>
				 </div>
				 <div class="m-t-l">
				 	说明：提现将以红包形式发放，微信红包规定单个不得超过200元。
				 </div>
		    </div>
        </div>
	</popup>
	<input-payment-password title="申请提现" @onCancelPay="onClosePasswordBox" :money="parseFloat(cashModel.money)" @onValidedPassowrd="onValidedPassowrd" v-if="showPassowrdBox" :isShow.sync="showPassowrdBox">
	</input-payment-password>	
</div>
</template>
<script>
import validator from "@/utils/validator";
export default {
  data() {
    return {
      showPassowrdBox: false,
      showPopup: this.isShow,
      showPopupCash: false,
      loaded: false,
      total: 0,
      lists: [],
      cashModel: {
        groupId: 0,
        groupName: "",
        amtBalance: 0,
        money: 1
      }
    };
  },
  components: {
    inputPaymentPassword: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/input_payment_password.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    applyCash(model) {
      this.cashModel = Object.assign(this.cashModel, {
        groupId: model.groupId,
        groupName: model.groupName,
        amtBalance: model.amtBalance,
        money: model.amtBalance > 200 ? 200 : model.amtBalance
      });
      this.showPopupCash = true;
    },
    onValidedPassowrd() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/Cash",
          params: {
            groupId: that.cashModel.groupId,
            money: that.cashModel.money
          }
        })
        .then(res => {
          //console.log(res);
          let data = res.data;

          if (data.status == 200) {
            that.$tips.done("申请成功，请等待审核。", function() {
              that.$router.push({
                //个人中心
                name: "my",
                params: that.$storeGetter.getOrg()
              });
            });
          } else {
            that.$tips.warn(data.message, 1000 * 3, function() {
              if (data.status == 60001) {
                //去绑定微信
                that.$router.push({
                  //个人中心
                  name: "my",
                  params: that.$storeGetter.getOrg()
                });
              }
            });
          }
        })
        .catch(err => console.log(err));
    },
    onClosePasswordBox() {
      this.showPassowrdBox = false;
    },
    submitCash() {
      if (!validator.isPrice(this.cashModel.money)) {
        this.$tips.warn("请填正确填写申请提现金额");
        return;
      }
      if (this.cashModel.money <= 0) {
        this.$tips.warn("请填正确填写申请提现金额");
        return;
      }
      if (this.cashModel.money > this.cashModel.amtBalance) {
        this.$tips.warn(`申请提现金额不得大于${this.cashModel.amtBalance}`);
        return;
      }
      if (this.cashModel.money > 200) {
        this.$tips.warn(`提现将以红包形式发放,微信红包规定单个不得超过200元`);
        return;
      }
      this.showPassowrdBox = true;
    },
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyBonus"
        })
        .then(res => {
          //console.log(res);
          res.data.forEach((e, i, a) => {
            that.lists.push({
              groupId: e.groupId,
              groupName: e.groupName,
              amtBalance: e.amtBalance,
              list: [
                { label: "消费返现", value: `¥	${e.amtConsume}` },
                { label: "推荐奖励", value: `¥	${e.amtReferrer}` },
                { label: "累计奖金", value: `¥	${e.amtBonus}` },
                { label: "已提奖金", value: `¥	${e.amtCash}` },
                { label: "可用奖金", value: `¥	${e.amtBalance}` }
              ]
            });
            that.total += e.amtBalance;
          });
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    onHide() {
      this.$emit("update:isShow", false);
    },
    onHideCash() {
      this.showPopupCash = false;
    }
  },
  created() {
    this.loadList();
  }
};
</script>
