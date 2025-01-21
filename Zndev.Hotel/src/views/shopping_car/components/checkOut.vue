<template>
	<div>
		<div class="main-container top-header-padding bottom-bar-padding">
			<div class="nav-header">
				<x-header title="确认订单">
					  <div slot="overwrite-left" @click="hideCheckOunt">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回		          	
			          </div>
				</x-header>
			</div>
			<div class="content-wrap shop-car-bd">
				<group class="store-group check-out" v-if="logisticsType==1">
					 <cell primary="content">
				        <!--<span slot="icon" class="iconfont icon-location_light"></span>
				        <div class="text-left">
			  				<div>收货人：张三   <span class="float-right">13888888888</span></div>
			  				<div>收货地址：收货地址收货地址收货地址收货地址收货地址收货地址收货地址收货地址</div>			  				
			  			</div>-->
			  			
			  			<x-input title="	收货人" v-model="logisticsInfo.contacter" :max=4 :should-toast-error=false :required="true"></x-input>
						<x-input title="联系手机" v-model="logisticsInfo.tel" :max=11 :should-toast-error=false :required="true"></x-input>
						<x-textarea v-model="logisticsInfo.address" :max="80" title="收货地址" :show-counter="true" :rows="3" :cols="30" :required="true"></x-textarea>
						<div slot="child" class="font13px" @click="showAddressSelector=true">
			  				<span class="iconfont icon-location_light m-l-m"></span><br>选择
			  			</div>
				     </cell>
				</group>
				<group class="store-group" v-for="(store,i) in checkOutCar.orders" :key="i">
				  <div slot="title">
				  	<group class="store-name">
				  		<cell primary="content">
				  			<div class="text-left">
				  				<span class="iconfont icon-dianpu"></span>
				  				{{store.storeNameAcronym}}
				  			</div>
				  		</cell>
				  	</group>
				  </div>
			      	<div class="store-pro-list">
				      	<flexbox class="car-item" v-for="(p,j) in store.products" slot="after-title" :key="j">
					      <flexbox-item :span="3" class="pro-img">
					      	<img :src="_getImgUrl(p.snapShot)" :alt="p.productName"/>
					      </flexbox-item>
					      <flexbox-item>
					      	<div class="pro-name">{{p.productName}}</div>
					      	<div class="price-bd">
					      		<div class="price" :class="{'text-through':p.deleted||p.disabled}">
					      			¥<strong>{{p.price}}</strong>/{{p.unit}}
					      			<!--<span class="cost">原价 ￥<strong>258</strong></span>-->
					      		</div>
					      		<div class="num">
					      		 	X{{p.num}}
					      		</div>
					      	</div>
					      </flexbox-item>
					    </flexbox>
				    </div>
				    <group class="store-group check-out-input">
				    	<cell title="用餐方式"  primary="content" v-if="store.supportCarriage">
				    		<div style="height: 23px;" @click="changeSendType(i)">
				    			<span class="float-left m-l-l">
				    				{{store.logisticsType==0?'到场用餐':'外卖派送'}}
				    			</span>
				    			<span class="iconfont icon-xiangyoujiantou float-right"></span>
			    			</div>
				    	</cell>
				    	<cell title="用餐方式"  primary="content" v-else>
				    		<div style="height: 23px;">
				    			<span class="float-left m-t-s m-l-l">
				    				到场用餐 
				    			</span>
				    			<span class="float-right m-t-s m-r-m">
				    				(餐厅不提供派送)
				    			</span>
			    			</div>
				    	</cell>
				    </group>
            <group class="store-group check-out-input" v-if="store.logisticsType==0&&getCateringTableNo(store)">		               
                  <cell title="餐桌编号" :value="getCateringTableNo(store)"></cell>
				    </group>
				    <group class="store-group check-out-input">
		               <x-input placeholder="选填项，给店家的留言" title='买家留言' :max="80" v-model="store.buyerMessage"></x-input>
				    </group>
				    <group class="store-group check-out-input">
				    	<cell>
				    		<div class="float-left text-left m-r-l" v-if="store.logisticsType==1">
				    			<template v-if="store.amtOfFreeCarriage>0">
				    				运费：<span class="iconfont icon-rmb m-r-s">{{store.carriage}}</span>({{`满${store.amtOfFreeCarriage}包邮`}})
				    			</template>
				    			<template v-else>
				    				免费包邮
				    			</template>
				    		</div>
				    		<div class="float-right text-right">
					    		共{{store.totalNum}}件商品
					    		小计：<span class="iconfont icon-rmb">{{store.logisticsType==1?store.totalAmt+store.carriage:store.totalAmt}}</span>
				    		</div>
				    	</cell>
				    </group>
			    </group>
				<div class="bottom-bar" v-if="checkOutCar.orders.length>0">
					<div class="content-wrap">
					<flexbox :gutter="0">
				      <flexbox-item class="price-info">
		      			<div>
		      				合计金额:<span class="iconfont icon-rmb">{{amtTotalAll}}</span>
		      			</div>
				      </flexbox-item>
				      <flexbox-item :span="4" class="btn-submit weui-btn_primary">
				      	<div @click="submit">提交订单</div>
				      </flexbox-item>
				    </flexbox>
				    </div>
				</div>
			</div>
		</div>
		<actionsheet
	      v-model="actionsheet.show"
	      :menus="actionsheet.menus"
	      @on-click-menu="menusActionClick">
	      	<p slot="header" class="bold">配送方式</p>
        </actionsheet>
        <addresses-selector @onSelected="onSelectedAddress" v-if="showAddressSelector" :isShow.sync="showAddressSelector"></addresses-selector>
        <order-payment 
			@onCancelPay="onCancelPay"  
			@onValidedPassowrd="onValidedPassowrd" 
			:orderNO="newOrderNO"
			:orderType="12"
			:orderDetailUrl="orderDetailUrl"
			:amt="amtTotalAll" 
			:isShow.sync="isShowOrderPayment" 
			v-if="isShowOrderPayment">
		</order-payment>
		<order-submited-success :orderDetailUrl="orderDetailUrl" :noticeStatus="noticeStatus" :paymentState="paymentState" v-if="isSuccessed"></order-submited-success>
	</div>
