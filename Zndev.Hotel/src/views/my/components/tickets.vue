<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="nav-header">
			<x-header title="我的票券">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="main-container">
      <div class="content-wrap top-header-padding">
			<div v-sticky="{
						zIndex: 1000,
						stickyTop:46
					}">
				<tab :line-width=1 active-color='#f39709' custom-bar-width="80px" v-model="curTicketStatus">
					<tab-item class="with-badge"  v-for="(item, index) in tabs" :key="index" @on-item-click="tabChange" :badge-background="index>2?'#f74c31':'#38C972'" :badge-label="item.nums>0?item.nums:''">{{item.title}}</tab-item>
				</tab>
			</div>
				<template v-if="!isLoading">
						<msg class="empty-tips-msg" v-if="isNoData" description="暂无相应的票券" icon="info"></msg>
						<div class="order-list">
							<div class="order-item" v-for="(ticket,i) in tickets" @click="showDetail(ticket)" :key="i">
								<div class="hd">
									<div class="float-left">
										<span class="iconfont icon-menpiao3"></span>{{ticket.ticketNo}}
									</div>
									<div class="float-right status">
										{{toStatusShow(ticket.status)}}
									</div>
								</div>
								<div class="bd border-0">
									<div class="bold">
										<div class="float-left">
											{{ticket.storeName}} 
										</div>
										<div class="float-right">
											{{ticket.ticketType==1?'早餐券':ticket.ticketType==2?'客房券':'未知类型'}}
										</div>
									</div>								
									<div class="qty">
										过期时间{{ticket.overTime}}
									</div>
									<div class="time">
										赠送时间{{ticket.insertTime}}
									</div>
								</div> 
							</div>
						</div>
						<copyright v-if="!isLoading" :class="{'fixed-bottom':tickets.length<4}"></copyright>
					</template> 
      </div>
    </div>
    <item-detail-preview :groups="itemDetailPreviewGroups" title="票券详情" v-if="showItemDetailPreview" :isShow.sync="showItemDetailPreview">
      <div slot="actionBtns" class="p-a-l content-wrap" v-if="ticketModel.status==1"> 						
			  <x-button type="primary"  @click.native="isShowTicketCode = true">出示券码</x-button>						 
      </div>
    </item-detail-preview>
    <ticket-code :model="ticketModel" v-if="isShowTicketCode" :isShow.sync="isShowTicketCode">      
    </ticket-code>
	</popup>
</template>
<script>
import VueSticky from "vue-sticky";

export default {
  directives: {
    sticky: VueSticky
  },
  data() {
    return {
      curTicketStatus: 0,
      tabs: [
        {
          title: "全部",
          status: -1,
          nums: 0
        },
        {
          title: "有效券",
          status: 1,
          nums: 0
        },
        {
          title: "已核验",
          status: 2,
          nums: 0
        },
        {
          title: "已过期",
          status: 3,
          nums: 0
        },
        {
          title: "已作废",
          status: 4,
          nums: 0
        }
      ],
      showItemDetailPreview: false,
      itemDetailPreviewGroups: null,
      isLoading: false,
      tickets: [],
      isFirstLoad: true,
      isShowTicketCode: false,
      ticketModel: {},
      showPopup: this.isShow
    };
  },
  components: {
    itemDetailPreview: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/item_detail_preview.vue"),
    ticketCode: () =>
      import(/* webpackChunkName: "myBaseInfo" */ "./ticket_code.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
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
        let counts = that.tickets.filter(item => {
          return item.status == status;
        }).length;
        that.tabs.find(tab => {
          return tab.status == status;
        }).nums = counts;
      }
      if (that.isFirstLoad || selectedStatus == -1) {
        that.tabs.find(tab => {
          return tab.status == -1;
        }).nums = that.tickets.length;
        that.isFirstLoad = false;
      }
    },
    onHide() {
      this.$emit("update:isShow", false);
    },
    showDetail(ticket) {
      let that = this;
      let cells = [];
      that.ticketModel = ticket;
      cells.push({
        label: "赠送时间",
        content: ticket.insertTime
      });
      cells.push({
        label: "过期时间",
        content: ticket.overTime
      });
      cells.push({
        label: "票券类型",
        content:
          ticket.ticketType == 1
            ? "早餐券"
            : ticket.ticketType == 2
              ? "客房券"
              : "未知道类型"
      });
      cells.push({
        label: "票券编号",
        content: `${ticket.ticketNo}`
      });
      cells.push({
        label: "票券说明",
        content: `${ticket.ticketContent}`
      });
      if (ticket.orderNo) {
        let odType =
          ticket.orderType == 11
            ? "客房订单"
            : ticket.orderType == 12
              ? "餐饮订单"
              : "";
        cells.push({
          label: "相关订单",
          content: odType + ticket.orderNo
        });
      }
      that.itemDetailPreviewGroups = [{ cells }];
      that.showItemDetailPreview = true;
    },
    toStatusShow(status) {
      if (status == 0) return "待审核";
      if (status == 1) return "待核验";
      if (status == 2) return "已核验";
      if (status == 3) return "已过期";
      if (status == 4) return "已作废";
      return "未知状态";
    },
    tabChange() {
      this.loadData();
    },
    loadData() {
      let that = this;
      that.isLoading = true;
      let tab = that.tabs[that.curTicketStatus];
      let status = tab.status;

      that
        .$axios({
          url: "/Api.Web/ZnTicket/MyTickets",
          params: {
            status
          }
        })
        .then(res => {
          //console.log(res);
          that.tickets = res.data ? res.data : [];
          that.isLoading = false;
          that.isNoData = !res.data;
          that.total(status);
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    this.loadData();
  }
};
</script>
