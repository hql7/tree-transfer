<template>
  <div class="info-box">
    <img alt="Vue logo" src="./assets/logo.png" />
    <h3 class="title">
      <a href="https://github.com/hql7/tree-transfer" target="_block">GitHub</a>
      <a href="https://www.npmjs.com/package/el-tree-transfer" target="_block">NPM</a>
      <a href="https://juejin.im/post/5b3ecae8e51d4519213fae4b" target="_block">掘金</a>
      <a href="https://segmentfault.com/a/1190000015553081" target="_block"
        >SegmentFault</a
      >
      <a href="https://blog.csdn.net/qq_15390381/article/details/80943549" target="_block"
        >CSDN</a
      >
    </h3>
    <h4 style="margin-bottom: 20px">
      <label>请打开f12查看移动数据</label>
      <el-button size="medium" type="info" class="margin-left-10" @click="changeMode"
        >当前模式：{{ mode }}</el-button
      >
      <!-- <el-button size="medium" @click="clearChecked()">清除选中</el-button> -->
      <!-- <el-button size="medium" @click="getChecked()">获取选中</el-button> -->
      <!-- <el-button size="medium" @click="setChecked()">设置选中</el-button> -->
    </h4>
  </div>
  <div class="components-box">
    <tree-transfer :mode="mode"></tree-transfer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const mode = ref("transfer");
    const changeMode = (): void => {
      mode.value = mode.value == "transfer" ? "address" : "transfer";
    };
    return { mode, changeMode };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
.info-box {
  text-align: center;
  .margin-left-10 {
    margin-left: 10px;
  }
  .title a {
    margin: 10px;
    font-size: 18px;
    line-height: 40px;
    color: #2c3e50;
  }
}
.components-box {
  width: 800px;
  margin: 0 auto;
}
</style>