</template>

<script> 
import shoppingCar from "@/utils/shopping_car.js";
import validator from "@/utils/validator";

export default {
  data() {
    let that = this;
    return {
      orderDetailUrl: "",
      paymentState: 0,
      noticeStatus: 0,
      isSuccessed: false, //是否已经预订成功
      actionsheet: {
        show: false,
        index: -1, //选择切换的索引
        menus: [
          {
            label: "到场用餐",
            value: 0
          },
          {
            label: "外卖派送",
            value: 1
          }
        ]
      },
      newOrderNO: "",
      logisticsInfo: {
        address: "",
        tel: "",
        contacter: ""
      }, //收货信息
      products_temp: [], //存储提交的商品数据，提前成功后从购物车中移除
      checkOutCar: that.car,
      showAddressSelector: false,
      isShowOrderPayment: false
    };
  },
  computed: {
    amtTotalAll: function() {
      let total = 0;
      this.checkOutCar.orders.forEach((e, i, a) => {
        total += e.totalAmt;
        if (e.logisticsType == 1) {
          //快递派送
          total += e.carriage;
        }
      });
      return parseFloat(parseFloat(total).toFixed(2));
    },
    logisticsType() {
      for (let i = 0; i < this.checkOutCar.orders.length; i++) {
        if (this.checkOutCar.orders[i].logisticsType == 1) return 1;
      }
      return 0;
    }
  },
  components: {
    addressesSelector: () =>
      import(/* webpackChunkName: "shopingCar" */ "./addresses_selector.vue"),
    OrderPayment: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/order_payment.vue"),
    OrderSubmitedSuccess: () =>
      import(/* webpackChunkName: "orderCommon" */ "@/components/common/OrderSubmitedSuccess.vue")
  },
  props: {
    car: {
      type: Object,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  created() {
    //console.log(this.checkOutCar)
  },
  methods: {
    onSelectedAddress(address) {
      this.logisticsInfo.address = address.address;
      this.logisticsInfo.tel = address.phone;
      this.logisticsInfo.contacter = address.name;
    },
    getCateringTableNo({ storeId, logisticsType }) {
      if (logisticsType == 1)
        //要求派送
        return "";
      let sessionTableInfo = sessionStorage.tableInfo;
      if (sessionTableInfo) {
        sessionTableInfo = JSON.parse(sessionTableInfo);
        if (sessionTableInfo.storeId == storeId) return sessionTableInfo.no;
      }
      return "";
    },
    initSubmitModel() {
      let that = this;
      let car = that.checkOutCar;
      let address = that.logisticsInfo.address,
        tel = that.logisticsInfo.tel,
        contacter = that.logisticsInfo.contacter;
      let orders = [];
      that.products_temp = [];
      car.orders.forEach((e, i, a) => {
        let order = {
          storeId: e.storeId,
          orderType: e.orderType,
          buyerMessage: e.buyerMessage || "",
          cateringTableNo: that.getCateringTableNo(e),
          totalAmt: e.logisticsType == 0 ? e.totalAmt : e.totalAmt + e.carriage,
          carriage: e.logisticsType == 1 ? e.carriage : 0,
          logisticsType: e.logisticsType,
          totalNum: e.products.length,
          products: []
        };
        e.products.forEach((p, j, b) => {
          order.products.push({
            tid: p.tid,
            price: p.price,
            num: p.num
          });
          that.products_temp.push(p.tid);
        });
        orders.push(order);
      });
      return {
        address,
        tel,
        contacter,
        orders
      };
    },
    changeSendType(index) {
      this.actionsheet.index = index;
      this.actionsheet.show = true;
    },
    menusActionClick(menuKey, menuItem) {
      //console.log(menuKey)
      //console.log(menuItem)
      let that = this;
      let store = that.checkOutCar.orders[this.actionsheet.index];
      if (menuKey == 1) {
        //要求派送
        if (store.totalAmt < store.minAmtCarriage) {
          that.$vux.confirm.show({
            title: `订单金额满${store.minAmtCarriage}元才能派送`,
            content: `还差${store.minAmtCarriage -
              store.totalAmt}元达到派送要求`,
            confirmText: "立马去凑单",
            cancelText: "到店吃算了",
            onCancel() {},
            onConfirm() {
              let params = that.$storeGetter.getOrg();
              that.$router.push({
                name: "restaurant",
                params
              });
            }
          });
        } else {
          store.logisticsType = menuKey;
          that.checkOutCar.orders.splice(that.actionsheet.index, 1, store);
        }
      } else {
        store.logisticsType = menuKey;
        that.checkOutCar.orders.splice(that.actionsheet.index, 1, store);
      }
    },
    hideCheckOunt() {
      this.$emit("update:isShow", false);
    },
    refreshCar() {
      let submited_products = this.products_temp;
      let products = shoppingCar.getProducts(),
        car_product_temp = [];
      //console.log(products)
      //console.log(submited_products)
      products.forEach((e, i, a) => {
        if (!submited_products.find(id => id == e.id)) {
          car_product_temp.push(e);
        }
      });
      //console.log(car_product_temp)
      //return;
      shoppingCar.refresh(car_product_temp);
      this.$emit("onRefreshCar");
    },
    submit() {
      //提交订单
      let that = this;
      let model = that.initSubmitModel();
      //console.log(model);
      //	    	console.log(that.products_temp)
      // return;
      if (that.logisticsType == 1) {
        if (model.contacter == "") {
          that.$tips.warn("请填写收货人");
          return;
        }
        if (model.tel == "") {
          that.$tips.warn("请填写联系手机");
          return;
        }
        if (!validator.isMobile(model.tel)) {
          that.$tips.warn("请填写正确的手机号码");
          return;
        }
        if (model.address == "") {
          that.$tips.warn("请填写收货地址");
          return;
        }
      }
      that
        .$axios({
          //baseURL:'http://localhost:1477',
          url: "/Api.Web/ZnOrder/Submit",
          data: model
        })
        .then(res => {
          //console.log(res);
          that.refreshCar();
          if (model.orders.length == 1) {
            //一次提交单条订单时显示支付
            let org = that.$storeGetter.getOrg();
            that.orderDetailUrl = `/my/order/repast/${org.groupAccount}/${
              res.data.orderId
            }`;
            that.newOrderNO = res.data.orderNO;
            that.noticeStatus = res.data.noticeStatus;
            that.isShowOrderPayment = true;
          } else {
            //否则跳到订单中心
            that.toMyCenter();
          }
        })
        .catch(err => console.log(err));
    },
    toMyCenter() {
      this.$router.push({
        name: "my_repast_order"
      });
    },
    onValidedPassowrd(paymentType) {
      let that = this;
      that
        .$axios({
          //baseURL:'http://localhost:1477',
          url: "/Api.Web/ZnOrder/Pay",
          params: {
            orderNO: that.newOrderNO,
            payType: paymentType
          }
        })
        .then(res => {
          //console.log(res);
          that.$tips.done("支付成功");
          that.paymentState = 1;
          that.noticeStatus = res.data;
          that.isSuccessed = true;
        })
        .catch(err => {
          that.isShowOrderPayment = true;
        });

      //this.toMyCenter();
    },
    onCancelPay() {
      this.paymentState = 0;
      this.isSuccessed = true;
    }
  }
};
</script>
 