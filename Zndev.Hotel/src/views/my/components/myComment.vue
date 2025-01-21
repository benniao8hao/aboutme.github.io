<template>
	<div>
		<popup :show-mask="false" v-if="showComment"  @on-hide="onHide" v-model="showComment" position="top" class="full-height">
			<div class="nav-header">
				<x-header title="我的评价">
				 	<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="main-container bg-white">
				<div v-sticky="{
							zIndex: 1000,
							stickyTop:46
						}">
					<tab :line-width=1 active-color='#f39709' v-model="curTabType">
            <tab-item class="with-badge"  v-for="(item, index) in tabs" :key="index" @on-item-click="filter(item.condition)" badge-background="#38C972" :badge-label="item.nums>0?item.nums:''">{{item.title}}</tab-item>
					</tab>
				</div>
				<div class="content-wrap top-header-padding p-tb-l text-left">
					<template v-if="comments.length>0||(comments.length==0&&isFilter)">
						<msg class="empty-tips-msg" v-if="comments.length==0" title="暂无对应的评价" description="欢迎您消费后给予评价和建议" icon="info"></msg>
						<template v-else>
							<div class="comment-bd">
								<div class="comment-item" v-for="(comment,index) in comments" :key="index">
									<flexbox class="product">
										<flexbox-item :span="3" class="img">
											<img :src="_getImgUrl(comment.snapShot)"/>
										</flexbox-item>
										<flexbox-item class="name">
											{{comment.productName}}
										</flexbox-item>
									</flexbox>
									<div class="p-lr-m">
										<div class="hd">
											<span class="iconfont icon-person2"></span>
											<div>
												{{comment.account}}
												<div class="time">
													{{comment.commentTime | dateFormat}}
												</div>
											</div>
										</div>
										<div class="stars">
											<img src="http://web-img.0898so.com/star-1.png" v-for="n in comment.stars" :key="`star_${n}`"/>
											<span>{{comment.stars}}分</span>
										</div>
										<div class="ct">
											{{comment.commentContent}}
											<div class="weui-uploader" v-if="comment.commentPics.length>0">
												<div class="weui-uploader__bd">
													<ul class="weui-uploader__files" >
										                <li class="weui-uploader__file" v-for="(img,idx) in comment.commentPics" :key="`img_${index}_${idx}`">
										                  <div class="weui-uploader__file-content">
								                    		<img class="previewer-img" v-lazy="img.src" :key="img.src" @click="show(img.previewerIndex)"/>
										                  </div>
										                </li>
										            </ul>
												</div>
											</div>
											<div class="reply" v-if="comment.replyContent">
												<b>掌柜回复</b>
												{{comment.replyContent}}
											</div>
										</div>
										<div class="act" v-if="comment.commentType==1">
											<x-button mini type="primary" class="float-right" @click.native="commentAgain(comment)">追加评价</x-button>
										</div>
										<div class="ct" v-if="comment.commentType==2&&comment.commentContent2">
											<div class="f-orange p-tb-m">用户{{comment.commentTime2 | diffDays(comment.commentTime)}}追加评价</div>
											{{comment.commentContent2}}
											<div class="weui-uploader" v-if="comment.commentPics2.length>0">
												<div class="weui-uploader__bd">
													<ul class="weui-uploader__files" >
										                <li class="weui-uploader__file" v-for="(img,idx) in comment.commentPics2" :key="`img2_${index}_${idx}`">
										                  <div class="weui-uploader__file-content">
								                    		<img class="previewer-img" v-lazy="img.src" :key="img.src" @click="show(img.previewerIndex)"/>
										                  </div>
										                </li>
										            </ul>
												</div>
											</div>
											<div class="reply" v-if="comment.replyContent2">
												<b>掌柜回复</b>
												{{comment.replyContent2}}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-transfer-dom>
								<previewer ref="previewer" :list="sliders.list" :options="sliders.options"></previewer>
							</div>
						</template>
					</template>
					<msg class="empty-tips-msg" v-else title="暂无对应的评价" description="欢迎您消费后给评价和建议" icon="info"></msg>
			    </div>
	        </div>
		</popup>
		<product-comment :isShow.sync="comment.show" v-if="comment.show" :storeId="comment.storeId" :products="comment.products" @onCommentSuccess="onCommentSuccess" :orderType="comment.orderType" :orderId="comment.orderId" :commentType="comment.commentType"></product-comment>
	</div>
