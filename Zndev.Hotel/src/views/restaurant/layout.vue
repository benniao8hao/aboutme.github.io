<template>
  <div class="full-height">
  	<div class="nav-header">
		  <x-header
	          :title="restaurantName" >
	          <div slot="overwrite-left" v-if="curStoreId>0">
	          	<span  class="iconfont icon-filter" @click="showFilterPopup = !showFilterPopup" v-if="!showScan">
	          	</span><badge @click="showFilterPopup = !showFilterPopup" v-if="isFilter&&!showScan"></badge>

              <span  @click="showScan = true" class="iconfont icon-iconfontscan m-l-s" v-if="isWecharBrower&&!showScan">
          	 	 </span>
	          </div>
	          <div slot="right" v-if="curStoreId>0&&!showScan" @click="showDrawer">
	          	<span class="iconfont icon-gouwuche7">
          	 	 </span><badge :text="productCountIncar" v-if="productCountIncar>0"></badge>
	          </div>
	        </x-header>
    </div>
     <drawer placement="right"
      :show.sync="drawerVisibility">
	    <div slot="drawer" v-if="shoppingIsLoadComplete">
		    	<div class="weui-cells__title">
		    		<div class="float-left">
		    		<span class="iconfont icon-gouwuche7"></span>
		    		购物车({{productCountIncar}})
		    		</div>
		    		<div class="float-right" v-if="productsInCar.length>0" @click="cleanCar">
		    			<span class="iconfont icon-delete"></span>清空
		    		</div>
		    	</div>
		    	<div class="shop-car-list scroller-bar" :style="{'max-height':maxHeight}">
		    		<msg  @click="showDrawer" class="empty-tips-msg m-t-l" v-if="productsInCar.length==0" title="您的购物车空荡荡的" description="赶紧去挑几样吧" :buttons="msgButtons" icon="info"></msg>
	       		<flexbox v-else :gutter="0" class="shop-car-item" v-for="(p,i) in productsInCar" :key="i">
	      			<flexbox-item :span="3">
	      				<img v-lazy="_getImgUrl(p.snapShot)" :key="p.snapShot" :alt="p.productName" @click="viewDetail(p.tid)"/>
	      				<span class="iconfont icon-quxiao4" @click="removeProductFromCar(p.tid,i)"></span>
	      			</flexbox-item>
	      			<flexbox-item class="info">
	      				<div class="title">
	      					{{p.productName}}
	      				</div>
	      				<cell :title="`¥${p.price}/${p.unit}`" :class="{'over-time':p.deleted||p.disabled}">
		      				<div v-if="p.deleted||p.disabled">
		      					该商品已经过期
		      				</div>
					        <inline-x-number @on-change="onNumChange" v-else :min="1" :max="p.repertory" v-model="p.num"></inline-x-number>
					      </cell>
	      			</flexbox-item>
      			</flexbox>
		    	</div>
		    	<template v-if="productsInCar.length>0">
		    	 <x-button :gradients="['#FF5E3A', '#FF9500']" class="btn-go" @click.native="toShoppingCarCenter">购物车中心 <span class="iconfont icon-right"></span> </x-button>
		    	 </template>
	    </div>
      <router-view v-if="curStoreId>0" :filters="filters" :groupAccount="groupAccount" :storeId="curStoreId" @afterAddProductToCar="refreshCarProductCount"></router-view>
		  <!-- <navbar></navbar> -->
      <popup-filter
      	@getHotKeywordList="getHotKeywordList"
      	:hotKeywords="hotKeywords"
      	:isShow.sync="showFilterPopup"
      	@onSearch="onSearch"
      	:conditionsGroups="conditionsGroups"
      	:sorts="sorts"
      	></popup-filter>
    </drawer>

    <div v-transfer-dom>
      <popup :hide-on-blur="false" v-model="showTableStateInfo" height="270px" is-transparent>
        <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
         <group>
          <cell title="餐桌编号" :value="tableInfo.no"></cell>
          <cell title="所在位置" :value="tableInfo.tableType==0?'大厅':'包厢'"></cell>
         </group>
         <div style="padding:20px 15px;">
          <x-button type="primary" @click.native="saveTableInfo">点餐</x-button>
          <x-button @click.native="showTableStateInfo = false">关闭</x-button>
         </div>
        </div>
      </popup>
    </div>
    <scan v-if="showScan" @onScanSuccess="onScanSuccess" @onScanClose="onScanClose"></scan>
  </div>
