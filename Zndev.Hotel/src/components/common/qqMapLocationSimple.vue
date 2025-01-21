<template>	
	<div ref="container" class="map" :style="{width: width,height: height}"></div>			
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    lng: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    showInfoWindow: {
      type: Boolean,
      default: false
    },
    width: {
      default: "100%"
    },
    height: {
      default: "120px"
    }
  },
  components: {},
  methods: {
    initMap() {
      let that = this;
      let latLng = new qq.maps.LatLng(that.lat, that.lng);
      let elememt = that.$refs.container;
      let map = new qq.maps.Map(elememt, {
        mapTypeControl: false, //地图类型控件的初始启用/停用状态(地图右上角那个“地图|卫星”)
        zoomControl: false, //缩放控件的初始启用/停用状态(地图左上角那个标尺)
        center: latLng, // 地图的中心地理坐标。
        zoom: 15 // 地图的中心地理坐标。
      });
      //标识点（覆盖物）
      let anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(24, 24),
        origin = new qq.maps.Point(0, 0),
        icon = new qq.maps.MarkerImage(
          "https://lbs.qq.com/javascript_v2/img/center.gif",
          size,
          origin,
          anchor
        );
      let marker = new qq.maps.Marker({
        icon: icon,
        map: map,
        position: latLng
      });
      if (that.showInfoWindow) {
        let infoWin = new qq.maps.InfoWindow({
          map: map
        });
        infoWin.open();
        infoWin.setContent(
          '<div style="margin:5px;">' +
            '	<div class="window">' +
            '		 <div class="top">' +
            '		 	<div class="title">风兰商务酒店</div>' +
            "		 </div>" +
            '		 <div class="content">' +
            '	      	<img src="http://www.0898so.com/AttachedFolder/31b9e4cf/images/bfdfef6a.png" alt="">' +
            "			地址：儋州市白马井镇中六横路与人民中路交汇处（海花岛附近）<br/>" +
            "			电话：0898-23652999<br/>" +
            '			<a  id="a_map_goNav_btn" href="#" target="_blank" style="display:none;">导航去这里</a>' +
            "		 </div>" +
            "	</div>" +
            "</div>"
        );
        infoWin.setPosition(map.getCenter());
        //点击事件
        qq.maps.event.addListener(marker, "click", function() {
          infoWin.open();
        });
        let interval = setInterval(function() {
          let mapNavLink = document.getElementById("a_map_goNav_btn");
          if (mapNavLink) {
            mapNavLink.setAttribute(
              "href",
              "http://apis.map.qq.com/uri/v1/marker?marker=coord:30.595810,103.912830;title:渔虾跳主题餐吧;addr: 城南优品道广场星光广场一楼"
            );
            mapNavLink.style.display = "block";
            clearInterval(interval);
          }
        }, 200);
      }
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>
<style scope>
/*隐藏版权*/
#container > div > div:nth-child(2),
#container > div > div:nth-child(3),
#container > div > div:nth-child(4) {
  display: none;
}
</style>
