<template>
	<div class="ct_404">
		<div>
	 		<img src="http://web-img.0898so.com/404.jpg">
	 		<div>您要查看的网址可能：已被删除、已被更名或暂时不可用</div>
	 		<div class="back" @click="back">返回首页</div>
	 	</div>
	</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      let org = this.$storeGetter.getOrg();
      this.$router.push({
        name: "home",
        params: {
          groupAccount: org.groupAccount
        }
      });
    }
  }
};
</script>
<style type="text/css" scoped>
.ct_404 {
  height: 100%;
  display: table;
}
.ct_404 img {
  max-width: 100%;
}
.ct_404 > div {
  display: table-cell;
  vertical-align: middle;
  padding: 15px;
  background-color: #fff;
}
.ct_404 > div > div {
  margin: 10px 0 15px;
  text-align: center;
}
.ct_404 .back {
  width: 40%;
  margin: 0 auto;
  border: solid 1px #ccc;
  padding: 6px;
  background-color: #eee;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}
</style>
 