</template>

<script>
import shoppingCar from "@/utils/shopping_car.js";
export default {
  data() {
    let that = this;
    return {
      tableInfo: {},
      showScan: false,
      showTableStateInfo: false,
      shoppingIsLoadComplete: false,
      drawerVisibility: false,
      showFilterPopup: false,
      restaurantName: "", //餐厅名称
      maxHeight: "500px",
      curStoreId: this.storeId,
      msgButtons: [
        {
          type: "primary",
          text: "去挑几样",
          mini: true,
          onClick: function() {
            that.drawerVisibility = false;
          }
        }
      ],
      productCountIncar: 0, //购物车中商品件数
      productsInCar: [],
      //搜索相关 开始
      isFilter: false, //是否已经过滤-决定是否显示小圆点图标
      filters: {
        //过滤条件与排序
        keyword: "", //关键字
        conditions: [], //条件
        sort: "", //排序字段
        by: "" //升降序
      },
      hotKeywords: [], //搜索推荐关键字
      conditionsGroups: [
        //过滤条件
        {
          conditionsTitle: "选购热点",
          conditions: [
            {
              label: "返现",
              field: "FlagReturn",
              symbol: "=",
              value: 1
            },
            {
              label: "精品",
              field: "IsBoutique",
              symbol: "=",
              value: 1
            },
            {
              label: "促销",
              field: "IsPromotion",
              symbol: "=",
              value: 1
            },
            {
              label: "推荐",
              field: "IsRecommend",
              symbol: "=",
              value: 1
            },
            {
              label: "热销",
              field: "IsHot",
              symbol: "=",
              value: 1
            },
            {
              label: "新品",
              field: "IsNew",
              symbol: "=",
              value: 1
            }
          ]
        }
      ],
      sorts: [
        //排序字段
        {
          label: "时间",
          field: "InsertTime",
          value: "ASC"
        },
        {
          label: "价格",
          field: "Price",
          value: "ASC"
        },
        {
          label: "销量",
          field: "SalesNum",
          value: "ASC"
        }
        //					{
        //						label:'点击量',
        //						field:'ClickTime',
        //						value:'ASC'
        //					}
      ]
      //搜索相关 结束
    };
  },
  components: {
    popupFilter: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/popupFilterTop.vue"),
    scan: () =>
      import(/* webpackChunkName: "restaurant" */ "@/components/common/scanQRCode.vue")
  },
  props: {
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      default: 0
    }
  },
  computed: {
    isWecharBrower() {
      //return this.$storeGetter.getOrg().groupId == 1; //TODO:for test only
      return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
    }
  },
  methods: {
    onScanSuccess(url) {
      let array = url.split("=");
      let id = array[array.length - 1];
      this.checkTableState(id);
    },
    onScanClose() {
      this.showScan = false;
    },
    saveTableInfo() {
      sessionStorage.tableInfo = JSON.stringify(this.tableInfo);
      this.showTableStateInfo = false;
      this.showScan = false;
    },
    refreshCarProductCount() {
      let products = shoppingCar.getProducts();
      this.productCountIncar = products.length;
    },
    removeProductFromCar(id, idx) {
      shoppingCar.remove(id);
      this.refreshCarProductCount();
      this.productsInCar.splice(idx, 1);
    },
    onNumChange(val) {
      //console.log(val);
      //console.log(this.productsInCar);
      let products = [];
      this.productsInCar.forEach((e, i, a) => {
        products.push({ id: e.tid, num: e.num });
      });
      shoppingCar.refresh(products);
    },
    showDrawer() {
      let products = shoppingCar.getProducts();
      // console.log(products);
      if (products.length == 0) {
        this.productsInCar = [];
        this.$tips.warn("亲，购物车空荡荡的，请先挑几样吧");
        return;
      } else {
        let that = this,
          ids = "";
        that.shoppingIsLoadComplete = false;
        products.forEach((e, i, a) => {
          ids += i == 0 ? e.id : "," + e.id;
        });
        shoppingCar
          .getCarInfo(ids)
          .then(res => {
            // console.log(res);
            let _productsInCar = res.data;
            let list = [];
            _productsInCar.forEach((e, i, a) => {
              let num = 1;//products.find(p => p.id == e.tid).num;
              list.push(Object.assign(e, { num }));
            });
            that.productsInCar = list;
            that.shoppingIsLoadComplete = true;
            //that.productsInCar=res.data;
          })
          .catch(err => console.log(err));
      }
      this.drawerVisibility = !this.drawerVisibility;
    },
    cleanCar() {
      let that = this;
      that.$tips.confirm({
        content: "亲，确认要清空购物车吗？",
        onConfirm: function() {
          shoppingCar.clean();
          that.productsInCar = [];
          that.refreshCarProductCount();
          that.drawerVisibility = false;
        }
      });
    },
    getRestaurantInfo() {
      //获取餐厅信息
      let that = this;
      //获取全部店铺
      that.$storeGetter
        .getStores(that.groupAccount, that.storeId, false)
        .then(defaultStore => {
          //console.log(defaultStore);
          that.curStoreId = defaultStore.storeId;
          that.restaurantName = `${defaultStore.storeName}餐厅`;
          that.refreshCarProductCount();
        })
        .catch(err => {
          console.log(err);
        });
    },
    toShoppingCarCenter() {
      let that = this;
      that.$router.push({
        name: "shopping_cart"
        //	    		params:{
        //	    			groupAccount:that.groupAccount,
        //	    			storeId:that.storeId,
        //	    			id:id
        //	    		}
      });
    },
    onSearch(filters) {
      //console.log(filters);
      if (
        filters.conditions.length > 0 ||
        filters.keyword != "" ||
        filters.sort != ""
      ) {
        this.isFilter = true;
      } else {
        this.isFilter = false;
      }
      this.filters = filters;
    },
    getHotKeywordList(keyword) {
      let rs = [];
      //TODO:后期可从此获取热门搜索关键字
      //			  for (let i = 0; i < 20; i++) {
      //			    rs.push({
      //			      title: ` ${keyword}${i + 1} `,
      //			      other: i
      //			    })
      //			  }
      this.hotKeywords = rs;
    },
    checkTableState(tableId) {
      let that = this;
      let storeId = that.$storeGetter.getOrg().storeId;
      that
        .$axios({
          url: "/Api.Catering/DiningTable/CheckState",
          params: {
            tableId,
            storeId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (sessionStorage.tableInfo) {
              let existsSessionTableInfo = JSON.parse(sessionStorage.tableInfo);
              if (existsSessionTableInfo.tid == data.tid) return;
            }
            that.tableInfo = data;
            that.showTableStateInfo = true;
          } else if (data.status == 1) {
            that.$tips.alert("抱歉：此桌已预留给其他客人，请另行扫码");
          } else if (data.status == 2) {
            that.$tips.alert("此桌处于占用状态，请与店家确认");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    let that = this;
    that.$storeGetter
      .getStores(that.groupAccount, that.storeId, true)
      .then(defaultStore => {
        that.getRestaurantInfo();
        //console.log(document.documentElement.clientHeight);
        that.$nextTick(function() {
          that.maxHeight = document.documentElement.clientHeight - 75 + "px";
        });
        let params = that.$route.query;
        if (params.tableId) {
          that.checkTableState(params.tableId);
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  },
  mounted() {
    document.title = "餐饮预订";
  }
};
</script>
