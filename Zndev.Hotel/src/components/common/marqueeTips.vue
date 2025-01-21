<template>
  <div class="marquee-tips">
    <span class="iconfont icon-notification1"></span>
    <marquee>
      <marquee-item v-for="(article,index) in articles" :key="index">
        <router-link :to="{path:detailRouterPath+'/'+article.tid}">{{article.title}}</router-link>
      </marquee-item>
    </marquee>
    <div class="more-tips" v-if="moreRouterPath!=undefined">
      <router-link :to="{path:moreRouterPath}">
        <span class="iconfont icon-more1"></span>
        <span>更多</span>
      </router-link>
    </div>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
export default {
  props: {
    //子项详情连接路由名称
    detailRouterPath: {
      type: String,
      required: true
    },
    articles: {
      type: Array,
      required: true
    },
    moreRouterPath: {
      type: String,
      required: true
    }
  }
};
</script>
