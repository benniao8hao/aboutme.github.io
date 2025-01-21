<template>
	<div>
		<div class="main-container top-header-padding bottom-bar-padding">
			<div class="nav-header">
				<x-header :title="car.numCount==0?'购物车':`购物车(${car.numCount})`">
					<!--<div slot="overwrite-left" @click="back">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>-->
					<div slot="right" v-if="car.numCount>0" @click="isEditing=!isEditing">
						{{isEditing?'完成':'编辑'}}
						<span class="iconfont" :class="{'icon-xiugai':!isEditing,'icon-check':isEditing}"></span>
					</div>
				</x-header>
			</div>
			<div class="content-wrap shop-car-bd">
				<div v-if="isEditing&&car.numCount>0">
				  <x-button mini type="primary" @click.native="removeOver" v-if="car.overCount>0">清空过期</x-button>
			      <x-button mini type="warn" @click.native="cleanCar">清空</x-button>
			      <x-button mini type="warn" @click.native="removeSelected">删除</x-button>
				</div>
				<msg v-if="car.numCount==0" class="empty-tips-msg m-t-l" title="您的购物车空荡荡的" description="赶紧去挑几样吧" :buttons="msgButtons" icon="info"></msg>
				<group v-else class="store-group" v-for="(store,i) in car.storeGroups" :key="i">
				  <div slot="title">
				  	<group class="store-name">
				  		<cell primary="content">
				  			<div slot="title">
				  				<checker v-model="store.checked">
						        	<checker-item :value="store.storeId+''">
						        		<i v-if="store.checked==store.storeId" @click="onStoreCheckedChange(store.storeId,false)" class="weui-icon weui_icon_success weui-icon-success"></i>
						          		<i v-else class="weui-icon weui_icon_circle weui-icon-circle"  @click="onStoreCheckedChange(store.storeId,true)"></i>
						        	</checker-item>
						        </checker>
				  			</div>
				  			<div class="text-left">
				  				<span class="iconfont icon-dianpu"></span>
				  				{{store.storeNameAcronym}}
				  				<span class="iconfont icon-xiangyoujiantou float-right" @click="linkToStore(store.groupAccount,store.storeId)"></span>
				  			</div>
				  		</cell>
				  	</group>
				  </div>
			      	<div class="store-pro-list">
				      	<flexbox class="car-item" v-for="(p,j) in store.products" slot="after-title" :key="j">
					      <flexbox-item :span="1">
					      	<i v-if="p.deleted||p.disabled" class="weui-icon weui_icon_circle weui-icon-circle"></i>
							<checker v-else v-model="p.checked">
					        	<checker-item :value="p.tid+''">
					        		<i v-if="p.checked==p.tid" @click="onProductCheckedChange(p.tid,false,store.storeId)" class="weui-icon weui_icon_success weui-icon-success"></i>
					          		<i v-else class="weui-icon weui_icon_circle weui-icon-circle" @click="onProductCheckedChange(p.tid,true,store.storeId)"></i>
					        	</checker-item>
					        </checker>					      	
					      </flexbox-item>
					      <flexbox-item :span="3" class="pro-img">
					      	<img v-lazy="_getImgUrl(p.snapShot)" :key="p.snapShot" :alt="p.productName" @click.prevent="viewDetail(p.groupAccount,p.storeId,p.tid)"/>
					      </flexbox-item>
					      <flexbox-item>
					      	<div class="pro-name"  @click="viewDetail(p.groupAccount,p.storeId,p.tid)">{{p.productName}}</div>
					      	<div class="price-bd">
					      		<template v-if="!isEditing">
						      		<div class="price" :class="{'text-through':p.deleted||p.disabled}">
						      			¥<strong>{{p.price}}</strong>/{{p.unit}}
						      			<!--<span class="cost">原价 ￥<strong>258</strong></span>-->
						      		</div>
						      		<div class="num">
						      			<template v-if="p.deleted||p.disabled">该商品已经过期</template>
						      			<template v-else>X{{p.num}}</template>
						      		</div>
					      		</template>
					      		<template v-else>
					      			<div v-if="p.deleted||p.disabled">
				      					该商品已经过期
				      				</div>
					      			<inline-x-number v-else @on-change="onNumChange" :min="1" :max="p.repertory" v-model="p.num"></inline-x-number>
					      		</template>
					      	</div>
					      </flexbox-item>
					    </flexbox>
				    </div>
			    </group>
				<div class="bottom-bar" v-if="car.numCount>0">
					<div class="content-wrap">
					<flexbox :gutter="0">
					  <flexbox-item :span="1">
						<checker v-model="selectedAllProduct">
				        	<checker-item value="1">
				        		<i v-if="selectedAllProduct=='1'" @click="onCheckedAllProductChange(false)" class="weui-icon weui_icon_success weui-icon-success"></i>
				          		<i v-else class="weui-icon weui_icon_circle weui-icon-circle" @click="onCheckedAllProductChange(true)"></i>
				        	</checker-item>
				        </checker>					      	
				      </flexbox-item>					
				      <flexbox-item class="price-info">
		      			<div>
		      				<span v-if="selectProductCount>0" class="tips">不含运费</span>合计:<span class="iconfont icon-rmb">{{carAmtTotal}}</span>
		      			</div>
				      </flexbox-item>
				      <flexbox-item :span="3" class="btn-submit weui-btn_primary" :class="{'disabled':isEditing}">
				      	<div @click="checkOut">结算({{selectProductCount}})</div>
				      </flexbox-item>
				    </flexbox>
				    </div>
				</div>
			</div>
		</div>
		<div v-transfer-dom>
	      <popup v-model="showCheckOut" height="100%">
	        <div class="full-width full-height">
	          <check-out @onRefreshCar="getCarInfo" v-if="showCheckOut" :isShow.sync="showCheckOut" :car="checkOutCar"></check-out>
	        </div>
	      </popup>
	   </div>		
	</div>
