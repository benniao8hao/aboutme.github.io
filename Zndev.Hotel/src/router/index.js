import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

//引入 vue 组件
const Home = () =>
  import( /* webpackChunkName: "hotel" */ "@/views/home/index.vue");
const My = () =>
  import( /* webpackChunkName: "my" */ "@/views/my/index.vue");
const MyShare = () =>
  import( /* webpackChunkName: "MyShare" */ "@/views/my/share.vue");
const ShareHotel = () =>
  import( /* webpackChunkName: "MyShare" */ "@/views/home/components/shareHotel.vue");
const MyHotelOrder = () =>
  import( /* webpackChunkName: "myHotelOrder" */ "@/views/my/order/hotel.vue");
const MyHotelOrderDetail = () =>
  import( /* webpackChunkName: "myHotelOrder" */ "@/views/my/order/hotel_detail.vue");
const MyRepastOrder = () =>
  import( /* webpackChunkName: "myDiningOrder" */ "@/views/my/order/repast.vue");
const MyRepastOrderDetail = () =>
  import( /* webpackChunkName: "myDiningOrder" */ "@/views/my/order/repast_detail.vue");

const ShoppingCar = () =>
  import( /* webpackChunkName: "shopingCar" */ "@/views/shopping_car/index.vue");
const ShareProduct = () =>
  import( /* webpackChunkName: "MyShare" */ "@/components/common/share_product.vue");


const NotFound = () =>
  import( /* webpackChunkName: "webBase" */ "@/components/common/404.vue");
const Error = () =>
  import( /* webpackChunkName: "webBase" */ "@/components/common/error.vue");
const Login = () =>
  import( /* webpackChunkName: "webBase" */ "@/components/common/login.vue");
const OAuth = () =>
  import( /* webpackChunkName: "webBase" */ "@/components/common/wechat_oauth.vue");
const WeChartPay = () =>
  import( /* webpackChunkName: "orderCommon" */ "@/components/common/wechat_pay.vue");


//餐厅
const RestaurantLayout = () =>
  import( /* webpackChunkName: "restaurant" */ "@/views/restaurant/layout.vue"); //点餐布局页
const RestaurantIndex = () =>
  import( /* webpackChunkName: "restaurant" */ "@/views/restaurant/index.vue"); //点餐布局页
const RestaurantDetail = () =>
  import( /* webpackChunkName: "restaurant" */ "@/views/restaurant/detail.vue"); //点餐详情页

//定义路由
let routes = [{
    name: "login",
    path: "/login/:groupAccount([a-zA-Z0-9]{5,})/:groupId([0-9]{1,10})",
    component: Login,
    props: true
  }, //登录
  {
    name: "share_product",
    path: "/ShareProduct/:groupAccount([a-zA-Z0-9]{5,})-:groupId([0-9]{1,10})",
    component: ShareProduct,
    props: true
  },
  {
    name: "oauth",
    path: "/oauth/:groupAccount([a-zA-Z0-9]{5,})/:groupId([0-9]{1,10})",
    component: OAuth,
    props: true
  }, //授权
  {
    name: "wx_pay",
    path: "/WxPay/index",
    component: WeChartPay
  }, //支付
  {
    name: "home",
    path: "/home/:groupAccount([a-zA-Z0-9]{5,})/:storeId([0-9]{1,10})?",
    component: Home,
    props: true
  }, //首页订房
  {
    name: "restaurant_detail",
    path: "/restaurant/:groupAccount([a-zA-Z0-9]{5,})/:storeId([0-9]{1,10})/:id([0-9]{1,10})",
    component: RestaurantDetail,
    props: true
  }, //点餐详情
  {
    path: "/restaurant/:groupAccount([a-zA-Z0-9]{5,})/:storeId([0-9]{1,10})?",
    component: RestaurantLayout,
    props: true,
    children: [{
      name: "restaurant",
      path: "",
      component: RestaurantIndex
    }]
  }, //点餐
  {
    name: "my",
    path: "/my/:groupAccount([a-zA-Z0-9]{5,})?",
    component: My,
    props: true
  }, //我的  
  {
    name: "share_hotel",
    path: "/share-hotel/:groupAccount([a-zA-Z0-9]{5,})/:storeId([0-9]{1,10})",
    component: ShareHotel,
    props: true
  }, //酒店分享
  {
    name: "my_share",
    path: "/my/share/:groupAccount([a-zA-Z0-9]{5,})",
    component: MyShare,
    props: true
  }, //我的分享
  {
    name: "my_hotel_order",
    path: "/my/order/hotel/",
    component: MyHotelOrder
  }, //我的酒店订单
  {
    name: "my_hotel_order_detail",
    path: "/my/order/hotel/:groupAccount([a-zA-Z0-9]{5,})/:id([0-9]{1,10})",
    component: MyHotelOrderDetail,
    props: true
  }, //我的酒店订单详情
  {
    name: "my_repast_order",
    path: "/my/order/repast",
    component: MyRepastOrder
  }, //我的餐饮订单
  {
    name: "my_repast_order_detail",
    path: "/my/order/repast/:groupAccount([a-zA-Z0-9]{5,})/:id([0-9]{1,10})",
    component: MyRepastOrderDetail,
    props: true
  }, //我的餐饮订单详情 
  {
    name: "shopping_cart",
    path: "/shopcart",
    component: ShoppingCar
  }, //购物车
  {
    name: "error",
    path: "/error",
    component: Error
  }, //错误提示
  {
    name: "404",
    path: "/404",
    component: NotFound
  }, //404
  {
    name: "NotFound",
    path: "*",
    redirect: {
      name: "404"
    }
  }
];
//export default routes

Vue.use(VueRouter);

const router = new VueRouter({
  //mode: 'history',
  linkActiveClass: "nav-active",
  routes: routes
});

let loadingTips;
router.beforeEach(function (to, from, next) {
  loadingTips = window.setTimeout(() => {
    store.dispatch("app/updateLoadingStatus", {
      isLoading: true
    });
  }, 1000 * 3);
  //setTimeout(function(){next()},1000*10)//for test
  next();
});

router.afterEach(function (to) {
  if (loadingTips) window.clearTimeout(loadingTips);
  if (store.getters.org) document.title = store.getters.org.storeName;
  store.dispatch("app/updateLoadingStatus", {
    isLoading: false
  });
  /*
  // window.__wxjs_is_wkwebview
  // true 时 为 IOS 设备
  // false时 为 安卓 设备
  if (window.__wxjs_is_wkwebview) { // IOS
    if (window.entryUrl == '' || window.entryUrl == undefined) {
      var url = `http://www.0898so.com/znhotel/#${to.fullPath}`;
      window.entryUrl = url // 将后面的参数去除
    }
  } else { // 安卓    
    window.entryUrl = `http://www.0898so.com/znhotel/#${to.fullPath}`;
  }
  //console.log(window.entryUrl);
  */
});
/*
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  console.log(targetPath);
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
*/
export default router;
