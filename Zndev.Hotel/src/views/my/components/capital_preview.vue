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
				<group>
			      <cell-box>
			      		<div class="text-center full-width">
			      			¥	{{money}}
			      		</div>
			      </cell-box>
			      <cell-form-preview :list="list"></cell-form-preview>
			    </group>
				<div class="p-tb-l fixed-bottom full-width bg-white">
					<div class="m-lr-l">
						<slot></slot>
					</div>
				</div>			    
		    </div>
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
    isShow: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    money: {
      type: Number,
      required: true
    },
    list: {
      type: Array,
      required: true
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    }
  },
  created() {}
};
</script>