</template>

<script>
import shoppingCar from "@/utils/shopping_car.js";
export default {
  data() {
    let that = this;
    return {
      isEditing: false,
      showCheckOut: false,
      msgButtons: [
        {
          type: "primary",
          text: "去挑几样",
          mini: true,
          onClick: function() {
            let params = that.$storeGetter.getOrg();
            if (!params) {
              that.$router.push({ name: "404" });
              return;
            }
            that.$router.push({
              name: "restaurant",
              params
            });
          }
        }
      ],
      checkOutCar: {
        //将结算的购物车商品
        orders: []
      },
      car: {
        //购物车商品
        address: "",
        tel: "",
        contacter: "",
        numCount: 3,
        overCount: 0,
        storeGroups: []
      },
      selectedAllProduct: "", //是否选中了全部商品
      selectProductCount: 0,
      carAmtTotal: 0 //选中商品合计金额
    };
  },
  components: {
    checkOut: () =>
      import(/* webpackChunkName: "shopingCar" */ "./components/checkOut.vue")
  },
  created() {
    this.getCarInfo();
  },
  methods: {
    onNumChange(val) {
      //console.log(val);
      //console.log(this.productsInCar);
      let products = [],
        that = this,
        numCount = 0,
        total = 0,
        selectedCount = 0;
      that.car.storeGroups.forEach((store, i, a) => {
        store.products.forEach((e, j, b) => {
          products.push({ id: e.tid, num: e.num });
          numCount++;
          if (e.checked) {
            total += e.price * e.num;
            selectedCount++;
          }
        });
      });
      shoppingCar.refresh(products);
      that.car.numCount = numCount;
      that.selectProductCount = selectedCount;
      that.carAmtTotal = parseFloat(total).toFixed(2);
      //console.log(that.carAmtTotal)
    },
    linkToStore(groupAccount, storeId) {
      let that = this;
      that.$router.push({
        name: "home",
        params: {
          groupAccount,
          storeId
        }
      });
    },
    hasSelected() {
      if (this.selectProductCount == 0) {
        this.$tips.warn("亲，未选中宝贝哦！");
        return false;
      }
      return true;
    },
    removeSelected() {
      let that = this;
      if (!that.hasSelected()) return;
      that.car.storeGroups.forEach((store, i, a) => {
        for (let j = 0; j < store.products.length; j++) {
          let p = store.products[j];
          if (p.checked) {
            store.products.splice(j, 1);
            j--;
          }
        }
        if (store.products.length == 0) {
          that.car.storeGroups.splice(i, 1);
          i--;
        } else {
          that.car.storeGroups.splice(i, 1, store);
        }
      });
      that.onNumChange(0);
    },
    removeOver() {
      //清空过期
      let that = this;
      that.car.storeGroups.forEach((store, i, a) => {
        store.products.forEach((p, j, b) => {
          if (p.deleted || p.disabled) {
            store.products.splice(j, 1);
            j--;
            that.car.storeGroups.splice(i, 1, store);
          }
        });
        if (store.products.length == 0) {
          that.car.storeGroups.splice(i, 1);
          i--;
        }
      });
      that.onNumChange(0);
    },
    cleanCar() {
      //清空全部
      let that = this;
      that.$tips.confirm({
        content: "亲，确认要清空购物车吗？",
        onConfirm: function() {
          shoppingCar.clean();
          that.car = {
            numCount: 0,
            storeGroups: []
          };
        }
      });
    },
    onStoreCheckedChange(storeId, isChecked) {
      //整个店铺全选|取消全选
      //console.log(isChecked)
      //console.log(storeId)
      let that = this,
        isSelectAllCar = true; //是否全选了整个购物车的
      that.car.storeGroups.forEach((store, i, a) => {
        if (store.storeId == storeId) {
          store.products.forEach((p, j, b) => {
            let checked = isChecked ? p.tid : "";
            store.products.splice(j, 1, Object.assign(p, { checked }));
          });
          that.car.storeGroups.splice(i, 1, store);
          if (isSelectAllCar && !isChecked) {
            isSelectAllCar = false;
          }
        } else {
          if (isSelectAllCar && !store.checked) {
            isSelectAllCar = false;
          }
        }
      });
      that.selectedAllProduct = isSelectAllCar ? "1" : "";
      that.onNumChange(0);
    },
    onCheckedAllProductChange(isCheckedAll) {
      //整个购物车全选|取消全选
      let that = this;
      that.selectProductCount = 0;
      that.car.storeGroups.forEach((store, i, a) => {
        store.products.forEach((p, j, b) => {
          let checked = isCheckedAll ? p.tid : "";
          store.products.splice(j, 1, Object.assign(p, { checked }));
          that.selectProductCount++;
        });
        that.car.storeGroups.splice(
          i,
          1,
          Object.assign(store, { checked: isCheckedAll ? store.storeId : "" })
        );
      });
      that.onNumChange(0);
    },
    onProductCheckedChange(productId, isChecked, storeId) {
      //单个商品选择|取消
      let that = this,
        isSelectAllStore = true, //是否全选了整个店铺的
        isSelectAllCar = true; //是否全选了整个购物车的
      that.car.storeGroups.forEach((store, i, a) => {
        if (store.storeId == storeId) {
          store.products.forEach((p, j, b) => {
            if (p.tid == productId) {
              let checked = isChecked ? p.tid : "";
              store.products.splice(j, 1, Object.assign(p, { checked }));
            }
            if (isSelectAllStore && p.checked == "") {
              isSelectAllStore = false;
            }
          });
          let newStore = Object.assign(store, {
            checked: isSelectAllStore ? storeId : ""
          });
          that.car.storeGroups.splice(i, 1, store);
          if (isSelectAllCar && !isSelectAllStore) {
            isSelectAllCar = false;
          }
        } else {
          if (isSelectAllCar && !store.checked) {
            isSelectAllCar = false;
          }
        }
      });
      that.selectedAllProduct = isSelectAllCar ? "1" : "";
      that.onNumChange(0);
    },
    getCarInfo() {
      let that = this;
      let products = shoppingCar.getProducts();
      if (products.length == 0) that.car = { numCount: 0, storeGroups: [] };
      else {
        let ids = "";
        products.forEach((e, i, a) => {
          ids += i == 0 ? e.id : "," + e.id;
        });
        shoppingCar
          .getCarInfo(ids)
          .then(res => {
            let productsInCar = res.data;
            let firstProduct = productsInCar[0];
            let list = [],
              overCount = 0,
              oneStoreGroup = {
                groupAccount: firstProduct.groupAccount,
                storeId: firstProduct.storeId,
                carriage: firstProduct.carriage,
                supportCarriage: firstProduct.supportCarriage,
                amtOfFreeCarriage: firstProduct.amtOfFreeCarriage,
                storeNameAcronym: firstProduct.storeNameAcronym,
                products: [],
                checked: ""
              };

            productsInCar.forEach((e, i, a) => {
              let num = 1;//products.find(p => p.id == e.tid).num;
              if (e.deleted || e.disabled) {
                overCount++;
              }
              num = num > e.repertory ? e.repertory : num;
              list.push(Object.assign(e, { num, checked: "" }));
              if (i == productsInCar.length - 1) {
                //最后一行
                oneStoreGroup.products = list;
                that.car.storeGroups.push(oneStoreGroup);
              } else {
                let next = productsInCar[i + 1];
                if (next.storeId != e.storeId) {
                  //另一家店铺的
                  oneStoreGroup.products = list;
                  that.car.storeGroups.push(oneStoreGroup);
                  oneStoreGroup = {
                    groupAccount: next.groupAccount,
                    storeId: next.storeId,
                    carriage: next.carriage,
                    supportCarriage: next.supportCarriage,
                    amtOfFreeCarriage: next.amtOfFreeCarriage,
                    storeNameAcronym: next.storeNameAcronym,
                    products: [],
                    checked: ""
                  };
                  list = [];
                }
              }
            });
            //console.log(that.car)
            that.car.numCount = productsInCar.length;
            that.car.overCount = overCount;
            //console.log(that.car);
          })
          .catch(err => console.log(err));
      }
    },
    viewDetail(groupAccount, storeId, id) {
      let that = this;
      that.$router.push({
        name: "restaurant_detail",
        params: {
          groupAccount,
          storeId,
          id
        }
      });
    },
    checkOut() {
      //结算
      let that = this;
      if (that.isEditing) return;
      if (!that.hasSelected()) return;
      let amtStoreTotal = 0,
        products = [],
        orders = [];
      that.car.storeGroups.forEach((store, i, a) => {
        store.products.forEach((e, j, b) => {
          if (e.checked) {
            products.push(e);
            amtStoreTotal += e.price * e.num;
          }
        });
        if (products.length > 0) {
          orders.push({
            groupAccount: store.groupAccount,
            storeId: store.storeId,
            storeNameAcronym: store.storeNameAcronym,
            products,
            totalAmt: parseFloat(amtStoreTotal).toFixed(2),
            totalNum: products.length,
            logisticsType: 0,
            orderType: products[0].sysType == 1 ? 12 : 21,
            minAmtCarriage: products[0].minAmtCarriage,
            supportCarriage: products[0].supportCarriage,
            amtOfFreeCarriage: products[0].amtOfFreeCarriage,
            carriage:
              amtStoreTotal > products[0].amtOfFreeCarriage
                ? 0
                : products[0].carriage
          });
          products = [];
          amtStoreTotal = 0;
        }
      });
      that.checkOutCar = {
        orders
      };
      //console.log(that.checkOutCar);
      that.showCheckOut = true;
    }
  },
  mounted() {
    document.title = "购物车";
  }
};
</script>
 