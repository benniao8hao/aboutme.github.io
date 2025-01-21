import requester from '@/utils/axios.js'

//使用 mockjs 模拟 api 请求与响应
require('@/mock/index.js')

//引入全局组件需要的组件对象 开始
import Copyright from '@/components/common/copyright.vue'
import footerNavBar from '@/components/common/footerNavBar.vue'
import Todo from '@/components/common/todo.vue'
//引入全局组件需要的组件对象 结束

//定义成全局组件或过滤器
Vue.filter('dateFormat', function (dateStr, fmt = 'YYYY-MM-DD') {
  return moment(dateStr).format(fmt)
});

//计算两个日期相差的天数，返回中文说明
Vue.filter('diffDays', function (dateBegin, dateEnd) {
  let a = moment(dateBegin),
    b = moment(dateEnd);
  let days = b.diff(a, 'days');
  if (days == 0)
    return '当天';
  return `${days+1}天后`;
})
Vue.component('todo', Todo)
Vue.component('navbar', footerNavBar)
Vue.component('copyright', Copyright)

//import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'http://img.0898so.com/public/product_loading_error.png',
  loading: 'http://img.0898so.com/public/loading_fqgx.png',
  attempt: 1
});

import {
  LoadingPlugin,
  ConfirmPlugin,
  AlertPlugin,
  ToastPlugin,
  XHeader,
  Loading,
  Msg,
  XInput,
  XButton,
  Radio,
  Group,
  Cell,
  GroupTitle,
  Divider,
  Checklist,
  Actionsheet,
  Previewer,
  TransferDom,
  Badge,
  Swiper,
  SwiperItem,
  PopupPicker,
  PopupHeader,
  Card,
  Grid,
  GridItem,
  ButtonTab,
  ButtonTabItem,
  Drawer,
  Flexbox,
  FlexboxItem,
  Checker,
  CheckerItem,
  Qrcode,
  Popup,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  CellBox,
  CheckIcon,
  InlineXNumber,
  Search,
  Tab,
  TabItem,
  Panel,
  XTextarea,
  XSwitch,
  Marquee,
  MarqueeItem,
  XAddress,
  CellFormPreview,
  Timeline,
  TimelineItem,
  InlineLoading,
  Countup,
  DatetimeView
} from 'vux'
Vue.component('datetime-view', DatetimeView)
Vue.component('countup', Countup)
Vue.component('inline-loading', InlineLoading)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin, {
  position: 'top',
  width: '90%'
})
Vue.component('button-tab', ButtonTab)
Vue.component('button-tab-item', ButtonTabItem)
Vue.component('drawer', Drawer)
Vue.component('x-header', XHeader)
Vue.component('loading', Loading)
Vue.component('msg', Msg)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)
Vue.component('group', Group)
Vue.component('divider', Divider)
Vue.component('checklist', Checklist)
Vue.component('actionsheet', Actionsheet)
Vue.component('previewer', Previewer)
Vue.directive('transfer-dom', TransferDom)
Vue.component('badge', Badge)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('popup-picker', PopupPicker)
Vue.component('popup-header', PopupHeader)
Vue.component('card', Card)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.component('group-title', GroupTitle)
Vue.component('cell', Cell)
Vue.component('radio', Radio)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('qrcode', Qrcode)
Vue.component('popup', Popup)
Vue.component('swipeout', Swipeout)
Vue.component('swipeout-item', SwipeoutItem)
Vue.component('swipeout-button', SwipeoutButton)
Vue.component('cell-box', CellBox)
Vue.component('check-icon', CheckIcon)
Vue.component('inline-x-number', InlineXNumber)
Vue.component('search', Search)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('panel', Panel)
Vue.component('x-textarea', XTextarea)
Vue.component('x-switch', XSwitch)
Vue.component('marquee', Marquee)
Vue.component('marquee-item', MarqueeItem)
Vue.component('x-address', XAddress)
Vue.component('cell-form-preview', CellFormPreview)
Vue.component('timeline', Timeline)
Vue.component('timeline-item', TimelineItem)

import StoreGetter from '@/utils/store_getter.js'
Vue.prototype.$storeGetter = StoreGetter;

//封装提示函数
Vue.prototype.$tips = {
  timeWarn: 1000 * 2.2,
  timeDone: 1000 * 2,
  width: '90%',
  warn(text = '', time, onHide, onShow) {
    let timeWarn = this.timeWarn,
      width = this.width
    Vue.$vux.toast.show({
      type: 'warn',
      text,
      time: time || timeWarn,
      width,
      position: 'middle',
      isShowMask: true,
      onShow,
      onHide
    })
  },
  done(text = '操作成功', onHide, onShow) {
    let time = this.timeDone,
      width = this.width
    Vue.$vux.toast.show({
      type: 'success',
      text,
      time,
      width,
      position: 'bottom',
      onShow,
      onHide
    })
  },
  alert(content, title = '提示', onHide, onShow) {
    Vue.$vux.alert.show({
      content,
      title,
      onShow,
      onHide
    })
  },
  /*
   * {
   * 	title,//标题
   *  content,//提示内容
   *  onConfirm,//确定事件
   *  onCancel//取消事件
   * }
   */
  confirm(option) {
    Vue.$vux.confirm.show(
      Object.assign({
        content: option.content,
        title: option.title || '确认操作',
        onConfirm: option.onConfirm,
        onCancel: option.onCancel
      }, option));
  },
  /*
   * {
   * 	title,//标题
   *  placeholder,//方本框输入提示
   *  onConfirm,//确定事件
   *  defaultText,//文本框默认值
   *  onCancel//取消事件
   * }
   */
  prompt(option) {
    Vue.$vux.confirm.prompt(option.placeholder, {
      title: option.title,
      inputAttrs: option.inputAttrs || {},
      onConfirm: option.onConfirm,
      onCancel: option.onCancel,
      onShow: function () {
        if (option.defaultText) // 设置输入值
          Vue.$vux.confirm.setInputValue(option.defaultText)
      }
    })
  },
}

import * as filters from '@/filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//定义全局组件或过滤器 结束


//引入自定义全局样式
import '@/assets/css/themes/weuiButton.less'
import '@/assets/css/global.less'
import 'vux/src/styles/1px.less'

Vue.use(VueRouter)

//引入 Vuex store
import store from '@/store'
import router from '@/router'
import App from '@/App'


FastClick.attach(document.body)


Vue.config.productionTip = false
Vue.prototype.$axios = requester




Vue.mixin({
  methods: {
    _getImgUrl(url) {
      if (url && url.indexOf('http:') == -1) {
        return process.env.BASE_API + url;
      }
      return url;
    },
    _replaceContentImgUrl(content) {
      if (content) {
        content = content.replace(/src\="\/AttachedFolder\//g, `src="${process.env.BASE_API}/AttachedFolder/`);
        content = content.replace(/src\='\/AttachedFolder\//g, `src='${process.env.BASE_API}/AttachedFolder/`);
      }
      return content;
    }
  }
});
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
