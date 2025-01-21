<template>
	<div>
		<template v-if="comments.length>0||(comments.length==0&&isFilter)">
			<div class="border-bottom p-b-s">
				<div class="zn-tag zn-tag--circle"
					:class="{'zn-tag--orange':params.starsType==-1&&params.picType==-1&&params.commentType==-1}"
					@click="filter(-1,-1,-1)"
					>全部{{totals[0]>0?`(${totals[0]})`:''}}</div>
				<div class="zn-tag zn-tag--circle"
					:class="{'zn-tag--orange':params.starsType==3}"
					@click="filter(3,-1,-1)"
					>好评{{totals[1]>0?`(${totals[1]})`:''}}</div>
				<div class="zn-tag zn-tag--circle"
					:class="{'zn-tag--orange':params.starsType==2}"
					@click="filter(2,-1,-1)"
					>中评{{totals[2]>0?`(${totals[2]})`:''}}</div>
				<div class="zn-tag zn-tag--circle"
					:class="{'zn-tag--orange':params.starsType==1}"
					@click="filter(1,-1,-1)"
					>差评{{totals[3]>0?`(${totals[3]})`:''}}</div>
				<div class="zn-tag zn-tag--circle"
					:class="{'zn-tag--orange':params.picType==1}"
					@click="filter(-1,1,-1)"
					>有图{{totals[4]>0?`(${totals[4]})`:''}}</div>
				<!--<div class="zn-tag zn-tag--circle">追加</div>-->
			</div>
			<msg class="empty-tips-msg" v-if="comments.length==0" title="暂无对应的评价" description="欢迎您消费后给予评价和建议" icon="info"></msg>
			<template v-else>
				<div class="comment-bd">
					<div class="comment-item" v-for="(comment,index) in comments" :key="index">
						<div class="hd full-width">
							<span class="iconfont icon-person2"></span>
							<div>
								{{comment.account}}
								<div class="time">
									{{comment.commentTime | dateFormat}}
								</div>
							</div>
						</div>
						<div class="stars full-width">
							<img src="http://web-img.0898so.com/star-1.png" v-for="n in comment.stars" :key="`star_${n}`"/>
							<span>{{comment.stars}}分</span>
						</div>
						<div class="ct full-width">
							{{comment.commentContent}}
							<div class="weui-uploader" v-if="comment.commentPics.length>0">
								<div class="weui-uploader__bd">
									<ul class="weui-uploader__files" >
						                <li class="weui-uploader__file" v-for="(img,idx) in comment.commentPics" :key="`img_${index}_${idx}`">
						                  <div class="weui-uploader__file-content">
				                    		<img class="previewer-img" v-lazy="_getImgUrl(img.src)" @click="show(img.previewerIndex)" :key="img.src"/>
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
						<div class="ct full-width" v-if="comment.commentType==2&&comment.commentContent2">
							<div class="f-orange p-b-m">用户{{comment.commentTime2 | diffDays(comment.commentTime)}}追加评价</div>
							{{comment.commentContent2}}
							<div class="weui-uploader" v-if="comment.commentPics2.length>0">
								<div class="weui-uploader__bd">
									<ul class="weui-uploader__files" >
						                <li class="weui-uploader__file" v-for="(img,idx) in comment.commentPics2" :key="`img2_${index}_${idx}`">
						                  <div class="weui-uploader__file-content">
				                    		<img class="previewer-img" v-lazy="_getImgUrl(img.src)"  :key="img.src" @click="show(img.previewerIndex)"/>
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
				<div v-transfer-dom>
					<previewer ref="previewer" :list="sliders.list" :options="sliders.options"></previewer>
				</div>
			</template>
		</template>
		<msg class="empty-tips-msg" v-else title="暂无对应的评价" description="欢迎您消费后给予评价和建议" icon="info"></msg>
	</div>
</template>

<script>
export default {
  data() {
    return {
      comments: [],
      totals: [], //统计
      isFirstLoad: true,
      isFilter: false,
      params: {
        productId: this.productId,
        roomId: this.roomId,
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
      }
    };
  },
  props: {
    productId: {
      //当评价的是ZnProduct表时用到
      type: Number,
      default: -1
    },
    roomId: {
      //当评价的是酒店客房时用到
      type: Number,
      default: -1
    }
  },
  methods: {
    total() {
      let that = this;
      if (!that.isFirstLoad) return;
      that.totals.push(that.comments.length); //全部
      let counts = that.comments.filter(item => {
        //好评
        return item.stars >= 4;
      }).length;
      that.totals.push(counts);
      counts = that.comments.filter(item => {
        //中评
        return item.stars == 3;
      }).length;
      that.totals.push(counts);
      counts = that.comments.filter(item => {
        //差评
        return item.stars <= 2;
      }).length;
      that.totals.push(counts);
      counts = that.comments.filter(item => {
        //有图
        return (
          (item.commentPics && item.commentPics.length > 0) ||
          (item.commentPics2 && item.commentPics2.length > 0)
        );
      }).length;
      that.totals.push(counts);
      that.isFirstLoad = false;
    },
    filter(starsType, picType, commentType) {
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
          url: "/Api.Web/ZnComment/CommentList",
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
          that.total();
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    this.getList();
  }
};
</script>
