<template>
  <div id="app">
    <img class="vue" src="./assets/logo.png">
    <router-view/>
    <h4>
      <label>请打开f12查看移动数据</label>
      <el-button size="medium" type="info" @click="changeMode">当前模式：{{mode}}</el-button>
    </h4>
    <div class="box">
      <!-- <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :render-content="renderContent"> -->
      <tree-transfer :title="title" :from_data='fromData' :to_data='toData' @addBtn='add' @removeBtn='remove' :mode='mode' height='540px' filter open-all>
      </tree-transfer>
    </div>
  </div>
</template>

<script>
import treeTransfer from "el-tree-transfer";
// import treeTransfer from "@/components/transfer-extend"; // 源码位置
// import treeTransfer from "../npm/lib/transfer-extend"; // 源码位置

export default {
  name: "App",
  data() {
    return {
      mode: "transfer", // transfer addressList
      fromData: [
        {
          id: 1,
          pid: 0,
          label: "测试左侧",
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
                  children: [
                    {
                      id: 111,
                      pid: 5,
                      label: "11-111"
                    }
                  ]
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
    this.fromData = [
      { id: 1, label: "查找所有商品", pid: 0 },
      {
        id: 3,
        label: "eos管理员门店管理",
        pid: 0,
        children: [
          { id: 51, label: "门店等级列表", pid: 3 },
          { id: 4, label: "eos管理员门店列表", pid: 3 }
        ]
      },
      {
        id: 5,
        label: "eos管理员供应商管理",
        pid: 0,
        children: [
          { id: 52, label: "商品价格级别列表", pid: 5 },
          { id: 6, label: "eos管理员供应商列表", pid: 5 }
        ]
      },
      {
        id: 7,
        label: "eos管理员采购管理",
        pid: 0,
        children: [{ id: 8, label: "eos管理员采购列表", pid: 7 }]
      },
      {
        id: 9,
        label: "eos管理员代发管理",
        pid: 0,
        children: [{ id: 10, label: "eos管理员代发列表", pid: 9 }]
      },
      {
        id: 11,
        label: "eos管理员系统管理",
        pid: 0,
        children: [
          { id: 16, label: "eos管理员系统日志", pid: 11 },
          { id: 15, label: "eos管理员送货地址", pid: 11 },
          { id: 14, label: "eos管理员系统通知", pid: 11 },
          { id: 13, label: "eos管理员系统参数", pid: 11 },
          { id: 12, label: "eos管理员解析模板", pid: 11 }
        ]
      },
      {
        id: 18,
        label: "eos门店供应商管理",
        pid: 0,
        children: [
          { id: 20, label: "eos门店财务管理", pid: 18 },
          { id: 19, label: "eos门店供应商综合", pid: 18 }
        ]
      },
      { id: 21, label: "eos门店商品管理", pid: 0 },
      {
        id: 22,
        label: "eos门店订单管理",
        pid: 0,
        children: [
          { id: 26, label: "eos门店代发订单", pid: 22 },
          { id: 25, label: "eos门店入库单", pid: 22 },
          { id: 24, label: "eos门店采购单", pid: 22 },
          { id: 23, label: "eos门店采购计划单", pid: 22 }
        ]
      },
      {
        id: 27,
        label: "eos门店个人中心",
        pid: 0,
        children: [
          { id: 29, label: "eos门店消息通知", pid: 27 },
          { id: 28, label: "eos门店账户安全", pid: 27 }
        ]
      },
      {
        id: 31,
        label: "eos仓库门店管理",
        pid: 0,
        children: [
          { id: 33, label: "eos仓库财务管理", pid: 31 },
          { id: 32, label: "eos仓库门店管理类表", pid: 31 }
        ]
      },
      { id: 34, label: "eos仓库商品管理", pid: 0 },
      {
        id: 35,
        label: "eos仓库订单管理",
        pid: 0,
        children: [
          { id: 38, label: "eos仓库代发管理", pid: 35 },
          { id: 37, label: "eos仓库出库单", pid: 35 },
          { id: 36, label: "eos仓库采购单", pid: 35 }
        ]
      },
      {
        id: 39,
        label: "eos仓库个人中心",
        pid: 0,
        children: [
          { id: 43, label: "eos仓库支付管理", pid: 39 },
          { id: 42, label: "eos仓库消息通知", pid: 39 },
          { id: 41, label: "eos仓库账号安全", pid: 39 },
          { id: 40, label: "eos仓库个人信息", pid: 39 }
        ]
      },
      { id: 47, label: "测试业务功能名称", pid: 0 },
      { id: 50, label: "string", pid: 0 },
      { id: 53, label: "拆单接口", pid: 0 }
    ];
  },
  methods: {
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
    // 自定义节点 仅树形结构支持
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              Append
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              Delete
            </el-button>
          </span>
        </span>
      );
    }
  },
  computed: {
    title() {
      if (this.mode == "transfer") {
        return ["源列表", "目标列表"];
      } else {
        return ["通讯录", "收件人", "抄送人", "密送人"];
      }
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
</style>
