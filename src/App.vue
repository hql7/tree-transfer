<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <div class="box">
      <!-- <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :render-content="renderContent"> -->
      <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' >
      </tree-transfer>
    </div>
  </div>
</template>

<script>
// import treeTransfer from "el-tree-transfer";
import treeTransfer from "@/components/transfer-extend"; // 源码位置
// import treeTransfer from "../npm/lib/transfer-extend"; // 源码位置

export default {
  name: "App",
  data() {
    return {
      fromData: [
        {
          id: 1,
          pid: 0,
          label: "测试",
          children: [
            {
              id: 2,
              pid: 1,
              label: "水电费是打发斯蒂芬斯蒂芬gas噶水电费噶地方死光光",
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
  created() {
    this.axios.get("../static/data.json").then(res => {
      // this.fromData = res.data;
    });
  },
  methods: {
    // 添加按钮
    add(fromData, toData, obj) {
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 移除按钮
    remove(fromData, toData, obj) {
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 自定义节点
    renderContent(h, { node, data, store }){
    return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
      }
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
