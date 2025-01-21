<template>
<div>
	<div class="top-new-tips content-wrap" v-if="showTips">
		<marquee :interval="3000">
	      <marquee-item>
	      	本店营业时间：{{serviceInfo.workBeginTime}}-{{serviceInfo.workEndTime}}{{!serviceInfo.supportCarriage?'(本店不支持派送)':''}}
	      </marquee-item>
	      <marquee-item v-if="serviceInfo.supportCarriage">
	      	满{{serviceInfo.minAmtCarriage}}元起送，每单{{serviceInfo.carriage}}元，满{{serviceInfo.amtOfFreeCarriage}}元免费派送。
	      </marquee-item>
	      <marquee-item>
	      	服务电话<a :href="'tel:'+serviceInfo.serviceTel" class="m-l-m">{{serviceInfo.serviceTel}}</a>
	      </marquee-item>
	      <marquee-item v-if="serviceInfo.tips!=''">
	      	{{serviceInfo.tips}}
	      </marquee-item>
	    </marquee>
	    <span class="iconfont icon-remind1"></span>
	    <span @click="closeTips" class="iconfont icon-close"></span>
	</div>
	<div class="main-container bottom-bar-padding" :class="{'top-header-padding':!showTips}">		
		<msg class="empty-tips-msg" v-if="isEmpty" title="Sorry" :description="emptyTips" icon="info"></msg>
		<flexbox v-else :gutter="0" class="pro-container">
      <flexbox-item :span="3">
        <div class="pro-categories">
          <checker
          radio-required
        v-model="checkerSelected"
        default-item-class="checker-item"
        selected-item-class="checker-item-selected"
        >
          <checker-item v-for="(c,i) in categories" :key="i" :value="c.value" @on-item-click="loadProductsByCategoryId(c)">
            {{c.label}}
          </checker-item>
        </checker>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="pro-list" :class="{'hide-tips':!showTips}">
          <!--<div class="pro-category-title">{{currentCategory.label}}</div>-->
          <msg class="empty-tips-msg" v-if="isNoPruduct" title="" description="暂无该类别的菜谱" icon="info"></msg>
          <flexbox v-else :gutter="0" class="pro-item" v-for="(p,i) in products" :key="i">
            <flexbox-item :span="5">
              <img v-lazy="_getImgUrl(p.snapShot)" :key="p.snapShot" :alt="p.productName" @click.prevent="viewDetail(p.tid)"/>
            </flexbox-item>
            <flexbox-item class="info">
              <div class="title" @click="viewDetail(p.tid)">
                {{p.productName}}
                <div>¥{{p.price}}/{{p.unit}}</div>
              </div>
              <div class="sale">已售 {{p.salesNum}} 份</div>
              <span class="iconfont icon-tianmaochaoshigouwuche" @click="addToCar(p.tid)"></span>
            </flexbox-item>
          </flexbox>
          <!--<copyright></copyright>-->
        </div>
      </flexbox-item>
    </flexbox>
    <navbar></navbar>
  </div>
</div>
</template>

<script>
import shoppingCar from "@/utils/shopping_car.js";
export default {
  data() {
    return {
      showTips: false,
      storeIsClosed: false,
      isNoData: false, //是否是未上数据
      isNoPruduct: false, //是否是按类型加载无结果
      isSearchNoProduct: false, //是否是搜索无结果
      serviceInfo: {},
      categories: [],
      products: [],
      currentCategory: {},
      checkerSelected: 0
    };
  },
  computed: {
    isEmpty: function() {
      return this.storeIsClosed || this.isNoData || this.isSearchNoProduct;
    },
    emptyTips: function() {
      if (this.storeIsClosed) {
        let serviceInfo = this.serviceInfo;
        return `餐厅已经打烊啦，请于${serviceInfo.workBeginTime}-${
          serviceInfo.workEndTime
        }点餐`;
      }
      if (this.isSearchNoProduct) {
        return "没有符合筛选条件的菜谱";
      }
      if (this.isNoData) {
        return "店家未上菜谱，敬请期待";
      }
      return "";
    }
  },
  props: {
    filters: {
      type: Object,
      required: true
    },
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      required: true
    }
  },
  watch: {
    filters: {
      // 深度 watcher
      handler: function(val, oldVal) {
        //console.log(val);
        //console.log(oldVal);
        if (this.categories.length == 0) return;
        let category = { label: "搜索结果", value: -1 };
        this.loadProductsByCategoryId(category);
      },
      deep: true
    }
  },
  created() {
    //console.log(this.filters)
    //console.log(this.groupAccount)
    //console.log(this.storeId)
    this.getStoreServiceInfo();
  },
  methods: {
    closeTips() {
      this.showTips = false;
      sessionStorage.storeTips = true;
    },
    getStoreServiceInfo() {
      let that = this;
      //获取全部店铺
      that.$storeGetter
        .getStoreServiceInfo(that.storeId, 1)
        .then(res => {
          if (res.data.info == null) {
            that.$router.push({
              name: "error",
              params: { errorMsg: "店家未设置服信息" }
            });
            return;
          }
          let data = res.data;
          that.storeIsClosed = data.storeIsClose;
          that.serviceInfo = data.info;
          that.getCategories();

          if (!sessionStorage.storeTips) {
            that.showTips = true;
            setTimeout(function() {
              that.showTips = false;
            }, 1000 * 60);
          }
          //console.log(that.serviceInfo)
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCategories() {
      //获取类别
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnProductCategory/Categories",
          params: {
            sysId: 1,
            storeId: that.storeId
          }
        })
        .then(res => {
          if (res.data.data.length > 0) {
            that.categories = res.data.data;
            that.categories.splice(0, 0, {
              label: "全部菜谱",
              value: 0
            });
            that.loadProductsByCategoryId(that.categories[0]);
            that.isNoData = false;
          } else that.isNoData = true;
        })
        .catch(err => console.log(err));
    },
    loadProductsByCategoryId(category) {
      let that = this;
      //that.checkerSelected=category.value;
      that.currentCategory = category;
      let conditions = that.filters.conditions.concat([]);
      if (that.filters.keyword != "") {
        conditions.push({
          field: "ProductName",
          symbol: "like",
          value: that.filters.keyword
        });
      }
      let orderBy =
        that.filters.sort == ""
          ? "Tid Desc"
          : that.filters.sort + " " + that.filters.by;
      that
        .$axios({
          url: "/Api.Web/ZnProduct/ProductsByCategoryId",
          data: {
            categoryId: category.value,
            storeId: that.storeId,
            conditions,
            orderBy
          }
        })
        .then(res => {
          that.products = res.data;
          if (res.data.length == 0 && conditions.length > 0) {
            that.isSearchNoProduct = true;
          } else {
            that.isSearchNoProduct = false;
            that.isNoPruduct = res.data.length == 0;
          }
          if (conditions.length == 0 && category.value == -1) {
            //重置过滤条件的操作
            that.checkerSelected = 0;
            that.currentCategory = that.categories[0];
          }
        })
        .catch(err => console.log(err));
    },
    viewDetail(id) {
      let that = this;
      that.$router.push({
        name: "restaurant_detail",
        params: {
          groupAccount: that.groupAccount,
          storeId: that.storeId,
          id: id
        }
      });
    },
    addToCar(id) {
      shoppingCar.add(id);
      this.$emit("afterAddProductToCar");
      this.$tips.done("亲，在购物车等您哦");
    }
  }
};
</script>

