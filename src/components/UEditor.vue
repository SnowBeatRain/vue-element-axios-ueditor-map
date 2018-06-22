<template>
  <div>
    <script id='editor' type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: "UE",
  data() {
    return {
      editor: null
    };
  },
  props: {
    defaultMsg: {
      type: String
    },
    id: {
      type: String
    },
    config: {
      type: Object
    }
  },
  mounted() {
    //初始化UE
    const _this = this;
    this.editor = UE.getEditor("editor", this.config);

    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
    });
  },
  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent();
    },
    getUEContentTxt() {
      // 获取纯文本内容方法
      return this.editor.getContentTxt();
    }
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>