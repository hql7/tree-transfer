<template>
  <div id="app">
    <img class="vue" src="./assets/logo.png" />
    <router-view />
    <h4 style="margin-bottom: 20px">
      <label>请打开f12查看移动数据</label>
      <el-button size="medium" type="info" @click="changeMode"
        >当前模式：{{ mode }}</el-button
      >
      <el-button size="medium" @click="clearChecked()">清除选中</el-button>
      <el-button size="medium" @click="getChecked()">获取选中</el-button>
      <el-button size="medium" @click="setChecked()">设置选中</el-button>
    </h4>
    <div class="box">
      <!-- lazy -->
      <!-- :lazyFn="lazyFn" -->
      <tree-transfer
        ref="wl-tree-transfer"
        filter
        draggable
        high-light
        :mode="mode"
        :title="title"
        :to_data="toData"
        :from_data="fromData"
        :filterNode="filterNode"
        :defaultProps="defaultProps"
        :defaultCheckedKeys="defaultCheckedKeys"
        :defaultExpandedKeys="[2, 3]"
        @right-check-change="rightCheckChange"
        @left-check-change="leftCheckChange"
        @remove-btn="remove"
        @add-btn="add"
        node_key="id"
      >
        <!-- 自定义左侧节点插槽 -->
        <template #content-left="{ data }">
          <span>{{ data.name }}</span>
        </template>
        <!-- 自定义右侧节点插槽 -->
        <template #content-right="{ data }">
          <span>{{ data.name }}</span>
        </template>
        <span slot="title-right" class="my-title-right" @click="handleTitleRight"
          >自定义内容</span
        >
      </tree-transfer>
    </div>
  </div>
</template>

<script>
// import treeTransfer from "el-tree-transfer";
// import treeTransfer from "@/components/transfer-extend"; // 源码位置
import treeTransfer from "../npm/lib/transfer-extend"; // npm源码位置
// import treeTransfer from "../npm/lib/transfer-extend-next/index"; // next源码位置

export default {
  name: "App",
  data() {
    return {
      mode: "transfer", // transfer addressList
      defaultProps: {
        label: "name",
        children: "children",
        disabled(data) {
          return data.id === 2;
        },
      },
      fromData: [
        {
          id: 1,
          pid: 0,
          name: "测试左侧",
          children: [
            {
              id: 2,
              pid: 1,
              name: "水电费是打发斯蒂芬斯蒂芬gas噶水电费噶地方死光光",
              children: [],
            },
            {
              id: 3,
              pid: 1,
              name: "11-3",
              children: [],
            },
            {
              id: 4,
              pid: 1,
              name: "11-4",
              children: [
                {
                  id: 5,
                  pid: 4,
                  name: "11-5",
                  children: [
                    {
                      id: 111,
                      pid: 5,
                      name: "11-111",
                    },
                  ],
                },
                {
                  id: 6,
                  pid: 4,
                  name: "11-6",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 7127,
          pid: 0,
          name: "debug",
          children: [
            {
              id: 71272,
              pid: 7127,
              name: "debug22",
              // disabled: true,
              children: [],
            },
            {
              id: 71273,
              pid: 7127,
              name: "debug11",
              children: [],
            },
          ],
        },
      ], // 穿梭框 - 源数据 - 树形
      toData: [{ id: 1, pid: 0, name: "测试左侧" }], // 穿梭框 - 目标数据 - 树形
      fromArray: [
        {
          id: "1",
          name: "1",
          pid: "0",
        },
        {
          id: "2",
          name: "2",
          pid: "0",
        },
        {
          id: "1-1",
          name: "1-1",
          pid: "1",
        },
        {
          id: "1-2",
          name: "1-2",
          pid: "1",
        },
        {
          id: "1-1-1",
          name: "1-1-1",
          pid: "1-1",
        },
        {
          id: "1-1-1-1",
          name: "1-1-1-1",
          pid: "1-1-1",
        },
        {
          id: "2-1",
          name: "2-1",
          pid: "2",
        },
        {
          id: "2-2",
          name: "2-2",
          pid: "2",
        },
      ],
      toArray: [],
      defaultCheckedKeys: [], // 左侧默认选中数据
    };
  },
  created() {
    // this.defaultCheckedKeys = [1];

    this.$nextTick(() => {
      // this.defaultCheckedKeys = [1];
    });
  },
  mounted() {
    setTimeout(() => {
      // this.defaultCheckedKeys = [1];
    }, 1000);
  },
  methods: {
    // 获取选中
    getChecked() {
      const checkeds = this.$refs["wl-tree-transfer"].getChecked();
    },
    // 设置选中
    setChecked() {
      this.$refs["wl-tree-transfer"].setChecked([71272], [2]);
    },
    // 清除选中
    clearChecked() {
      this.$refs["wl-tree-transfer"].clearChecked();
    },
    // 自定义筛选函数
    filterNode(value, data, where) {
      console.log(value, data, where);
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 懒加载回调
    lazyFn(node, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 71272,
            pid: 7127,
            name: "debug22",
            // disabled: true,
            children: [],
          },
          {
            id: 71273,
            pid: 7127,
            name: "debug11",
            children: [],
          },
        ]);
      }, 500);
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    // 添加按钮
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 移除按钮
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 左侧源数据选中事件
    leftCheckChange(nodeObj, treeObj, checkAll) {
      console.log(nodeObj);
      console.log(treeObj);
      console.log(checkAll);
    },
    // 右侧目标数据选中事件
    rightCheckChange(nodeObj, treeObj, checkAll) {
      console.log(nodeObj);
      console.log(treeObj);
      console.log(checkAll);
    },
    // 自定义节点 仅树形结构支持
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={() => this.append(data)}>
              Append
            </el-button>
            <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>
              Delete
            </el-button>
          </span>
        </span>
      );
    },
    // 标题自定义区点击事件
    handleTitleRight() {
      alert("标题自定义区点击事件");
    },
  },
  computed: {
    title() {
      if (this.mode == "transfer") {
        return ["源列表", "目标列表"];
      } else {
        return ["通讯录", "收件人", "抄送人", "密送人"];
      }
    },
  },
  components: { treeTransfer },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.box {
  width: 600px;
  margin: 0 auto;
  text-align: left;
}

.btn {
  border: 1px solid #ebeef5;
  padding: 5px 10px;
  background-color: #f5f7fa;
  outline: none;
}

.my-title-right {
  float: right;
  font-size: 12px;
  cursor: pointer;
}
</style>
