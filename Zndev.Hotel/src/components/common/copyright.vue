<template>
  <!--<divider>{{desc?desc:"Copyright©Zndev.cn"}}</divider>-->
  <div class="copyright">
  	<divider>{{desc?desc:"Copyright Zndev"}}</divider>
  </div>
</template>
<script>
 
export default {
  props: { 
    desc: String
  },
  mounted() {  
//  var el=this.$el;
//  let offsetTop = el.offsetTop; 
//  let bodyHeight=document.body.offsetHeight; 
//  if(offsetTop < bodyHeight-50-46)//减去底部和顶部的高度
//  {
//    el.style.position="fixed";
//    el.style.bottom="50px";
//  }
  }
} 
</script>
 
