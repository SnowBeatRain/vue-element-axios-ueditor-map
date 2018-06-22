<template>
  <div class="box">
    <el-button type="text" @click="ADialogVisible = true">高德地图</el-button>
    <el-dialog title="提示" :visible.sync="ADialogVisible" width="70%" :before-close="handleClose">
      <!-- 此组件不需要父传子，所以不需要属性传值，可以直接使用 -->
      <GaoDeMap></GaoDeMap>
      <!-- <GaoDeMap :AMapMsg="locationMsg" :ADialogVisible="ADialogVisible" ref="map"></GaoDeMap> -->
    </el-dialog>

    <el-button type="text" @click="BDialogVisible = true">百度地图</el-button>
      <el-dialog title="提示" :visible.sync="BDialogVisible" width="70%" :before-close="handleClose">
        <!-- <BaiDuMap :BMapMsg="locationMsg" :BDialogVisible="BDialogVisible" ref="map"></BaiDuMap> -->
        <BaiDuMap></BaiDuMap>
      </el-dialog>
  </div>
</template>
<script>
import GaoDeMap from "./GaoDeMap.vue"; //在页面中引入高德地图
import BaiDuMap from "./BaiDuMap.vue"; //在页面中引入高德地图
import bus from "../utils/bus.js";
export default {
  data() {
    return {
      // 高德地图弹框
      ADialogVisible: false,
      // 百度地图弹框
      BDialogVisible: false,
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      }
    };
  },
  components: { GaoDeMap, BaiDuMap },
  methods: {
    // 关闭弹框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  mounted() {
    // bus总线控制弹框关闭和参数获取
    bus.$on(
      "ADialogVisible",
      function(e) {
        this.ADialogVisible = e;
      }.bind(this)
    );
    bus.$on(
      "locationMsg",
      function(e) {
        console.log(e);
        this.locationMsg = e;
      }.bind(this)
    );

    bus.$on(
      "BDialogVisible",
      function(e) {
        this.BDialogVisible = e;
      }.bind(this)
    );
  }
};
</script>
<style>
.amap-sug-result {
  z-index: 4000!important;
}
#tangram-suggestion--TANGRAM__u-main{
  z-index: 3000!important;
}
</style>
