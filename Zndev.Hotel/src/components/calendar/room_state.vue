<template>
<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">	
	<div class="calendar room-state">
		<div class="headerWrapper">
			<div class="headerTip">{{title}}</div>
			<div class="comfire" @click="onHide">返回</div>
		</div>
		<table class="dateZone">
			<tbody>
				<tr>
					<td class="colo">周日</td>
					<td>周一</td>
					<td>周二</td>
					<td>周三</td>
					<td>周四</td>
					<td>周五</td>
					<td class="colo">周六</td>
				</tr>
			</tbody>
		</table>
		<div class="tbody">
			<template v-for="month in showDays">
				<p class="ny1">{{month.text}}</p>
				<table class="dateTable">
					<tbody>
						<tr v-for="(tr,idx) in month.trs" :key="idx">
							<td v-for="(td,index) in tr" :class="getCls(month.year,month.month,td)" :key="index"  v-html="formatShow(month.year,month.month,td)">
							</td>
						</tr>
					</tbody>
				</table>
			</template>
		</div>
	</div>
</popup>
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
      showPopup: this.isShow,
      showDays: []
    };
  },
  props: {
    minDate: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: "房态预览"
    },
    maxDate: {
      type: String,
      required: true
    },
    roomStates: {
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
    },
    formatShow(year, month, day) {
      //格式化显示
      //console.log(`1=>${year}-${month}-${day}`)
      let rooms = this.roomStates;
      if (day == 0) {
        return "";
      }
      let dayStr =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      let jjrStr = jjr[month + "" + day];
      let room = rooms.find(r => {
        return dayStr == moment(r.date).format("YYYY-MM-DD");
      });
      let roomNum = "无房";
      if (room) {
        if (room.num > 0) roomNum = `剩${room.num}间`;
        else roomNum = "售磐";
      }
      if (typeof jjrStr != "undefined") {
        return `<p>${jjrStr}</p><p>${roomNum}</p>`;
      }
      return `${day}<p>${roomNum}</p>`;
    },
    compareDate(d1, d2) {
      if (typeof d1 == "string") d1 = new Date(d1.replace(/-/gi, "/"));
      if (typeof d2 == "string") d2 = new Date(d2.replace(/-/gi, "/"));
      return d1 > d2;
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
      let endDate = this.endDate;
      if (this.compareDate(dayStr, endDate)) {
        return "disabled"; //不可选择的样式
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
      let showMonths = ts.endDate.getMonth() - ts.beginDate.getMonth() + 1;
      let currentDate = ts.beginDate;

      for (let m = 0; m < showMonths; m++) {
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
    },
    endDate: function() {
      let dateStr = moment(this.$props.maxDate).format("YYYY-MM-DD");
      return new Date(dateStr.replace(/-/gi, "/"));
    }
  },
  created() {
    this.initDays();
  }
};
</script>