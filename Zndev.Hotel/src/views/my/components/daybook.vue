<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="nav-header">
			<x-header :title="headerTitle">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="full-width" style="position: fixed;top: 46px;z-index: 1;">
			<div class="content-wrap">
				<div class="bg-white full-width" :class="{'full-height':!isShowMain}" v-if="showFilterBar">
					<flexbox :gutter="0" class="font13px border-bottom" v-if="!showCalendar&&!showSearch">
				      <flexbox-item :span="3">
						<cell 
						      title="筛选"
						      is-link
						      :border-intent="false"
						      :arrow-direction="showFilter ? 'up' : 'down'"
						      @click.native="changeShowFilters"
						      class="top-bar-filter-btn float-left"
						      :class="{'active':showFilter||filterCondition.type>0||filterCondition.orderType>0}"
						      >
				        </cell>				      	
				      </flexbox-item>
				      <flexbox-item></flexbox-item>
				      <flexbox-item :span="3" class="text-right p-r-m">
				      	<div class="float-right p-a-s" @click="changeShowSearch">
				      		<span class="iconfont icon-search mini"></span>	搜索
			      		</div>
				      </flexbox-item>
				    </flexbox>
			    	<search v-if="showSearch"
				      v-model="filterCondition.keyword"
				      position="absolute"
				      auto-scroll-to-top
				      placeholder="订单号|摘要"
				      @on-cancel="onCancelSearch"
				      @on-submit="onSearch"
				      ref="search">
			      	</search>
					<div class="slide full-height full-width" v-if="showFilter" :class="showFilter?'animate':''">
						<div class="cert-box">
							<div @click="setFilterCondition(0,0)" :class="{'selected':filterCondition.type==0&&filterCondition.orderType==0}">
								<span class="iconfont icon-viewgallery"></span>
								<b>全部</b>
							</div>
						</div>
						<div class="title">
							消费
						</div>
						<div class="cert-box">
							<div @click="setFilterCondition(1,11)" :class="{'selected':filterCondition.type==1&&filterCondition.orderType==11}">
								<span class="iconfont icon-jiudian"></span>
								<b>酒店</b>
							</div>
							<div @click="setFilterCondition(1,12)" :class="{'selected':filterCondition.type==1&&filterCondition.orderType==12}">
								<span class="iconfont icon-canyinl"></span>
								<b>餐饮</b>
							</div>
							<div @click="setFilterCondition(1,21)" :class="{'selected':filterCondition.type==1&&filterCondition.orderType==21}">
								<span class="iconfont icon-liwu"></span>
								<b>购物</b>
							</div>
							<div @click="setFilterCondition(1,31)" :class="{'selected':filterCondition.type==1&&filterCondition.orderType==31}">
								<span class="iconfont icon-fontTuan"></span>
								<b>团购</b>
							</div>
							<div @click="setFilterCondition(1,32)" :class="{'selected':filterCondition.type==1&&filterCondition.orderType==32}">
								<span class="iconfont icon-qiang"></span>
								<b>抢购</b>
							</div>
						</div>	
						<div class="title">
							更多
						</div>
						<div class="cert-box">
							<div @click="setFilterCondition(2,0)" :class="{'selected':filterCondition.type==2&&filterCondition.orderType==0}">
								<span class="iconfont icon-fanzhong"></span>
								<b>消费返现</b>
							</div>
							<div @click="setFilterCondition(3,0)" :class="{'selected':filterCondition.type==3&&filterCondition.orderType==0}">
								<span class="iconfont icon-redpacket_fill"></span>
								<b>推荐奖励</b>
							</div>
							<div @click="setFilterCondition(4,0)" :class="{'selected':filterCondition.type==4&&filterCondition.orderType==0}">
								<span class="iconfont icon-payment"></span>
								<b>申请提现</b>
							</div>
							<div @click="setFilterCondition(5,0)" :class="{'selected':filterCondition.type==5&&filterCondition.orderType==0}">
								<span class="iconfont icon-dingbu-shenqingruzhu"></span>
								<b>提现发放</b>
							</div>
							<div @click="setFilterCondition(6,0)" :class="{'selected':filterCondition.type==6&&filterCondition.orderType==0}">
								<span class="iconfont icon-tuikuan9"></span>
								<b>退款申请</b>
							</div>
							<div @click="setFilterCondition(7,0)" :class="{'selected':filterCondition.type==7&&filterCondition.orderType==0}">
								<span class="iconfont icon-dingbu-shenqingruzhu"></span>
								<b>退款发放</b>
							</div>
							<div @click="setFilterCondition(8,0)" :class="{'selected':filterCondition.type==8&&filterCondition.orderType==0}">
								<span class="iconfont icon-moneybag"></span>
								<b>余额充值</b>
							</div>
						</div>
					</div>
				</div>
				<flexbox v-if="isShowMain" :gutter="0" :class="{'bg-white':daybooks.length==0}">
					<flexbox-item class="p-l-m p-tb-s">
						<div class="bold">{{dateConditionText}}</div>
						<div v-if="daybooks.length>0&&loaded">
							<span class="m-r-m">收入
								<b>¥</b>
								<countup tag="b" :start-val="0"  :decimals="2" :end-val="amtTotalIn" :duration="1"></countup>
							</span>
							<span>支出
								<b>¥</b>
								<countup tag="b" :start-val="0"  :decimals="2" :end-val="amtTotalOut" :duration="1"></countup>
							</span>
						</div>
					</flexbox-item>
					<flexbox-item :span="2">
						<div class="float-right p-a-s" @click="changeShowCalendar">
							<span class="iconfont icon-calendar float-right m-r-m" :class="{'m-t-m':daybooks.length>0,'m-t-s':daybooks.length==0}"></span>
						</div>
					</flexbox-item>
				</flexbox>		
			</div>
		</div>
		<div class="main-container" :style="mainContainerTopStyle" :class="{'bg-white':showSearch}">
			<div class="content-wrap"> 
				<template v-if="isShowMain">
					<msg class="empty-tips-msg" v-if="daybooks.length==0" title="暂无符合条件的账单" description="要不换换筛选条件再筛一遍呗" icon="info"></msg>
					<group v-else>				
				      <cell primary="content" is-link v-for="(daybook,i) in daybooks" :key="i" class="daybook-item">
				      	<span class="iconfont" :class="getTypeDesc(daybook,'icon')" slot="icon"></span>
				      	<div class="full-width" @click="viewDaybookDetail(daybook)">
					      	<div class="full-width float-left"> 
								<div class="float-left bold text-left" :class="{
			        				'f-red':(daybook.type==4||daybook.type==6)&&daybook.status==3,
			        				'f-grren':(daybook.type==4||daybook.type==6)&&daybook.status==2
			        				}">[{{getTypeDesc(daybook,'text')}}]</div>
			        			<div class="float-right m-r-m">¥ {{daybook.amount}}</div>
			        		</div>
							<div class="full-width float-left text-left m-tb-s">{{daybook.remark}}</div>
							<div class="full-width float-left text-left">
								{{daybook.insertTime}}
							</div>
		        		</div>
				      </cell>
				    </group>
			    </template>
		    </div>
        </div>
    
	<div v-transfer-dom>
      <popup v-model="showCalendar"  :show-mask="false" class="full-height bg-white">
      	<div class="content-wrap">
	        <popup-header
	        left-text="取消"
	        right-text="完成"
	        title="选择日期"
	        :show-bottom-border="false"
	        @on-click-right="onDateFilter"
	        @on-click-left="showCalendar = false"></popup-header>
	        <div class="cert-box p-l-l m-t-l">
	  			<x-button plain mini @click.native="changeCalendarType" class="right-icon">
					按{{calendarType==1?'月':'日'}}选择
					<i class="iconfont icon-qiehuanchengshi"></i>
	  			</x-button>
	  			<div class="float-right m-r-l">
	  			<x-button plain mini @click.native="cleanDate" class="right-icon">
					清空
					<i class="iconfont icon-delete"></i>
	  			</x-button>
	  			</div>
	  		</div>
	  		<div class="cert-box m-t-l">
	  			<flexbox :gutter="0" class="font13px">
	  				<x-input placeholder="月份" v-if="calendarType==1" readonly :value="calendarValueMonth"  @click.native="changeCalendarInputBox(1)" class="active m-lr-l full-width text-center border-bottom"></x-input>
	  				<template v-else>
		  				<flexbox-item>
		  					<x-input placeholder="起始日期" readonly v-model="filterCondition.dateBegin" :class="{'active':calendarInputType==1}" @click.native="changeCalendarInputBox(1)" class="m-l-l border-bottom"></x-input>
		  				</flexbox-item>
		  				<flexbox-item :span="2" class="text-center">至</flexbox-item>
		  				<flexbox-item>
		  					<x-input placeholder="截止日期" readonly v-model="filterCondition.dateEnd" :class="{'active':calendarInputType==2}" @click.native="changeCalendarInputBox(2)" class="m-r-l border-bottom"></x-input>
		  				</flexbox-item>
	  				</template>
	  			</flexbox>
	  		</div>
	  		<datetime-view :default-selected-value="today" :start-date="minDate" :end-date="maxDate" v-model="calendarValue" ref="datetimeView" :format="calendarFormat" class="m-lr-l"></datetime-view>
      	</div>
      </popup>
    </div>
    <item-detail-preview :groups="itemDetailPreviewGroups" title="账单详情" v-if="showItemDetailPreview" :isShow.sync="showItemDetailPreview"></item-detail-preview>
	</popup>
