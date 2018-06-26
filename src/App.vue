<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <div class="box">
      <tree-transfer :from_data='fromData' :to_data='toData'></tree-transfer>
    </div>
  </div>
</template>

<script>
import treeTransfer from "el-tree-transfer";
// import treeTransfer from "@/components/transfer-extend"; // 源码位置

export default {
  name: "App",
  data() {
    return {
      fromData: [
        {
          id: "1",
          pid: 0,
          lv: 0,
          label: "一级 1",
          children: [
            {
              id: "1-1",
              pid: "1",
              lv: 1,
              label: "二级 1-1",
              children: []
            },
            {
              id: "1-2",
              pid: "1",
              lv: 1,
              label: "二级 1-2",
              children: [
                {
                  id: "1-2-1",
                  pid: "1-2",
                  lv: 2,
                  children: [],
                  label: "二级 1-2-1"
                },
                {
                  id: "1-2-2",
                  pid: "1-2",
                  lv: 2,
                  children: [],
                  label: "二级 1-2-2"
                }
              ]
            }
          ]
        },
        {
          id: "2",
          pid: 0,
          lv: 0,
          label: "一级 2",
          children: [
            {
              id: "2-1",
              pid: "2",
              lv: 1,
              children: [],
              label: "二级 2-1"
            },
            {
              id: "2-2",
              lv: 1,
              pid: "2",
              label: "二级 2-2",
              children: [
                {
                  id: "2-2-1",
                  pid: "2-2",
                  lv: 2,
                  children: [],
                  label: "二级 2-2-1"
                },
                {
                  id: "2-2-2",
                  pid: "2-2",
                  lv: 2,
                  children: [],
                  label: "二级 2-2-2"
                }
              ]
            }
          ]
        },
        {
          id: "3",
          pid: 0,
          lv: 0,
          label: "一级 3",
          children: [
            {
              id: "3-1",
              pid: "3",
              lv: 1,
              children: [
                {
                  id: "6-6-6",
                  lv: 2,
                  pid: "3-1",
                  children: [],
                  label: "三级 6-6-6"
                },
                {
                  id: "6-6-7",
                  lv: 2,
                  pid: "3-1",
                  children: [],
                  label: "三级 6-6-7"
                }
              ],
              label: "二级 3-1"
            },
            {
              id: "3-2",
              lv: 1,
              pid: "3",
              children: [],
              label: "二级 3-2"
            }
          ]
        },
        {
          id: "4",
          pid: 0,
          lv: 0,
          label: "一级 4",
          children: [
            {
              id: "4-1",
              lv: 1,
              pid: "4",
              children: [],
              label: "二级 4-1"
            },
            {
              id: "4-2",
              lv: 1,
              pid: "4",
              children: [],
              label: "二级 4-2"
            }
          ]
        }
      ], // 穿梭框 - 源数据 - 树形
      toData: [
        {
          id: "1",
          pid: 0,
          lv: 0,
          label: "一级 1",
          children: [
            {
              id: "1-7",
              pid: "1",
              lv: 1,
              label: "二级 1-7",
              children: []
            },
            {
              id: "1-1-1",
              pid: "1",
              lv: 1,
              label: "二级 1-1-1",
              children: [
                {
                  id: "2-1-8",
                  pid: "1-1-1",
                  lv: 2,
                  children: [],
                  label: "二级 2-1-8"
                },
                {
                  id: "2-1-9",
                  pid: "1-1-1",
                  lv: 2,
                  children: [],
                  label: "二级 2-1-9"
                }
              ]
            },
            {
              id: "1-2",
              pid: "1",
              lv: 1,
              label: "二级 1-2",
              children: [
                {
                  id: "2-1-10",
                  pid: "1-2",
                  lv: 2,
                  children: [],
                  label: "二级 2-1-10"
                },
                {
                  id: "2-1-11",
                  pid: "1-2",
                  lv: 2,
                  children: [],
                  label: "二级 2-1-11"
                }
              ]
            }
          ]
        },
        {
          id: "2",
          pid: 0,
          lv: 0,
          label: "一级 2",
          children: [
            {
              id: "2-6",
              pid: "2",
              lv: 1,
              children: [],
              label: "二级 2-6"
            },
            {
              id: "2-8",
              lv: 1,
              pid: "2",
              label: "二级 2-8",
              children: [
                {
                  id: "3-1-8",
                  pid: "2-8",
                  lv: 2,
                  children: [],
                  label: "二级 3-1-8"
                },
                {
                  id: "3-2-9",
                  pid: "3-2-9",
                  lv: 2,
                  children: [],
                  label: "二级 3-2-9"
                }
              ]
            }
          ]
        }
      ] // 穿梭框 - 目标数据 - 树形
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
