<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header :title="title">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>			
			<div class="content-wrap">
				<group v-for="(group,i) in groups" :key="i">
					<cell v-if="cell.content!=''" :title="cell.label" v-for="(cell,j) in group.cells" :key="j" primary="content">
				       {{cell.content}}
				    </cell>
				</group>
      </div>
      <slot name="actionBtns"></slot>
      </div>
	</popup>
</template>
<script>
export default {
  data() {
    return {
      showPopup: this.isShow
    };
  },
  props: {
    title: {
      type: String,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    }
  }
};
</script>
