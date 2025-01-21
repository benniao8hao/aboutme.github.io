<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container bg-white">
			<div class="nav-header">
				<x-header title="我的权益">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap top-header-padding">
				<div class="equites" v-for="(item,i) in list" :key="i" :style="{backgroundImage: 'url(' + item.img + ')'}">
					<div class="m-group">
					    {{item.groupName}}
				          <br> 
				          <span class="m-level">
				          	<!--<i class="iconfont icon-quanyishuoming"></i>-->
				          	<strong>{{item.levelName}}</strong>消费返现<strong>{{item.rateConsume}}%</strong>推荐返现<strong>{{item.rateRecommend}}%</strong>
				          </span>
					</div>
				</div>
		    </div>
        </div>
        <copyright class="fixed-bottom"></copyright>
    </popup>
</template>

<script>
export default {
  data() {
    return {
      showPopup: this.isShow,
      list: []
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  created() {
    this.loadEquities();
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    loadEquities() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyEquitie"
        })
        .then(res => {
          //console.log(res);
          let img = 0;
          res.data.forEach((e, i, a) => {
            if (i % 2 == 0) img = 1;
            else if (i % 3 == 0) img = 2;
            else if (i % 4 == 0) img = 3;
            else if (i % 5 == 0) img = 4;
            else if (i % 6 == 0) img = 5;
            that.list.push(
              Object.assign(e, {
                img: `http://web-img.0898so.com/mp.bg.${img}.jpg`
              })
            );
          });
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
