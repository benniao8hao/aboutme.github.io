<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header title="充值余额">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
		            <div slot="right" v-if="total>0" @click="isShowRecords=true">
		    			充值记录<span class="iconfont icon-xiangyoujiantou"></span>
		    		</div>
				</x-header>
			</div>			
			<div class="content-wrap">
				<group>
			      <cell-box>
			      		<div class="text-center full-width">
			      			余额总计：¥	{{total}}
			      		</div>
			      </cell-box>
			    </group>
				 <group v-for="(store,i) in lists" :key="i">
				      <cell-box>
				      	<div class="full-width text-left">
				      		{{store.groupName}}
				      	</div>
				      </cell-box>
				      <cell-form-preview  :list="store.list"></cell-form-preview>
				      <div class="m-a-l">
				      	<x-button @click.native="goRecharge(store.groupId,store.groupName)" :gradients="['#FF61AD','#FF2719']">去充值</x-button>
				      </div>
			    </group>	    
		    </div>
        </div>
        <recharge-list :groupName="rechargePackageGroupName" :groupId="rechargePackageGroupId" v-if="isShowPackages"  :isShow.sync="isShowPackages" ></recharge-list>
        <recharge-record v-if="isShowRecords"  :isShow.sync="isShowRecords" ></recharge-record>
	</popup>
</template>
<script>
export default {
  components: {
    rechargeList: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./recharge_list.vue"),
    rechargeRecord: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./recharge_record.vue")
  },
  data() {
    return {
      rechargePackageGroupId: 0,
      rechargePackageGroupName: "",
      isShowPackages: false,
      isShowRecords: false,
      showPopup: this.isShow,
      loaded: false,
      total: 0,
      lists: []
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    goRecharge(id, name) {
      this.rechargePackageGroupId = id;
      this.rechargePackageGroupName = name;
      this.isShowPackages = true;
    },
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyPrestore"
        })
        .then(res => {
          //console.log(res);
          res.data.forEach((e, i, a) => {
            that.lists.push({
              groupId: e.groupId,
              groupName: e.groupName,
              list: [
                { label: "累计充值", value: `¥	${e.totalPrestore}` },
                { label: "可用余额", value: `¥	${e.amtPrestore}` }
              ]
            });
            that.total += e.amtPrestore;
          });
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    onHide() {
      this.$emit("update:isShow", false);
    }
  },
  created() {
    this.loadList();
  }
};
</script>
