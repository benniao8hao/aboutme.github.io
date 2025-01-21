<template>
<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">	
	<div class="main-container" ref="scrollBox">
		<div class="nav-header" :class="{'transparent':scrollPosition<100}">
			<x-header :title="scrollPosition<100?'':'交易商品快照'">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="content-wrap">
			<div class="item-detail">
				<div class="previewer-img-container" @click="show(0)">
					<img class="previewer-img" :src="model.snapShot" width="100%">
					<span class="nums">{{model.sliders.length}}张</span>
				</div>
				<div class="block">
					<section class="pro-info">
						<div class="wrap">
							<div class="field">
								<h1 class="name">{{model.productName}}</h1>
								<div class="price">
									¥<strong>{{model.price}}/{{model.unit}}</strong>
								</div>
							</div>
							<!--<qrcode class="qrcode" @click="changeQRCodeShow(false)" :size="60" value="test" type="img" fg-color="#38c13a"></qrcode>-->
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
				<li v-if="curIndex===0">
					<div v-html="model.details"></div>
				</li>
			</ul>
		</div>
		<copyright></copyright>
	</div>
</popup>
</template>
<script>
import VueSticky from "vue-sticky";
export default {
  directives: {
    sticky: VueSticky
  },
  methods: {
    show(index) {
      this.$refs.previewer.show(index);
    },
    onHide() {
      let th = this;
      th.$emit("update:isShow", false);
    },
    initModel() {
      let that = this;
      if (typeof that.model.sliders == "string")
        that.model.sliders = JSON.parse(that.model.sliders);
    }
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      curIndex: 0,
      tabItems: ["详情"],
      scrollPosition: 0,
      productCountIncar: 0,
      model: this.item,
      showPopup: this.isShow,
      options: {
        getThumbBoundsFn(index) {
          index = 0;
          // find thumbnail element
          let thumbnail = document.querySelectorAll(".previewer-img")[index];

          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    };
  },
  created() {
    this.initModel();
  },
  mounted() {
    let scrollBox = this.$refs.scrollBox;
    //console.log(scrollBox)
    scrollBox.addEventListener("scroll", () => {
      this.scrollPosition = scrollBox.scrollTop;
      //console.log(this.scrollPosition)
    });
  }
};
</script>