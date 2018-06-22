<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import "../static/css/common.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.el-container {
  width: 100%;
  height: calc(100% - 60px);
}
.crumb {
  height: 36px;
  line-height: 36px !important;
}
/* 
弹框的层级大于百度编辑器内置弹框
解决：设置百度编辑器成绩大于2000就可以。
*/

#edui_fixedlayer {
  z-index: 8000 !important;
}
.edui-dialog {
  z-index: 9999 !important;
}
.el-menu{
  width: 100%;
}
</style>
