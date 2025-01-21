<template>
	<div class="calendar">
		<div class="headerWrapper">
			<div class="headerTip">请选择入住离店日期</div>
			<div class="comfire" @click="confirm">确定</div>
		</div>
		<table class="dateZone">
			<tbody>
				<tr>
					<td class="colo">日</td>
					<td>一</td>
					<td>二</td>
					<td>三</td>
					<td>四</td>
					<td>五</td>
					<td class="colo">六</td>
				</tr>
			</tbody>
		</table>
		<div class="tbody">
			<template v-for="month in showDays">
				<p class="ny1">{{month.text}}</p>
				<table class="dateTable">
					<tbody>
						<tr v-for="(tr,idx) in month.trs" :key="idx">
							<td v-for="(td,index) in tr" :class="getCls(month.year,month.month,td)" :key="index" @click="select(month.year,month.month,td,$event)" v-html="formatShow(month.year,month.month,td)">
							</td>
						</tr>
					</tbody>
				</table>
			</template>
		</div>
	</div>
</template>

<script>
import "./calendar.less";
const jjr = {
  //节日
  "11": "元旦",
  "214": "情人节",
  "38": "妇女节",
  "312": "植树节",
  "41": "愚人节",
  "51": "劳动节",
  "54": "青年节",
  "61": "儿童节",
  "81": "建军节",
  "910": "教师节",
  "101": "国庆节",
  "1224": "平安夜",
  "1225": "圣诞节"
};
export default {
  data() {
    return {
      settings: {
        showMonths: 4, //显示4个月
        controlDay: 90
      },
      showDays: [],
      selectedCheckInDay: "",
      selectedCheckOutDay: ""
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
  methods: {
    confirm() {
      if (this.selectedCheckInDay == "") {
        this.$vux.toast.show({
          text: "请选择入住日期",
          type: "text",
          width: "13rem"
        });
        return;
      }
      if (this.selectedCheckOutDay == "") {
        this.$vux.toast.show({
          text: "请选择离店日期",
          type: "text",
          width: "13rem"
        });
        return;
      }
      let isDawn = this.isDawn();
      let days = this.checkInDays();
      let inDesc = "",
        outDesc = "";
      if (isDawn) {
        inDesc = "凌晨";
        outDesc = "中午";
        if (days > 1) {
          outDesc = this.getSelectedDateDesc(this.selectedCheckOutDay);
        }
      } else {
        inDesc = this.getSelectedDateDesc(this.selectedCheckInDay);
        outDesc = this.getSelectedDateDesc(this.selectedCheckOutDay);
      }
      let result = {
        in: this.selectedCheckInDay,
        out: this.selectedCheckOutDay,
        days,
        inText: moment(this.selectedCheckInDay).format("M月D日"),
        outText: moment(this.selectedCheckOutDay).format("M月D日"),
        inDesc,
        outDesc
      };
      this.$emit("onCalendarClose", result);
    },
    getSelectedDateDesc(dateStr) {
      let date = new Date(dateStr.replace(/-/gi, "/"));
      let array = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let str = array[date.getDay()];
      return str;
    },
    select(year, month, day, event) {
      let cls = event.target.className;
      if (cls == "disabled" || day == "") {
        return;
      }
      let selectedTds = document.getElementsByClassName("zj");
      while (selectedTds.length > 0) {
        selectedTds[0].className = "";
      }
      //				let dayStr = year + "-" + month + "-" + day;
      let dayStr =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      if (this.selectedCheckInDay != "" && this.selectedCheckOutDay != "") {
        //重新选择了
        this.selectedCheckInDay = "";
        this.selectedCheckOutDay = "";
      }
      if (this.selectedCheckInDay == "") {
        this.selectedCheckInDay = dayStr;
      } else {
        if (dayStr == this.selectedCheckInDay) {
          return;
        }
        if (this.compareDate(dayStr, this.selectedCheckInDay)) {
          //第二次选择时，所选的日期大于第一次所选的
          this.selectedCheckOutDay = dayStr;
        } else {
          this.selectedCheckOutDay = this.selectedCheckInDay;
          this.selectedCheckInDay = dayStr;
        }
      }
    },
    formatShow(year, month, day) {
      //格式化显示
      if (day == 0) {
        return "";
      }
      let dayStr =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      if (dayStr == this.selectedCheckInDay) {
        let str = day + "<p>入住</p>";
        if (dayStr == this.selectedCheckOutDay) {
          let daysCount = this.checkInDays();
          str += `<p>离店</p><span class="hover">${daysCount}晚</span>`;
        }
        return str;
      }
      if (dayStr == this.selectedCheckOutDay) {
        let daysCount = this.checkInDays();
        return `${day}<p>离店</p><span class="hover">${daysCount}晚</span>`;
      }
      let jjrStr = jjr[month + "" + day];

      if (typeof jjrStr != "undefined") {
        return `${day}<p>${jjrStr}</p>`;
      }
      return day;
    },
    checkInDays() {
      //计算入住天数
      let d1 = new Date(this.selectedCheckInDay.replace(/-/gi, "/"));
      let d2 = new Date(this.selectedCheckOutDay.replace(/-/gi, "/"));
      var dateSpan, iDays;
      dateSpan = d2 - d1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays;
    },
    compareDate(d1, d2) {
      if (typeof d1 == "string") d1 = new Date(d1.replace(/-/gi, "/"));
      if (typeof d2 == "string") d2 = new Date(d2.replace(/-/gi, "/"));
      return d1 > d2;
    },
    isDawn() {
      //是否当天凌晨
      let checkInDay = new Date(this.selectedCheckInDay.replace(/-/gi, "/"));
      if (this.beginDate < checkInDay)
        //不是当天
        return false;
      let d = new Date();
      let hour = d.getHours();
      return hour < 6;
    },
    isLeapYear(year) {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    },
    getCls(year, month, day) {
      if (day == "") return "";
      let dayStr =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      if (this.compareDate(this.beginDate, dayStr)) {
        return "disabled"; //不可选择的样式
      }
      let endDate = new Date(this.beginDate);
      endDate.setDate(endDate.getDate() + this.settings.controlDay);
      if (this.compareDate(dayStr, endDate)) {
        return "disabled"; //不可选择的样式
      }
      if (this.selectedCheckInDay != "" || this.selectedCheckOutDay != "") {
        if (
          dayStr == this.selectedCheckInDay ||
          dayStr == this.selectedCheckOutDay
        )
          return "selected"; //入住或离店日期样式
        if (this.selectedCheckInDay != "" && this.selectedCheckOutDay != "") {
          if (
            this.compareDate(dayStr, this.selectedCheckInDay) &&
            this.compareDate(this.selectedCheckOutDay, dayStr)
          ) {
            return "zj";
          }
        }
      }
      let date = new Date(dayStr.replace(/-/gi, "/"));
      if (date.getDay() == 0 || date.getDay() == 6) return "jjr"; //节假日(周六或周日)样式
      let jjrStr = jjr[month + "" + day];
      if (typeof jjrStr != "undefined") {
        return "jjr"; //节日
      }
      return "";
    },
    initDays() {
      let ts = this;
      let currentDate = ts.beginDate;
      for (let m = 0; m < ts.settings.showMonths; m++) {
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        var setcurrentDate = new Date(currentYear, currentMonth, 1);
        var wkDay = setcurrentDate.getDay(); //该月开始的第一天是星期几
        var yf = currentMonth + 1;
        var oneMonth = {
          text: "",
          year: "",
          month: 0,
          trs: []
        };
        if (yf < 10) {
          oneMonth.text = currentYear + "年" + "0" + yf + "月";
        } else {
          oneMonth.text = currentYear + "年" + yf + "月";
        }
        oneMonth.year = currentYear;
        oneMonth.month = yf;
        var daysInMonth = [];
        if (ts.isLeapYear(currentYear)) {
          daysInMonth = new Array(
            31,
            29,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
          );
        } else {
          daysInMonth = new Array(
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
          );
        }
        var Ntd = wkDay + daysInMonth[currentMonth];
        var Ntr = Math.ceil(Ntd / 7);
        oneMonth.trs = new Array(Ntr);
        var daysCount = daysInMonth[currentMonth];
        var trIndex = 0;
        oneMonth.trs[trIndex] = [];
        for (let emptyDays = 0; emptyDays < wkDay; emptyDays++) {
          //插入空的单元格
          oneMonth.trs[trIndex].push("");
        }
        for (var d = 1; d <= daysCount; d++) {
          let dayText = d;
          let cls = wkDay == 0 || wkDay == 6 ? "jjr" : "";
          oneMonth.trs[trIndex].push(dayText);
          wkDay++;
          if (wkDay == 7) {
            wkDay = 0;
            trIndex++;
            oneMonth.trs[trIndex] = [];
          }
        }

        ts.showDays.push(oneMonth);

        setcurrentDate.setMonth(currentMonth + 1);
        currentDate = setcurrentDate;
      }
    }
  },
  computed: {
    beginDate: function() {
      let dateStr = moment(this.$props.minDate).format("YYYY-MM-DD");
      return new Date(dateStr.replace(/-/gi, "/"));
    }
  },
  created() {
    this.selectedCheckInDay = moment(this.$props.checkInDate).format(
      "YYYY-MM-DD"
    );
    this.selectedCheckOutDay = moment(this.$props.checkOutDate).format(
      "YYYY-MM-DD"
    );
    this.initDays();
  }
};
</script>