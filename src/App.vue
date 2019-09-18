<template>
  <div id="app">
    <img class="vue" src="./assets/logo.png" />
    <router-view />
    <h4>
      <label>请打开f12查看移动数据</label>
      <el-button size="medium" type="info" @click="changeMode"
        >当前模式：{{ mode }}</el-button
      >
    </h4>
    <div class="box">
      <!-- <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :render-content="renderContent"> -->
      <tree-transfer
        :title="title"
        :from_data="fromData"
        :to_data="toData"
        :defaultProps="{ label: 'name', children: 'children' }"
        :defaultCheckedKeys="defaultCheckedKeys"
        :mode="mode"
        height="540px"
        node_key="id"
        @addBtn="add"
        @removeBtn="remove"
        @left-check-change="leftCheckChange"
        @right-check-change="rightCheckChange"
        filter
      >
        <span
          slot="title-right"
          class="my-title-right"
          @click="handleTitleRight"
          >自定义内容</span
        >
      </tree-transfer>
    </div>
  </div>
</template>

<script>
// import treeTransfer from "el-tree-transfer";
import treeTransfer from "@/components/transfer-extend"; // 源码位置
// import treeTransfer from "../npm/lib/transfer-extend"; // npm源码位置

export default {
  name: "App",
  data() {
    return {
      mode: "transfer", // transfer addressList
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
              // disabled: true,
              children: []
            },
            {
              id: 3,
              pid: 1,
              name: "11-3",
              children: []
            }
            /*    {
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
                      name: "11-111"
                    }
                  ]
                },
                {
                  id: 6,
                  pid: 4,
                  name: "11-6",
                  children: []
                }
              ]
            } */
          ]
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
              children: []
            },
            {
              id: 71273,
              pid: 7127,
              name: "debug11",
              children: []
            }
          ]
        }
      ], // 穿梭框 - 源数据 - 树形
      toData: [
        /*  {
          id: 1,
          pid: 0,
          name: "测试左侧",
          children: [
            {
              id: 2,
              pid: 1,
              name: "水电费是打发斯蒂芬斯蒂芬gas噶水电费噶地方死光光",
              children: [
                {
                  id: 22222222,
                  pid: 2,
                  name: "2222222222"
                }
              ]
            }
          ]
        } */
      ], // 穿梭框 - 目标数据 - 树形
      fromArray: [
        {
          id: "1",
          name: "1",
          pid: "0"
        },
        {
          id: "2",
          name: "2",
          pid: "0"
        },
        {
          id: "1-1",
          name: "1-1",
          pid: "1"
        },
        {
          id: "1-2",
          name: "1-2",
          pid: "1"
        },
        {
          id: "1-1-1",
          name: "1-1-1",
          pid: "1-1"
        },
        {
          id: "1-1-1-1",
          name: "1-1-1-1",
          pid: "1-1-1"
        },
        {
          id: "2-1",
          name: "2-1",
          pid: "2"
        },
        {
          id: "2-2",
          name: "2-2",
          pid: "2"
        }
      ],
      toArray: [],
      defaultCheckedKeys: [] // 左侧默认选中数据
    };
  },
  created() {
    // this.defaultCheckedKeys = [1];

    this.$nextTick(() => {
      // this.defaultCheckedKeys = [1];
    });

    /* setTimeout(() => {
      this.defaultCheckedKeys = [1];
    }, 0); */

    /* this.fromData = [
      {
        id: 1,
        pid: 0,
        name: "关键字",
        children: [
          {
            id: 11,
            pid: 1,
            name: "财务报表",
            disabled: true
          },
          {
            id: 12,
            pid: 1,
            name: "工资奖金"
          },
          {
            id: 13,
            pid: 1,
            name: "会议纪要"
          }
        ]
      },
      {
        id: 2,
        pid: 0,
        name: "正则",
        children: [
          {
            id: 22,
            pid: 2,
            name: "Email地址"
          },
          {
            id: 23,
            pid: 2,
            name: "MAC地址"
          },
          {
            id: 24,
            pid: 2,
            name: "IPv6地址"
          }
        ]
      },
      {
        id: 3,
        pid: 0,
        name: "标识符",
        children: [
          {
            id: 32,
            pid: 3,
            name: "包含确切数据过滤器模板"
          },
          {
            id: 33,
            pid: 3,
            name: "包含前缀过滤器模板"
          },
          {
            id: 34,
            pid: 3,
            name: "包含后缀过滤器模板"
          }
        ]
      }
    ]; */
    /* this.fromData = [
      {
        id: 7127,
        pid: 0,
        name: "debug"
      }
    ]; */
    /* setTimeout(() => {
      this.defaultCheckedKeys = [11, 12, 13, 22, 23, 24, 32, 33, 34];
    }, 0); */

    /*  this.fromData = [
      {
        id: "29",
        name: "档案中心",
        sort: 29,
        pid: "0",
        type: 1,
        code: "management",
        permissions: [
          {
            id: "30",
            name: "合同管理",
            sort: 30,
            pid: "29",
            type: 1,
            code: "contract",
            permissions: [
              {
                id: "31",
                name: "合同-查询",
                sort: 31,
                pid: "30",
                type: 2,
                code: "contract:view",
                permissions: []
              },
              {
                id: "32",
                name: "合同-新增",
                sort: 32,
                pid: "30",
                type: 2,
                code: "contract:add",
                permissions: []
              },
              {
                id: "33",
                name: "合同-编辑",
                sort: 33,
                pid: "30",
                type: 2,
                code: "contract:edit",
                permissions: []
              },
              {
                id: "34",
                name: "合同-删除",
                sort: 34,
                pid: "30",
                type: 2,
                code: "contract:del",
                permissions: []
              },
              {
                id: "35",
                name: "合同-法务意见",
                sort: 35,
                pid: "30",
                type: 2,
                code: "contract:legal:edit",
                permissions: []
              },
              {
                id: "36",
                name: "合同-调研记录",
                sort: 36,
                pid: "30",
                type: 2,
                code: "contract:research:edit",
                permissions: []
              },
              {
                id: "37",
                name: "合同-催收情况",
                sort: 37,
                pid: "30",
                type: 2,
                code: "contract:collection:edit",
                permissions: []
              },
              {
                id: "38",
                name: "合同-诉讼情况",
                sort: 38,
                pid: "30",
                type: 2,
                code: "contract:litigation:edit",
                permissions: []
              },
              {
                id: "39",
                name: "合同-法务意见查询",
                sort: 39,
                pid: "30",
                type: 2,
                code: "contract:legal:view",
                permissions: []
              },
              {
                id: "40",
                name: "合同-调研记录查询",
                sort: 40,
                pid: "30",
                type: 2,
                code: "contract:research:view",
                permissions: []
              },
              {
                id: "41",
                name: "合同-催收情况查询",
                sort: 41,
                pid: "30",
                type: 2,
                code: "contract:collection:view",
                permissions: []
              },
              {
                id: "42",
                name: "合同-诉讼情况查询",
                sort: 42,
                pid: "30",
                type: 2,
                code: "contract:litigation:view",
                permissions: []
              }
            ]
          },
          {
            id: "43",
            name: "业主信息",
            sort: 43,
            pid: "29",
            type: 1,
            code: "company",
            permissions: [
              {
                id: "44",
                name: "业主-查询",
                sort: 44,
                pid: "43",
                type: 2,
                code: "company:view",
                permissions: []
              },
              {
                id: "45",
                name: "业主-新增",
                sort: 45,
                pid: "43",
                type: 2,
                code: "company:add",
                permissions: []
              },
              {
                id: "46",
                name: "业主-编辑",
                sort: 46,
                pid: "43",
                type: 2,
                code: "company:edit",
                permissions: []
              },
              {
                id: "47",
                name: "业主-删除",
                sort: 47,
                pid: "43",
                type: 2,
                code: "company:del",
                permissions: []
              }
            ]
          }
        ]
      }
    ];
    //系统权限
    this.toData = [
      {
        id: "12",
        name: "房产",
        sort: 11,
        pid: "0",
        type: 1,
        code: "package",
        permissions: [
          {
            id: "13",
            name: "房产管理",
            sort: 12,
            pid: "12",
            type: 1,
            code: "package",
            permissions: [
              {
                id: "14",
                name: "房产-查看",
                sort: 13,
                pid: "13",
                type: 2,
                code: "package:view",
                permissions: []
              }
            ]
          },
          {
            id: "15",
            name: "房产-新增",
            sort: 14,
            pid: "12",
            type: 2,
            code: "package:add",
            permissions: []
          },
          {
            id: "16",
            name: "房产-修改",
            sort: 15,
            pid: "12",
            type: 2,
            code: "package:update",
            permissions: []
          },
          {
            id: "17",
            name: "房产-删除",
            sort: 16,
            pid: "12",
            type: 2,
            code: "package:del",
            permissions: []
          },
          {
            id: "18",
            name: "房产-购买/放弃",
            sort: 17,
            pid: "12",
            type: 2,
            code: "package:buy",
            permissions: []
          },
          {
            id: "19",
            name: "房产-分配",
            sort: 18,
            pid: "12",
            type: 2,
            code: "package:distribute",
            permissions: [
              {
                id: "21",
                name: "渠道-查看",
                sort: 20,
                pid: "19",
                type: 2,
                code: "package:seller:view",
                permissions: []
              },
              {
                id: "22",
                name: "渠道-编辑",
                sort: 21,
                pid: "19",
                type: 2,
                code: "package:seller:edit",
                permissions: [
                  {
                    id: "24",
                    name: "尽调-查看",
                    sort: 23,
                    pid: "22",
                    type: 2,
                    code: "investigation:view",
                    permissions: []
                  },
                  {
                    id: "25",
                    name: "尽调-新增",
                    sort: 24,
                    pid: "22",
                    type: 2,
                    code: "investigation:add",
                    permissions: []
                  },
                  {
                    id: "26",
                    name: "尽调-编辑",
                    sort: 25,
                    pid: "22",
                    type: 2,
                    code: "investigation:edit",
                    permissions: []
                  },
                  {
                    id: "27",
                    name: "尽调-删除",
                    sort: 26,
                    pid: "22",
                    type: 2,
                    code: "investigation:del",
                    permissions: []
                  },
                  {
                    id: "28",
                    name: "尽调-分配",
                    sort: 27,
                    pid: "22",
                    type: 2,
                    code: "investigation:distribute",
                    permissions: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "23",
        name: "尽调管理",
        sort: 22,
        pid: "0",
        type: 1,
        code: "investigation",
        permissions: []
      },
      {
        id: "29",
        name: "档案中心",
        sort: 29,
        pid: "0",
        type: 1,
        code: "management",
        permissions: [
          {
            id: "30",
            name: "合同管理",
            sort: 30,
            pid: "29",
            type: 1,
            code: "contract",
            permissions: []
          },
          {
            id: "43",
            name: "业主信息",
            sort: 43,
            pid: "29",
            type: 1,
            code: "company",
            permissions: [
              {
                id: "52",
                name: "业主-经营分析查询",
                sort: 52,
                pid: "43",
                type: 2,
                code: "company:management:view",
                permissions: []
              },
              {
                id: "53",
                name: "业主-经营分析编辑",
                sort: 53,
                pid: "43",
                type: 2,
                code: "company:management:edit",
                permissions: []
              },
              {
                id: "54",
                name: "业主-分析报告查询",
                sort: 54,
                pid: "43",
                type: 2,
                code: "company:analysisrepot:view",
                permissions: []
              },
              {
                id: "55",
                name: "业主-分析报告编辑",
                sort: 55,
                pid: "43",
                type: 2,
                code: "company:analysisrepot:edit",
                permissions: []
              }
            ]
          },
          {
            id: "56",
            name: "个人信息",
            sort: 56,
            pid: "29",
            type: 1,
            code: "personl",
            permissions: [
              {
                id: "57",
                name: "个人-查询",
                sort: 57,
                pid: "56",
                type: 2,
                code: "personl:view",
                permissions: []
              },
              {
                id: "58",
                name: "个人-编辑",
                sort: 58,
                pid: "56",
                type: 2,
                code: "personl:edit",
                permissions: []
              },
              {
                id: "59",
                name: "个人-新增",
                sort: 59,
                pid: "56",
                type: 2,
                code: "personl:add",
                permissions: []
              },
              {
                id: "60",
                name: "个人-删除",
                sort: 60,
                pid: "56",
                type: 2,
                code: "personl:del",
                permissions: []
              },
              {
                id: "61",
                name: "个人-业主查询",
                sort: 61,
                pid: "56",
                type: 2,
                code: "personl:company:view",
                permissions: []
              },
              {
                id: "62",
                name: "个人-业主编辑",
                sort: 62,
                pid: "56",
                type: 2,
                code: "personl:company:edit",
                permissions: []
              },
              {
                id: "63",
                name: "个人-关系网络查询",
                sort: 63,
                pid: "56",
                type: 2,
                code: "personl:relationship:view",
                permissions: []
              },
              {
                id: "64",
                name: "个人-关系网络编辑",
                sort: 64,
                pid: "56",
                type: 2,
                code: "personl:relationship:edit",
                permissions: []
              },
              {
                id: "65",
                name: "个人-资产信息查询",
                sort: 65,
                pid: "56",
                type: 2,
                code: "personl:assets:view",
                permissions: []
              },
              {
                id: "66",
                name: "个人-资产信息编辑",
                sort: 66,
                pid: "56",
                type: 2,
                code: "personl:assets:edit",
                permissions: []
              },
              {
                id: "67",
                name: "个人-负债信息查询",
                sort: 67,
                pid: "56",
                type: 2,
                code: "personl:liabilities:view",
                permissions: []
              },
              {
                id: "68",
                name: "个人-负债信息编辑",
                sort: 68,
                pid: "56",
                type: 2,
                code: "personl:liabilities:edit",
                permissions: []
              }
            ]
          }
        ]
      },
      {
        id: "69",
        name: "我的待办",
        sort: 69,
        pid: "0",
        type: 1,
        code: "notice",
        permissions: []
      }
    ]; */
    /* fetch("../static/data.jsonp")
      .then(res => res.json())
      .then(res => {
        console.log(res);
      }); */
    /* this.axios
      .get("../static/da.json")
      .then(res => {
        this.fromData = res.data.rows; */
    /* this.fromData = res.data.dtu;
        this.defaultCheckedKeys = res.data.dtu[0].items.map(item => item.id); */
    // });
  },
  methods: {
    // 懒加载回调
    lazyFn(node, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 71272,
            pid: 7127,
            name: "debug22",
            // disabled: true,
            children: []
          },
          {
            id: 71273,
            pid: 7127,
            name: "debug11",
            children: []
          }
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
    },
    // 标题自定义区点击事件
    handleTitleRight() {
      alert("标题自定义区点击事件");
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

.my-title-right {
  float: right;
  font-size: 12px;
  cursor: pointer;
}
</style>
