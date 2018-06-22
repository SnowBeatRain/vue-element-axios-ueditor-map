<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <h2>友情链接：</h2> -->
    <ul>
      <!-- <li><a href="https://vuejs.org" target="_blank">黄晓明官网</a></li> -->
      <!-- <li><a href="https://forum.vuejs.org" target="_blank">黄晓明影友会微博</a></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: '欢迎来到后台管理系统'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
