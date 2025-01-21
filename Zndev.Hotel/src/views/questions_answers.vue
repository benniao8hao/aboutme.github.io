<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="常见问题">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap">
				<msg class="empty-tips-msg" v-if="QAs.length==0" title="" description="暂无问题" icon="info"></msg>
				<group v-else class="questions">				
				 <div v-for="(qa,i) in QAs" :key="i">
				      <cell primary="content" is-link :border-intent="false" :class="{'title-expand':qa.expand}" :arrow-direction="qa.expand ? 'up' : 'down'" :title="`${i+1}、${qa.title}`" @click.native="qa.expand = !qa.expand">
				      </cell>
			      	  <div v-if="qa.expand" class="question-answer">
			      	  	<span class="iconfont icon-wenda1"></span>
			      	 	<div>{{qa.content}}</div>
			      	  </div>
		      	 </div>
			    </group>
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
      QAs: []
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    },
    loadQAs() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnFAQ/List",
          params: {
            sysType: 1
          }
        })
        .then(res => {
          let items = res.data;
          that.QAs = [];
          items.forEach((e, i, a) => {
            that.QAs.push({
              title: e.title,
              content: e.content,
              expand: false
            });
          });
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    this.loadQAs();
  }
};
</script>
