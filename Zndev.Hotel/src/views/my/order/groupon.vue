<template>
	<div>
		<loading v-model="isLoading"  text="loading"></loading>
		<div class="main-container">
			<div class="content-wrap top-header-padding">
				<div class="nav-header">
					<x-header title="团购订单">
					 	<div slot="overwrite-left" @click="onHide">
				          	<span class="iconfont icon-xiangzuojiantou"></span>返回
			            </div>
					 	<div slot="right" v-if="!showSearch" @click="showSearch=true">
					 		<badge v-if="keyword"></badge>
							<span class="iconfont icon-search mini"></span>
							查询
						</div>
					</x-header>
				</div>	
				<search v-if="showSearch"
			      v-model="keyword"
			      position="absolute"
			      auto-scroll-to-top
			      top="46px"
			      placeholder="店铺名称|姓名|手机"
			      @on-cancel="onCancelSearch"
			      @on-submit="onSearch"
			      ref="search">
		      	</search>
				<template v-else>
					<div v-sticky="{
							zIndex: 110,
							stickyTop:46
						}">
						<tab :line-width=1 active-color='#f39709' v-model="curTabType">							
              <tab-item class="with-badge"  v-for="(item, index) in tabs" :key="index" @on-item-click="tabChange" :badge-background="index>0&&index<3?'#f74c31':'#38C972'" :badge-label="item.nums>0?item.nums:''">{{item.title}}</tab-item>
						</tab>
					</div>
					<template v-if="!isLoading">
						<msg class="empty-tips-msg" v-if="isNoData" title="" description="暂无对应的订单" icon="info"></msg>
						<div class="order-list">
							<div class="order-item" v-for="(order,i) in orders" @click="showDetail(order.tid)" :key="i">
								<div class="hd">
									<div class="float-left">
										<span class="iconfont icon-dianpu"></span>{{order.storeName}}
									</div>
									<div class="float-right status">
										{{toStatusShow(order.status,order.paymentState)}}
									</div>
								</div>
								<div class="bd border-0">
									<div>
										<div class="float-left">
											{{order.productName}}
										</div>
										<div class="float-right price bold">
											¥{{order.totalAmt}}
										</div>
									</div>								
									<div class="qty">
										{{order.totalNum}}{{order.unit}}
									</div>
									<div class="time">
										有效期至：{{order.overTime}}
									</div>
								</div>
								<!--<div class="bar">
									<x-button type="warn" mini>取消</x-button>
									<x-button type="primary" mini>付款</x-button>
									详情<span class="iconfont icon-gengduo"></span>
								</div>-->
							</div>
						</div>
						<copyright v-if="!isLoading" :class="{'fixed-bottom':orders.length<4}"></copyright>
					</template>
				</template>
		    </div>
        </div>
    	<detail  @afterChangeOrder="loadData" :isShow.sync="detail.isShow" v-if="detail.isShow" :id="detail.id"></detail>    	
	</div>
</template>
<script>
import VueSticky from "vue-sticky";
export default {
  directives: {
    sticky: VueSticky
  },
  data() {
    return {
      detail: {
        isShow: false,
        id: 0
      },
      keyword: "",
      showSearch: false,
      curTabType: 0,
      isNoData: true,
      isLoading: true, //是否正在加载中
      orders: [],
      isFirstLoad: true,
      tabs: [
        {
          title: "全部",
          status: -1,
          nums: 0
        },
        {
          title: "待付款",
          status: 0,
          nums: 0
        },
        {
          title: "待组团",
          status: 1,
          nums: 0
        },
        {
          title: "待消费",
          status: 2,
          nums: 0
        },
        {
          title: "退款单",
          status: 5,
          nums: 0
        }
      ]
    };
  },
  components: {
    detail: () =>
      import(/* webpackChunkName: "myDiscountsGroupOrder" */ "./discounts_detail.vue")
  },
  methods: {
    total(selectedStatus = -1) {
      let that = this;
      let tabs = that.tabs;
      if (selectedStatus > -1) {
        tabs = tabs.filter(tab => {
          return tab.status == selectedStatus;
        });
      }
      for (let i = 0; i < tabs.length; i++) {
        let status = tabs[i].status;
        let counts = that.orders.filter(item => {
          if (status == 0) {
            //正常状态的待付款的
            return item.status < 4 && item.paymentState == 0;
          }
          if (status == 2) {
            //待消费的
            return item.status == status && item.paymentState == 1;
          }
          if (status == 5) {
            //退款单
            return item.status == status && item.paymentState > 0;
          }
          return item.status == status;
        }).length;
        that.tabs.find(tab => {
          return tab.status == status;
        }).nums = counts;
      }
      if (that.isFirstLoad || selectedStatus == -1) {
        that.tabs.find(tab => {
          return tab.status == -1;
        }).nums = that.orders.length;
        that.isFirstLoad = false;
      }
    },
    onHide() {
      if (this.showSearch) {
        this.showSearch = false;
        return;
      }
      let that = this;
      that.$router.push({
        name: "my",
        params: that.$storeGetter.getOrg()
      });
    },
    showDetail(id) {
      this.detail.id = id;
      this.detail.isShow = true;
    },
    onSearch() {
      this.loadData();
    },
    onCancelSearch() {
      this.keyword = "";
      this.showSearch = false;
      this.loadData();
    },
    toStatusShow(status, paymentState) {
      if (status == 0) return paymentState == 0 ? "待付款" : "待预约";
      if (status == 1) return "待组团";
      if (status == 2) return "待消费";
      if (status == 3) return "已消费";
      if (status == 4) return "已完成";
      if (status == 5) return "已取消";
      if (status == 6) return "已过期";
      return "未知状态";
    },
    tabChange() {
      this.loadData();
    },
    loadData() {
      let that = this;
      that.isLoading = true;
      let tab = that.tabs[that.curTabType];
      let status = tab.status;

      that
        .$axios({
          url: "/Api.Web/ZnSpecialPriceOrder/Orders",
          params: {
            isGroupon: 1,
            status,
            keyword: that.keyword
          }
        })
        .then(res => {
          //console.log(res);
          that.orders = res.data ? res.data : [];
          that.isLoading = false;
          that.showSearch = false;
          that.isNoData = !res.data;
          that.total(status);
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    document.title = "团购订单";
  },
  created() {
    this.loadData();
  }
};
</script>
