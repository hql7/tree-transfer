<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <div class="box">
      <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}"></tree-transfer>
    </div>
  </div>
</template>

<script>
// import treeTransfer from "el-tree-transfer";
import treeTransfer from "@/components/transfer-extend"; // 源码位置

export default {
  name: "App",
  data() {
    return {
      fromData: [
        {
          id: 1,
          pid: 0,
          label: "11",
          children: [
            {
              id: 2,
              pid: 1,
              label: "11-2",
              children: []
            },
            {
              id: 3,
              pid: 1,
              label: "11-3",
              children: []
            },
            {
              id: 4,
              pid: 1,
              label: "11-4",
              children: [
                {
                  id: 5,
                  pid: 4,
                  label: "11-5",
                  children: []
                },
                {
                  id: 6,
                  pid: 4,
                  label: "11-6",
                  children: []
                }
              ]
            }
          ]
        }
      ], // 穿梭框 - 源数据 - 树形
      toData: [] // 穿梭框 - 目标数据 - 树形
    };
  },
  components: { treeTransfer }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.box {
  width: 600px;
  margin: 20px auto;
  text-align: left;
}
</style>