</template>
<script>
import VueSticky from "vue-sticky";
export default {
  data() {
    return {
      comments: [],
      isFilter: false,
      curTabType: 0,
      tabs: [
        {
          title: "全部",
          condition: {
            starsType: -1,
            picType: -1,
            commentType: -1
          },
          nums: 0
        },
        {
          title: "好评",
          condition: {
            starsType: 3,
            picType: -1,
            commentType: -1
          },
          nums: 0
        },
        {
          title: "中评",
          condition: {
            starsType: 2,
            picType: -1,
            commentType: -1
          },
          nums: 0
        },
        {
          title: "差评",
          condition: {
            starsType: 1,
            picType: -1,
            commentType: -1
          },
          nums: 0
        },
        {
          title: "有图",
          condition: {
            starsType: -1,
            picType: 1,
            commentType: -1
          },
          nums: 0
        }
      ],
      params: {
        starsType: -1,
        picType: -1,
        commentType: -1
      },
      sliders: {
        list: [],
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
      },
      showComment: this.isShow,
      comment: {
        //追评的参数
        show: false,
        storeId: 0,
        orderType: 0,
        orderId: 0,
        commentType: 1,
        products: []
      }
    };
  },
  directives: {
    sticky: VueSticky
  },
  components: {
    ProductComment: () =>
      import(/* webpackChunkName: "productCommon" */ "@/components/common/znComment.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    total({ starsType, picType, commentType }) {
      let that = this;
      let tabs = that.tabs;
      if (starsType > -1 && picType > -1) {
        tabs = tabs.filter(tab => {
          return (
            tab.condition.starsType == starsType &&
            tab.condition.picType == picType
          );
        });
      }
      for (let i = 0; i < tabs.length; i++) {
        let _starsType = tabs[i].condition.starsType,
          _picType = tabs[i].condition.picType;
        let counts = that.comments.filter(item => {
          if (_starsType == 1) {
            //差评
            return item.stars <= 2;
          }
          if (_starsType == 2) {
            //中评
            return item.stars == 3;
          }
          if (_starsType == 3) {
            //好评
            return item.stars >= 4;
          }
          if (_picType == 1) {
            //有图
            return (
              (item.commentPics && item.commentPics.length > 0) ||
              (item.commentPics2 && item.commentPics2.length > 0)
            );
          }
          return item.starsType == _starsType;
        }).length;
        that.tabs.find(tab => {
          return (
            tab.condition.starsType == _starsType &&
            tab.condition.picType == _picType
          );
        }).nums = counts;
      }
      if (that.isFirstLoad || (starsType == -1 && picType == -1)) {
        that.tabs[0].nums = that.comments.length;
        that.isFirstLoad = false;
      }
    },
    onHide() {
      this.$emit("update:isShow", false);
    },
    filter({ starsType, picType, commentType }) {
      let params = {
        starsType,
        picType,
        commentType
      };
      Object.assign(this.params, params);
      if (!this.isFilter) {
        this.isFilter = true;
      }
      this.getList();
    },
    show(index) {
      this.$refs.previewer.show(index);
    },
    getList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnComment/MyComments",
          params: that.params
        })
        .then(res => {
          that.comments = [];
          that.sliders.list = [];
          let previewerImgs = [],
            previewerImgsIndex = 0;
          res.data.forEach((e, i, a) => {
            e.commentPics = e.commentPics ? eval(e.commentPics) : [];
            e.commentPics2 = e.commentPics2 ? eval(e.commentPics2) : [];
            previewerImgs = previewerImgs.concat(e.commentPics, e.commentPics2);
            previewerImgs.forEach((e1, i1, a1) => {
              e1.src = that._getImgUrl(e1.src);
            });
            that.sliders.list = previewerImgs; //幻灯片图片集合
            e.commentPics.forEach((img, i, a) => {
              //构建幻灯片索引
              Object.assign(img, { previewerIndex: previewerImgsIndex });
              previewerImgsIndex += 1;
            });
            e.commentPics2.forEach((img, i, a) => {
              //构建幻灯片索引
              Object.assign(img, { previewerIndex: previewerImgsIndex });
              previewerImgsIndex += 1;
            });
            that.comments.push(e);
          });
          that.total(that.params);
        })
        .catch(err => console.log(err));
    },
    commentAgain(comment) {
      //console.log(comment)
      let that = this;
      that.comment.orderType = comment.orderType;
      that.comment.storeId = comment.storeId;
      that.comment.orderId = comment.orderId;
      that.comment.commentType = 2;
      that.comment.products = [];
      let product = {
        name: comment.productName,
        image: that._getImgUrl(comment.snapShot)
      };
      if (comment.orderType == 12) {
        //ZnOrder订单
        Object.assign(product, {
          id: comment.productId,
          orderSubId: comment.orderSubId
        });
      }
      that.comment.products.push(product);
      //console.log(that.comment)
      that.comment.show = true;
    },
    onCommentSuccess() {
      //追评成功后回调
      this.comment.show = false;
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>
