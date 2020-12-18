<template>
  <div class="wl-transfer transfer" :style="{ width, height }">
    <component :is="isComponent" v-bind="$props">
      
    </component>
  </div>
</template>

<script>
import ComponentTransfer from "./components/transfer";
import ComponentAddress from "./components/address";

export default {
  name: "WlTransferTree",
  components: { ComponentTransfer, ComponentAddress },
  data() {
    return {};
  },
  props: {
    sjr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    csr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    msr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 宽度
    width: {
      type: String,
      default: "100%",
    },
    // 高度
    height: {
      type: String,
      default: "320px",
    },
    // 标题
    title: {
      type: Array,
      default: () => ["源列表", "目标列表"],
    },
    // 穿梭按钮名字
    button_text: Array,
    // 源数据
    from_data: {
      type: Array,
      default: () => [],
    },
    // 选中数据
    to_data: {
      type: Array,
      default: () => [],
    },
    // el-tree 配置项
    defaultProps: {
      type: Object,
      default: () => {
        return { label: "label", children: "children" };
      },
    },
    // el-tree node-key 必须唯一
    node_key: {
      type: String,
      default: "id",
    },
    // 自定义 pid参数名
    pid: {
      type: String,
      default: "pid",
    },
    // 自定义根节点pid的值，用于结束递归
    rootPidValue: {
      type: [String, Number],
      default: 0,
    },
    // 是否启用筛选
    filter: {
      type: Boolean,
      default: false,
    },
    // 是否展开所有节点
    openAll: {
      type: Boolean,
      default: false,
    },
    // 左侧自定义树节点
    renderContentLeft: Function,
    // 右侧自定义树节点
    renderContentRight: Function,
    // 穿梭框模式
    mode: {
      type: String,
      default: "transfer",
    },
    // 通讯录模式配置项 num-> 所需右侧通讯录个数 suffix-> label后想要拼接的字段（如id，即取此条数据的id拼接在后方）connector -> 连接符（字符串）
    addressOptions: {
      type: Object,
      default: () => {
        return {
          num: 3,
          suffix: "suffix",
          connector: "-",
        };
      },
    },
    // 穿梭后是否展开节点
    transferOpenNode: {
      type: Boolean,
      default: true,
    },
    // 源数据 默认选中节点
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    // 源数据 默认展开节点
    defaultExpandedKeys: {
      type: Array,
      default: () => [],
    },
    // 筛选placeholder
    placeholder: {
      type: String,
      default: "输入关键字进行过滤",
    },
    // 自定义筛选函数
    filterNode: Function,
    // 默认穿梭一次默认选中数据
    defaultTransfer: {
      type: Boolean,
      default: false,
    },
    // 是否开启arrayToTree
    arrayToTree: {
      type: Boolean,
      default: false,
    },
    // 是否启用懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 是否右侧树也启用懒加载
    lazyRight: {
      type: Boolean,
      default: false,
    },
    // 懒加载的回调函数
    lazyFn: Function,
    // 是否高亮当前选中节点，默认值是 false。
    highLight: {
      type: Boolean,
      default: false,
    },
    // 是否遵循父子不关联
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否每次只打开一个同级树节点
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 穿梭框模式
    isComponent() {
      return this.mode == "transfer" ? "ComponentTransfer" : "ComponentAddress";
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/clear.css";
@import "./assets/css/index.min.css";
</style>
