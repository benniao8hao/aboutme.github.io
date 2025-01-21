<template>
	<footer class="nav-bar">
			<div>
				<a href="javascript:void(0)" v-for="(menu,index) in menus" :class="{'nav-active':curNav==menu.action}" @click="go(menu.action)">
					<span :class="`iconfont ${menu.icon}`"></span>{{menu.text}}
				</a>
				<a href="javascript:void(0)" v-if="currentStore.useType==1" @click="goGroupon">
					<span class="iconfont icon-iconfontgift"></span>团抢优惠
				</a>
			</div>
		</footer>
</template>

<script>
let useTypeMenus = [
  [
    { icon: "icon-jiudian", text: "酒店预订", action: "home" },
    { icon: "icon-canyin", text: "餐饮预订", action: "restaurant" },
    { icon: "icon-my", text: "会员中心", action: "my" }
  ],
  [
    { icon: "icon-jiudian", text: "酒店预订", action: "home" },
    { icon: "icon-canyin", text: "餐饮预订", action: "restaurant" },
    { icon: "icon-my", text: "会员中心", action: "my" },
    // { icon: "icon-naozhong", text: "抢购", action: "discounts" },
    // { icon: "icon-tuangou", text: "团购", action: "groupbuy" }
    {
      icon: "icon-iconfontgift",
      text: "团抢优惠",
      action:`http://${document.domain}/ZnDiscounts/#/discounts/`
        // process.env.NODE_ENV === "development"
        //   ? "http://localhost:8085/#/discounts/"
        //   : "http://www.0898so.com/zndiscounts/#/discounts/"
    }
  ]
];
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      curNav: "home",
      menus: useTypeMenus[0]
    };
  },
  created() {
    let org = this.currentStore;
    //console.log(org);
    let idx = org.useType == 1 ? 0 : 1;
    this.menus = useTypeMenus[idx];
    //console.log(this.$router)
    if (this.$router.history) this.curNav = this.$router.history.current.name;
  },
  watch: {
    $route(to, from) {
      //console.log(from)
      //console.log(to)
      this.curNav = to.name;
    }
  },
  computed: {
    ...mapGetters({
      currentStore: "app/store"
    })
  },
  methods: {
    goGroupon() {
      //this.$tips.done("暂未开放，敬请期待");
      window.location.href =
        "http://www.0898so.com/zndiscounts/#/discounts/fanqigx";
    },
    go(name) {
      let params = this.$storeGetter.getOrg();
      if (name.indexOf("http") > -1) {
        window.location = `${name}${params.groupAccount}`;
        return;
      }
      this.curNav = name;
      if (!params) {
        this.$router.push({ name: "404" });
        return;
      }
      this.$router.push({
        name: name,
        params
      });
    }
  }
};
</script>
