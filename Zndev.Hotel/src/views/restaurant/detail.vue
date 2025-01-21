<template>
	<div class="main-container" ref="scrollBox">
		<div class="nav-header" :class="{'transparent':scrollPosition<100}">
			<x-header :title="scrollPosition<100?'':'详情'">
				<div slot="right" @click="toShoppingCarCenter">
					<span class="iconfont icon-gouwuche7">
          	 	 </span>
					<badge v-if="productCountIncar>0" :text="productCountIncar"></badge>
				</div>
			</x-header>
		</div>
		<template  v-if="loaded" >
		<div class="content-wrap">
			<div class="item-detail">
				<div class="previewer-img-container" @click="show(0)">
					<img class="previewer-img" v-lazy="_getImgUrl(model.snapShot)" :key="model.snapShot" width="100%">
					<span class="nums">{{model.sliders.length}}张</span>
				</div>
				<div class="block">
					<section class="pro-info">
						<div class="wrap">
							<div class="field">
								<h1 class="name">{{model.productName}}</h1>
								<div class="price">
									¥<strong>{{model.price}}/{{model.unit}}</strong>
									<span>销量 {{model.salesNum}}</span>
									<span @click="addToCar" class="icon-tianmaochaoshigouwuche iconfont"></span>
								</div>
							</div>
							<!--<qrcode class="qrcode" @click="changeQRCodeShow(false)" :size="60" value="test" type="img" fg-color="#38c13a"></qrcode>-->
						</div>
						<div class="cert-box">
							<span class="iconfont icon-fanzhong" v-if="model.flagReturn">返现</span>
							<span class="iconfont icon-hot3" v-if="model.isHot">热销</span>
							<span class="iconfont icon-jingxuan" v-if="model.isBoutique">精品</span>
							<span class="iconfont icon-zan1" v-if="model.isRecommend">推荐</span>
						</div>
						<div class="intro">
							<span class="iconfont icon-tese"></span> {{model.feature}}
						</div>
					</section>
				</div>
				<div v-transfer-dom>
					<previewer :list="model.sliders" ref="previewer" :options="options"></previewer>
				</div>
			</div>
		</div>
		<div class="content-wrap item-detail-tab-wrap">
			<div v-sticky="{
					zIndex: 110,
					stickyTop:0
				}">
				<tab :line-width=1 active-color='#f39709' v-model="curIndex">
					<tab-item class="vux-center" :selected="index==0" v-for="(item, index) in tabItems" :key="index">{{item}}</tab-item>
				</tab>
			</div>
			<ul class="tab-content">
				<li v-show="curIndex===0">
					<div v-html="model.details" v-lazy-container="{selector:'img'}"></div>
				</li>
				<li v-show="curIndex===1">
					<comment-list 
						:productId="model.tid"
						> 
					</comment-list>
				</li>
			</ul>
		</div>
		<copyright></copyright>
		</template>
	</div>
</template>
<script>
import VueSticky from "vue-sticky";
import shoppingCar from "@/utils/shopping_car.js";

export default {
  directives: {
    sticky: VueSticky
  },
  components: {
    commentList: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/commentList.vue")
  },
  methods: {
    show(index) {
      this.$refs.previewer.show(index);
    },
    refreshCarProductCount() {
      let products = shoppingCar.getProducts();
      this.productCountIncar = products.length;
    },
    toShoppingCarCenter(id) {
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
    getDetail() {
      let that = this;
      that.$storeGetter
        .getStores(that.groupAccount, that.storeId, false)
        .then(defaultStore => {
          that
            .$axios({
              url: "/Api.Web/ZnProduct/Detail",
              params: {
                storeId: that.storeId,
                id: that.id
              }
            })
            .then(res => {
              let data = res.data;
              let sliders = eval(data.sliders);
              sliders.forEach((e, i, a) => {
                e.src = that._getImgUrl(e.src);
              });
              data.details = that._replaceContentImgUrl(data.details);
              //console.log(data.details);
              data.sliders = sliders;
              that.model = data;
              that.model.details = that.$options.filters.replaceImgToLazyload(
                that.model.details
              );
              that.loaded = true;
            })
            .catch(err1 => {
              console.log(err1);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addToCar() {
      shoppingCar.add(this.id);
      this.refreshCarProductCount();
      this.$tips.done("亲，在购物车等您哦");
    }
  },
  props: {
    groupAccount: {
      type: String,
      required: true
    },
    storeId: {
      required: true
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      curIndex: 0,
      tabItems: ["详情", "评价"],
      scrollPosition: 0,
      productCountIncar: 0,
      model: {},
      options: {
        getThumbBoundsFn(index) {
          index = 0;
          let thumbnail = document.querySelectorAll(".previewer-img")[index];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }
      }
    };
  },
  created() {
    this.refreshCarProductCount();
    this.getDetail();
  },
  mounted() {
    document.title = "浏览详情";
  }
};
</script>