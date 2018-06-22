<template>
  <div>
    <el-form :inline="true" :model="locationMsg" :rules="rules" ref="locationMsg" class="demo-form-inline">
      <el-form-item label="关键字搜索">
        <el-input v-model="locationMsg.keyword" placeholder="地址模糊搜索" id="tipinput"></el-input>
      </el-form-item>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="locationMsg.lnglat" placeholder="鼠标左击获取经纬度" id="lnglat"></el-input>
      </el-form-item>
      <el-form-item label="所在地址" prop="address">
        <el-input v-model="locationMsg.address" placeholder="根据经纬度自动生成" id="address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(locationMsg)">确定</el-button>
      </el-form-item>
    </el-form>
    <div id="container" class="mymap"></div>
  </div>
</template>

<script>
  import AMap from "AMap"; //在页面中引入高德地图
  export default {
    data() {
      return {
        // 百度地图经纬度
        locationMsg: {
          keyword: "",
          lnglat: "",
          address: ""
        },
        // 百度地图确定地址的规则
        rules: {
          lnglat: [{
            required: true,
            message: "请输入获取经纬度",
            trigger: "blur"
          }],
          address: [{
            required: true,
            message: "根据经纬度自动生成",
            trigger: "blur"
          }]
        }
      }
    },
    methods: {
      loadmap() {
        var _this = this;
        var windowsArr = [];
        // var marker = [];
        var map = new AMap.Map("container", {
          zoom: 9,
          resizeEnable: true,
          keyboardEnable: false
        });
        //为地图注册click事件获取鼠标点击出的经纬度坐标
        var clickEventListener = map.on("click", function (e) {
          _this.locationMsg.lnglat = e.lnglat.getLng() + "," + e.lnglat.getLat();
        });

        // 输入搜索和点击获取经纬度
        AMap.plugin(
          ["AMap.Autocomplete", "AMap.PlaceSearch", "AMap.Geocoder"],
          function () {
            //回调函数
            //实例化Autocomplete  输入搜索
            var autoOptions = {
              input: "tipinput" //使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);
            // 点击获取经纬度
            var placeSearch = new AMap.PlaceSearch({
              map: map
            });
            AMap.event.addListener(autocomplete, "select", function (e) {
              //TODO 针对选中的poi实现自己的功能
              placeSearch.setCity(e.poi.adcode);
              placeSearch.search(e.poi.name);
            }); //注册监听，当选中某条记录时会触发

            // 点击设置地址
            var geocoder = new AMap.Geocoder({
              map: map
            });
            map.on("click", function (e) {
              geocoder.getAddress(e.lnglat, function (status, result) {
                // 判断是否存在位置信息
                if (status == "complete") {
                  _this.locationMsg.address = result.regeocode.formattedAddress;
                } else {
                  _this.locationMsg.address = "";
                  _this.$message.error("无法获取当前位置信息");
                }
              });
            });
          }
        );
      },
      // 点击提交
      submitForm() {
        var _this = this;
        this.$refs.locationMsg.validate(valid => {
          if (valid) {
            console.log(_this.locationMsg)
          } else {
            return false;
          }
        });
      }
    },
    mounted() {
      this.loadmap()
    }
  }

</script>
<style scoped>
  .mymap {
    width: 100%;
    height: 500px;
  }

  .amap-sug-result {
    z-index: 3000;
  }

</style>
