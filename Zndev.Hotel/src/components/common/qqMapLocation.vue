<template>
	<div class="map-location"> 
		<div class="map-container">
			<div ref="container"  style="width: 100%,height: 100%"></div>		 		 
		</div>
		<div class="map-back">
			<div @click="back" class="close">关闭地图</div>	
			<div ref="closeInfoWindow" class="show">{{showInfoWindow?'关闭信息':'显示信息'}}</div>					
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      showInfoWindow: true
    };
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
    title: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    }
  },

  methods: {
    back() {
      this.$emit("onMapClose");
    },
    initMap() {
      let that = this;
      let latLng = new qq.maps.LatLng(that.lat, that.lng);
      let elememt = that.$refs.container;
      let map = new qq.maps.Map(elememt, {
        mapTypeControl: false, //地图类型控件的初始启用/停用状态(地图右上角那个“地图|卫星”)
        zoomControl: false, //缩放控件的初始启用/停用状态(地图左上角那个标尺)
        center: latLng, // 地图的中心地理坐标。
        zoom: 15 // 缩放级别
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

      var labelCss = {
        color: "#f00",
        fontSize: "13px",
        padding: "5px",
        fontWeight: "bold",
        marginLeft: "-29px",
        marginTop: "-40px"
      };
      let label = new qq.maps.Label({
        position: latLng,
        map: map,
        style: labelCss,
        visible: false,
        content: "我们在这里"
      });

      let infoWin = new qq.maps.InfoWindow({
        map: map
      });
      infoWin.open();
      infoWin.setContent(
        '<div style="margin:5px;">' +
          '	<div class="window">' +
          '		 <div class="top">' +
          '		 	<div class="title">' +
          that.title +
          "</div>" +
          "		 </div>" +
          '		 <div class="content">' +
          '	      	<img src="' +
          that.logo +
          '" alt="">' +
          "			地址：" +
          that.address +
          "<br/>" +
          "			电话：" +
          that.tel +
          "<br/>" +
          '			<a  id="a_map_goNav_btn" href="#" target="_blank" style="display:none;">打开导航</a>' +
          "		 </div>" +
          "	</div>" +
          "</div>"
      );
      infoWin.setPosition(map.getCenter());
      qq.maps.event.addListener(infoWin, "closeclick", function() {
        label.setVisible(true);
        label.setMap(map);
        that.showInfoWindow = false;
      });

      qq.maps.event.addListener(marker, "click", function() {
        label.setMap(null);
        infoWin.open();
        that.showInfoWindow = true;
      });

      let interval = setInterval(function() {
        let mapNavLink = document.getElementById("a_map_goNav_btn");
        if (mapNavLink) {
          mapNavLink.setAttribute(
            "href",
            "http://apis.map.qq.com/uri/v1/marker?marker=coord:" +
              that.lat +
              "," +
              that.lng +
              ";title:" +
              that.title +
              ";addr: " +
              that.address
          );
          mapNavLink.style.display = "block";
          clearInterval(interval);
        }
      }, 200);

      let btnCloseInfoWindow = that.$refs.closeInfoWindow;
      qq.maps.event.addListener(btnCloseInfoWindow, "click", function() {
        if (that.showInfoWindow) {
          infoWin.close();
          label.setVisible(true);
          label.setMap(map);
        } else {
          infoWin.open();
          label.setMap(null);
        }
        that.showInfoWindow = !that.showInfoWindow;
      });
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>