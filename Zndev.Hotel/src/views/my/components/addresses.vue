<template>
	<popup v-model="showPopup" :show-mask="false" @on-hide="onHide" position="top" class="full-height">
			<div class="nav-header" v-if="isShowHeader">
				<x-header title="管理常用地址">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
		<div class="main-container" :class="{'top-header-padding':isShowHeader,'top-header-and-tab-padding':!isShowHeader}">
			<div class="content-wrap" v-if="loaded">
				<div class="add-new m-b-m p-a-m">
					<div @click="showEditForm(null,-1)">
						<span class="iconfont icon-add"></span>新增常用地址
					</div>
				</div>
				<msg class="empty-tips-msg" v-if="addresses.length==0"  title="还没有常用地址" description="添加后下订单更加便捷" icon="info"></msg>
				<group v-else>
			      <cell-box primary="content" is-link v-for="(address,i) in addresses" :key="i">
			      	<div class="full-width" @click="showEditForm(address,i)">
				      	<div class="full-width float-left">
		        			<div class="float-left bold">{{address.name}}</div>
		        			<div class="float-right m-r-l">{{address.phone}}</div>
		        		</div>
		        		<div class="full-width float-left text-left p-r-m">{{address.address}}</div>
	        		</div>
			      </cell-box>
			    </group>
		    </div>
        </div>
        <address-edit :isShowHeader="isShowHeader" @afterModify="afterModify" @afterDelete="afterDelete" @afterAddNew="afterAddNew" :editModel="editModel" v-if="showEdit" :isShow.sync="showEdit"></address-edit>
    </popup>
</template>

<script>
//import addressEdit from './addressEdit.vue'
export default {
  data() {
    return {
      showEdit: false,
      editModel: null,
      editIdx: -1,
      showPopup: this.isShow,
      loaded: false,
      addresses: [],
      hasChanged: false //数据是否已经发生变动
    };
  },
  components: {
    addressEdit: () => import(/* webpackChunkName: "myAddress" */ "./addressEdit.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    isShowHeader: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.loadList();
  },
  methods: {
    loadList() {
      let that = this;
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyRecivers"
        })
        .then(res => {
          //console.log(res);
          that.addresses = res.data;
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    afterAddNew(address) {
      this.hasChanged = true;
      this.addresses.push(address);
    },
    afterModify(address) {
      this.hasChanged = true;
      this.addresses.splice(this.editIdx, 1, address);
    },
    afterDelete() {
      this.hasChanged = true;
      this.addresses.splice(this.editIdx, 1);
    },
    onHide() {
      if (this.hasChanged) {
        this.$emit("afterDataChanged");
      }
      this.$emit("update:isShow", false);
    },
    showEditForm(address, editIdx) {
      this.editModel = address;
      this.editIdx = editIdx;
      this.showEdit = true;
    }
  },
  mounted() {
    document.title = "常用地址";
  },
  destroyed() {
    document.title = "个人中心";
  }
};
</script>