</template>
<script>
export default {
  data() {
    let today = moment(new Date()).format("YYYY-MM-DD");
    return {
      today,
      loaded: false,
      calendarInputType: 1,
      calendarFormat: "YYYY-MM",
      calendarValue: today,
      showPopup: this.isShow,
      showFilter: false,
      showSearch: false,
      showCalendar: false,
      showItemDetailPreview: false,
      itemDetailPreviewGroups: null,
      calendarType: 1, //日历类型：1为按月，2=按日期
      filterCondition: {
        type: 0,
        orderType: 0,
        dateBegin: today,
        dateEnd: "",
        dateType: 1,
        keyword: "",
        status: -1
      },
      daybooks: [],
      amtTotalIn: 0,
      amtTotalOut: 0
    };
  },
  components: {
    itemDetailPreview: () =>
      import(/* webpackChunkName: "webBase" */ "@/components/common/item_detail_preview.vue")
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    showFilterBar: {
      type: Boolean,
      default: false
    },
    daybookType: {
      type: Number,
      default: -1
    },
    daybookStatus: {
      type: Number,
      default: -1
    },
    headerTitle: {
      type: String,
      default: "流水账单"
    }
  },
  watch: {
    calendarValue(val, oldVal) {
      //console.log(val)
      //console.log(oldVal)
      this.filterCondition.dateType = this.calendarType;
      if (val == "") {
        this.filterCondition.dateBegin = moment(new Date()).format("YYYY-MM");
        this.filterCondition.dateEnd = "";
        this.filterCondition.dateType = 1; //清空后默认按月过滤
        return;
      }
      if (this.calendarInputType == 1)
        this.filterCondition.dateBegin = moment(val).format("YYYY-MM-DD");
      else if (this.calendarInputType == 2)
        this.filterCondition.dateEnd = moment(val).format("YYYY-MM-DD");
      else if (this.calendarInputType == 3)
        this.filterCondition.dateBegin = moment(val).format("YYYY-MM") + "-01";
      //console.log(this.filterCondition)
    }
  },
  computed: {
    mainContainerTopStyle() {
      let top = 94;
      if (this.showFilterBar) {
        //显示筛选栏
        top = this.showSearch ? 89 : 135;
      }
      return {
        top: `${top}px`
      };
    },
    minDate() {
      let d = "";
      if (this.calendarInputType == 1) d = this.beginMinDate;
      else d = this.endMinDate;
      if (d.length < 10) d += moment(d).format("YYYY-MM-DD");
      return d;
    },
    maxDate() {
      if (this.calendarInputType == 1) return this.beginMaxDate;
      return this.endMaxDate;
    },
    beginMinDate: function() {
      let d = new Date();
      d.setYear(2015);
      return moment(d).format("YYYY-MM-DD");
    },
    endMinDate: function() {
      if (this.filterCondition.dateBegin == "")
        this.filterCondition.dateBegin = moment(d).format("YYYY-MM-DD");
      return this.filterCondition.dateBegin;
    },
    beginMaxDate: function() {
      if (this.filterCondition.dateEnd == "") return this.today;
      return this.filterCondition.dateEnd;
    },
    endMaxDate: function() {
      return this.today;
    },
    isShowMain() {
      return !this.showSearch && !this.showFilter && !this.showCalendar;
    },
    calendarValueMonth() {
      if (this.calendarValue == "") return "";
      return moment(this.calendarValue).format("YYYY-MM");
    },
    dateConditionText() {
      if (this.filterCondition.dateType == 1) {
        //按月
        //console.log(this.filterCondition.dateBegin)
        if (
          moment(this.filterCondition.dateBegin).format("YYYY-MM") ==
          moment(new Date()).format("YYYY-MM")
        )
          return "本月";
        return this.calendarValueMonth + "月";
      } else {
        return (
          this.filterCondition.dateBegin + "至" + this.filterCondition.dateEnd
        );
      }
    }
  },
  created() {
    if (this.daybookStatus > -1) {
      this.filterCondition.status = this.daybookStatus;
    }
    if (this.daybookType > -1) {
      this.filterCondition.type = this.daybookType;
    }
    this.loadDaybooks();
  },
  methods: {
    viewDaybookDetail(daybook) {
      let that = this;
      let cells = [];
      cells.push({
        label: "账单时间",
        content: daybook.insertTime
      });
      cells.push({
        label: "账单类型",
        content: that.getTypeDesc(daybook, "text")
      });
      cells.push({
        label: "账单金额",
        content: `¥ ${daybook.amount}`
      });

      if (
        ((daybook.type > 0 && daybook.type < 4) ||
          daybook.type == 6 ||
          daybook.type == 7) &&
        daybook.out_refund_no
      ) {
        cells.push({
          label: "订单编号",
          content: daybook.out_refund_no
        });
      }
      if (daybook.type == 1 && daybook.transaction_id) {
        cells.push({
          label: "支付单号",
          content: daybook.transaction_id
        });
      }

      //				cells.push({
      //					label:'消费店铺',
      //					content:daybook.storeId
      //				});
      cells.push({
        label: "账单摘要",
        content: daybook.remark
      });
      if (daybook.type == 4 || daybook.type == 6) {
        cells.push({
          label: "审核状态",
          content:
            daybook.status == 1
              ? "待审核"
              : daybook.status == 2
                ? "审核通过"
                : "审核未通过"
        });
        cells.push({
          label: "审核时间",
          content:
            daybook.confirmTime == "0001-01-01 00:00:00"
              ? ""
              : daybook.confirmTime
        });
        if (daybook.status == 3) {
          cells.push({
            label: "原因说明",
            content: daybook.optRemark
          });
        }
      }
      if (daybook.type == 7 && daybook.transaction_id) {
        cells.push({
          label: "退款单号",
          content: daybook.transaction_id
        });
      }
      that.itemDetailPreviewGroups = [{ cells }];
      that.showItemDetailPreview = true;
    },
    changeCalendarType() {
      this.calendarType = this.calendarType == 1 ? 2 : 1;
      if (this.calendarType == 1) {
        this.calendarInputType = 3;
        this.calendarFormat = "YYYY-MM";
      } else {
        this.calendarInputType = 1;
        this.calendarFormat = "YYYY-MM-DD";
      }
    },
    changeCalendarInputBox(type) {
      this.calendarInputType = type;
      if (this.calendarInputType == 2) {
        if (
          moment(this.filterCondition.dateBegin).format("YYYY-MM-DD") ==
          this.today
        ) {
          this.filterCondition.dateEnd = this.filterCondition.dateBegin;
        }
      }
    },
    onHide() {
      if (this.showSearch) {
        this.showSearch = false;
        return;
      }
      this.$emit("update:isShow", false);
    },
    cleanDate() {
      this.calendarType = 1;
      this.calendarFormat = "YYYY-MM";
      this.filterCondition.dateBegin = moment(new Date()).format("YYYY-MM");
      this.filterCondition.dateEnd = "";
      this.calendarValue = this.today;
      this.loadDaybooks();
    },
    onSearch() {
      this.loadDaybooks();
    },
    onCancelSearch() {
      this.filterCondition.keyword = "";
      this.loadDaybooks();
    },
    changeShowFilters() {
      this.showSearch = false;
      this.showCalendar = false;
      this.showFilter = !this.showFilter;
    },
    changeShowSearch() {
      let that = this;
      that.showFilter = false;
      that.showCalendar = false;
      that.showSearch = !that.showSearch;
      setTimeout(function() {
        that.$refs.search.setFocus();
      }, 20);
    },
    changeShowCalendar() {
      this.showSearch = false;
      this.showFilter = false;
      this.showCalendar = !this.showCalendar;
    },
    setFilterCondition(type, orderType) {
      this.filterCondition.type = type;
      this.filterCondition.orderType = orderType;
      this.loadDaybooks();
    },
    onDateFilter() {
      if (
        this.calendarType == 2 &&
        this.filterCondition.dateBegin != "" &&
        this.filterCondition.dateEnd == ""
      ) {
        this.$tips.warn("请选择截止日期");
        return;
      }
      if (
        this.calendarType == 2 &&
        this.filterCondition.dateBegin == "" &&
        this.filterCondition.dateEnd != ""
      ) {
        this.$tips.warn("请选起始日期");
        return;
      }
      if (
        this.calendarType == 2 &&
        this.filterCondition.dateBegin != "" &&
        this.filterCondition.dateEnd != ""
      ) {
        if (
          moment(this.filterCondition.dateBegin).isAfter(
            moment(this.filterCondition.dateEnd)
          )
        ) {
          this.$tips.warn("起始日期不能大于截止日期");
          return;
        }
      }
      this.loadDaybooks();
    },
    loadDaybooks() {
      //console.log("根据filterCondition条件加载数据")
      //console.log(this.filterCondition);
      let that = this;
      that.loaded = false;
      that.amtTotalIn = 0;
      that.amtTotalOut = 0;
      let dateBegin = that.filterCondition.dateBegin;

      if (dateBegin.length < 8) {
        dateBegin = `${dateBegin}-01`;
      }
      that
        .$axios({
          url: "/Api.Web/ZnMember/MyDaybook",
          params: Object.assign(that.filterCondition, { dateBegin })
        })
        .then(res => {
          //console.log(res);
          res.data.forEach((e, i, a) => {
            if (e.type == 2 || e.type == 3 || e.type == 7 || e.type == 8) {
              //消费奖励||推荐奖励||充值
              that.amtTotalIn += e.amount;
            } else if (e.type == 1 || (e.type == 5 && e.status == 2)) {
              //消费||已审核通过的提现申请
              if (e.type == 5) that.amtTotalOut += e.amount * -1;
              else that.amtTotalOut += e.amount;
            }
          });

          that.daybooks = res.data;
          that.showFilter = false;
          that.showSearch = false;
          that.showCalendar = false;
          that.loaded = true;
        })
        .catch(err => console.log(err));
    },
    getTypeDesc(daybook, type_get = "icon") {
      let orderType = daybook.orderType,
        type = daybook.type,
        status = daybook.status,
        icon = "icon-liushuizhangdan-xiugai",
        text = "未知";
      switch (type) {
        case 1: {
          switch (orderType) {
            case 11: {
              icon = "icon-jiudian";
              text = "消费-酒店";
              break;
            }
            case 12: {
              icon = "icon-canyin";
              text = "消费-餐饮";
              break;
            }
            case 21: {
              icon = "icon-liwu";
              text = "消费-购物";
              break;
            }
            case 31: {
              icon = "icon-fontTuan";
              text = "消费-团购";
              break;
            }
            case 32: {
              icon = "icon-qiang";
              text = "消费-抢购";
              break;
            }
          }
          break;
        }
        case 2: {
          icon = "icon-fanzhong";
          text = "消费返现";
          break;
        }
        case 3: {
          icon = "icon-redpacket_fill";
          text = "推荐奖励";
          break;
        }
        case 4: {
          icon = "icon-payment";
          text = "申请提现";
          break;
        }
        case 5: {
          icon = "icon-dingbu-shenqingruzhu";
          text = "提现发放";
          break;
        }
        case 6: {
          icon = "icon-tuikuan9";
          text = "订单退款";
          break;
        }
        case 7: {
          icon = "icon-dingbu-shenqingruzhu";
          text = "退款发放";
          break;
        }
        case 8: {
          icon = "icon-moneybag";
          text = "预存充值";
          break;
        }
      }
      if (type_get != "icon" && (type == 4 || type == 6)) {
        if (status == 1) {
          text += "-待审核";
        } else if (status == 2) {
          text += "-已发放";
        } else if (status == 3) {
          text += "-已取消";
        }
      }
      return type_get == "icon" ? icon : text;
    }
  }
};
</script>
