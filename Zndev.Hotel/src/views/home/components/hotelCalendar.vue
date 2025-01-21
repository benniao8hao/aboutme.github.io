<template>
	<div>
		<div class="date-bar" @click="isOpenCalendar=true">
			<div class="date-div"><span class="check">入住</span><span class="d">{{calendarResult.inText}}</span><span class="dd in">{{calendarResult.inDesc}}</span></div>
			<div class="days">共<b>{{calendarResult.days}}</b>晚</div>
			<div class="date-div"><span class="check">离店</span><span class="d">{{calendarResult.outText}}</span><span class="dd">{{calendarResult.outDesc}}</span></div>
		</div>
		<calendar v-if="isOpenCalendar" :min-date="minDate" :check-in-date="defaultCheckInDate" :check-out-date="defaultCheckOutDate" @onCalendarClose="onCalendarClose"></calendar>
	</div>
</template>

<script>
export default {
  data() {
    return {
      isOpenCalendar: false,
      defaultCheckInDate: "",
      defaultCheckOutDate: "",
      calendarResult: {
        in: "",
        out: "",
        days: 1,
        inText: "",
        outText: "",
        inDesc: "",
        outDesc: ""
      }
    };
  },
  props: {
    minDate: {
      type: String,
      required: true
    },
    checkInDate: {
      type: String,
      required: true
    },
    checkOutDate: {
      type: String,
      required: true
    }
  },
  components: {
    Calendar: () =>
      import(/* webpackChunkName: "hotelBooking" */ "@/components/calendar/calendar.vue")
  },
  methods: {
    onCalendarClose(result) {
      this.isOpenCalendar = false;
      this.calendarResult = result;
      this.defaultCheckInDate = result.in;
      this.defaultCheckOutDate = result.out;
      this.$emit("onCalendarCallback", result);
    },
    initCalendar() {
      let minDate = this.$props.minDate;
      this.defaultCheckInDate = this.checkInDate;
      let checkOutDate = new Date(this.checkOutDate.replace(/-/gi, "/"));
      let _month = checkOutDate.getMonth() + 1,
        _date = checkOutDate.getDate();
      _month = _month < 10 ? "0" + _month : _month;
      _date = _date < 10 ? "0" + _date : _date;
      this.defaultCheckOutDate =
        checkOutDate.getFullYear() + "-" + _month + "-" + _date;
      function isDawn() {
        //是否当天凌晨
        let d = new Date();
        let minD = new Date(
          moment(minDate)
            .format("YYYY-MM-DD")
            .replace(/-/gi, "/")
        );
        if (d.getDay() != minD.getDay()) {
          //当前日期与允许最早预订日期不相等
          let hour = d.getHours();
          return hour < 6;
        }
        return false;
      }

      function getDateDesc(dateStr) {
        let date = new Date(dateStr.replace(/-/gi, "/"));
        let array = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let str = array[date.getDay()];
        return str;
      }
      this.calendarResult.in = this.defaultCheckInDate;
      this.calendarResult.out = this.defaultCheckOutDate;
      this.calendarResult.inText = moment(this.defaultCheckInDate).format(
        "M月D日"
      );
      this.calendarResult.outText = moment(this.defaultCheckOutDate).format(
        "M月D日"
      );
      if (isDawn()) {
        this.calendarResult.inDesc = "凌晨";
        this.calendarResult.outDesc = "中午";
      } else {
        this.calendarResult.inDesc = getDateDesc(this.defaultCheckInDate);
        this.calendarResult.outDesc = getDateDesc(this.defaultCheckOutDate);
      }
      this.$emit("onCalendarCallback", this.calendarResult);
    }
  },
  created() {
    this.initCalendar();
  }
};
</script>