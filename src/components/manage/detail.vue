<template>
    <div class="box">
      <el-button type="text" @click="dialogVisible = true">百度地图</el-button>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
        <BaiDuMap :MapMsg="locationMsg" :dialogVisible="dialogVisible" ref="map"></BaiDuMap>
      </el-dialog>
    </div>
  </template>
  <script>
  import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入高德地图
  import bus from "../../utils/bus.js";
  export default {
    data() {
      return {
        // 地图弹框
        dialogVisible: false,
        // 高德地图经纬度
        locationMsg: {
          keyword: "",
          lnglat: "",
          address: ""
        }
      };
    },
    components: { BaiDuMap },
    methods: {
      // 关闭弹框
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    },
    mounted() {
      // bus总线控制弹框关闭和参数获取
      bus.$on(
        "dialogVisible",
        function(e) {
          this.dialogVisible = e;
        }.bind(this)
      );
      bus.$on(
        "locationMsg",
        function(e) {
          console.log(e)
          this.locationMsg = e;
        }.bind(this)
      );
    }
  };
  </script>
  <style scoped>
  
  </style>
  