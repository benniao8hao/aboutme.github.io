<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="我推荐的会员">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap" v-if="loaded">
				<msg class="empty-tips-msg" v-if="members.length==0" title="没找到您推荐注册的会员喔" description="赶紧去推荐好友注册，享受返现权益吧" icon="info"></msg>
				<group v-else>				
			      <cell primary="content" v-for="(member,i) in members" :key="i" class="daybook-item">
			      	<span class="iconfont icon-my1" slot="icon"></span>
			      	<div class="full-width float-left">
	        			<div class="float-left bold">{{member.name}}</div>
	        			<div class="float-right m-r-m"><!--{{member.account}}--></div>
	        		</div>
	        		<div class="full-width float-left text-left p-r-m">
	        			{{member.account}}
	        			<div>
	        				{{member.insertTime}}
	        			</div>
	        		</div>
			      </cell>
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
      loaded: false,
      members: []
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
    loadReferrals() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyReferrers"
        })
        .then(res => {
          //console.log(res);
          that.members = res.data ? res.data : [];
          that.loaded = true;
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    this.loadReferrals();
  }
};
</script>
