<template>
  <div class="wl-transfer transfer" :style="{ width, height }">
    <component
      :is="isComponent"
      v-bind="$props"
      ref="wl-transfer-component"
      @add-btn="handleAddBtn"
      @remove-btn="handleRemoveBtn"
      @left-check-change="handleLeftCheckChange"
      @right-check-change="handleRightCheckChange"
      @node-drag-start="handleNodeDragStart"
      @node-drag-enter="handleNodeDragEnter"
      @node-drag-leave="handleNodeDragLeave"
      @node-drag-over="handleNodeDragOver"
      @node-drag-end="handleNodeDragEnd"
      @node-drop="handleNodeDrop"
    >
      <template #left-footer>
        <slot name="left-footer"></slot>
      </template>
      <template #right-footer>
        <slot name="right-footer"></slot>
      </template>
      <template #title-left>
        <slot name="title-left"></slot>
      </template>
      <template #title-right>
        <slot name="title-right"></slot>
      </template>
      <template #from>
        <slot name="from"></slot>
      </template>
      <template #to>
        <slot name="to"></slot>
      </template>
      <template #content-left="{ node, data }">
        <slot name="content-left" :node="node" :data="data"></slot>
      </template>
      <template #content-right="{ node, data }">
        <slot name="content-right" :node="node" :data="data"></slot>
      </template>
    </component>
  </div>
</template>

<script>
import ComponentTransfer from "./components/transfer.vue";
import ComponentAddress from "./components/address.vue";

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
    defaultProps: Object,
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
    // 父子不关联模式
    checkStrictlyType: {
      type: String,
      default: "authorization",
      validator: function (value) {
        /**
         * @name 父子不关联的三种模式，第一种适合业务授权场景，后两种不存在快速选中需要手选
         * @param authorization授权模式：左侧选择子节点自动带着父节点；右侧选择父节点自动带着子节点；此模式两侧可能存在相同的非叶子节点
         * @param puppet木偶模式：纯父子不关联穿梭，但要保持完整的树形结构，只自动带上穿梭到对面拼接所需的骨架结构；此模式两侧可能存在相同的非叶子节点
         * @param modular积木模式：纯父子不关联穿梭，也不保持完整的树形结构，像积木一个右侧要形成树形则需要把左侧拆除，左侧拆的越多右侧形成的树结构越完整；此模式左右两侧保证严格的唯一性
         */
        return ["authorization", "puppet", "modular"].indexOf(value) !== -1;
      },
    },
    // 是否每次只打开一个同级树节点
    accordion: {
      type: Boolean,
      default: false,
    },
    // 是否在第一次展开某个树节点后才渲染其子节点
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    // 是否在点击节点的时候展开或者收缩节点
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    // 是否在点击节点的时候选中节点
    checkOnClickNode: {
      type: Boolean,
      default: false,
    },
    // 相邻级节点间的水平缩进，单位为像素
    indent: {
      type: Number,
      default: 16,
    },
    // 	自定义树节点的图标
    iconClass: String,
    // 是否开启拖拽节点功能
    draggable: Boolean,
    // 判断节点能否被拖拽
    allowDrag: Function,
    // 拖拽时判定目标节点能否被放置
    allowDrop: Function,
  },
  computed: {
    // 穿梭框模式
    isComponent() {
      return this.mode == "transfer" ? "ComponentTransfer" : "ComponentAddress";
    },
  },
  methods: {
    handleAddBtn(fromData, toData, obj) {
      this.$emit("add-btn", fromData, toData, obj);
    },
    handleRemoveBtn(fromData, toData, obj) {
      this.$emit("remove-btn", fromData, toData, obj);
    },
    handleLeftCheckChange(nodeObj, treeObj, checkAll) {
      this.$emit("left-check-change", nodeObj, treeObj, checkAll);
    },
    handleRightCheckChange(nodeObj, treeObj, checkAll) {
      this.$emit("right-check-change", nodeObj, treeObj, checkAll);
    },
    handleNodeDragStart(type, node, dragEvent) {
      this.$emit("node-drag-start", type, node, dragEvent);
    },
    handleNodeDragEnter(type, node, target, dragEvent) {
      this.$emit("node-drag-enter", type, node, target, dragEvent);
    },
    handleNodeDragLeave(type, node, leaved, dragEvent) {
      this.$emit("node-drag-leave", type, node, leaved, dragEvent);
    },
    handleNodeDragOver(type, node, leaved, dragEvent) {
      this.$emit("node-drag-over", type, node, leaved, dragEvent);
    },
    handleNodeDragEnd(type, node, target, location, dragEvent) {
      this.$emit("node-drag-end", type, node, target, location, dragEvent);
    },
    handleNodeDrop(type, node, target, location, dragEvent) {
      this.$emit("node-drop", type, node, target, location, dragEvent);
    },
    /**
     * @name 手动调用穿梭
     * @param {Boolean} useCallBack 是否需要出发emit回调事件
     */
    addToAims(useCallBack) {
      this.$refs["wl-transfer-component"].addToAims(useCallBack);
    },
    /**
     * @name 清空选中节点
     * @param {String} type left左边 right右边 all全部 默认all
     */
    clearChecked(type = "all") {
      this.$refs["wl-transfer-component"].clearChecked(type);
    },
    /**
     * @name 获取选中数据
     */
    getChecked() {
      this.$refs["wl-transfer-component"].getChecked();
    },
    /**
     * @name 设置选中数据
     * @param {Array} leftKeys 左侧ids
     * @param {Array} rightKeys 右侧ids
     */
    setChecked(leftKeys = [], rightKeys = []) {
      this.$refs["wl-transfer-component"].setChecked(leftKeys, rightKeys);
    },
  },
};
</script>

<style lang="scss">
.wl-transfer {
  position: relative;
  overflow: hidden;

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .transfer-left {
    position: absolute;
    top: 0;
    left: 0;
  }

  .transfer-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  .transfer-right-item {
    height: calc((100% - 41px) / 2);
  }

  .transfer-right-small {
    height: 41px;
  }

  .transfer-right-only {
    height: 100%;
  }

  .transfer-main {
    padding: 10px;
    height: calc(100% - 41px);
    box-sizing: border-box;
    overflow: auto;
  }

  .transfer-left,
  .transfer-right {
    border: 1px solid #ebeef5;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .transfer-center {
    position: absolute;
    top: 50%;
    left: 40%;
    width: 20%;
    transform: translateY(-50%);
    text-align: center;
  }

  .transfer-center-item {
    padding: 10px;
    overflow: hidden;
  }

  .address-list-center {
    height: 100%;
  }

  .address-list-center > .transfer-center-item {
    height: 50%;
    padding: 70px 10px 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .address-list-center > .address-only-item {
    height: 100%;
    position: relative;
  }

  .address-only-item > .address-first-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .transfer-title {
    border-bottom: 1px solid #ebeef5;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    background-color: #f5f7fa;
  }

  .transfer-title .el-checkbox {
    margin-right: 10px;
  }

  .filter-tree {
    margin-bottom: 10px;
  }

  .address-list-ul {
    padding-bottom: 20px;
  }

  .address-list-li {
    position: relative;
    padding: 4px 24px 4px 4px;
    border-radius: 3px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }

  .address-list-li:hover {
    background-color: #f5f7fa;
  }

  .address-list-li:hover .address-list-del {
    display: block;
  }

  .address-list-del {
    display: none;
    position: absolute;
    top: 50%;
    right: 2px;
    margin-top: -10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    text-align: center;
    background-color: #fef0f0;
    color: #f56c6c;
    cursor: pointer;
  }

  .u-clear {
    float: right;
    color: #67c23a;
    font-size: 14px;
    cursor: pointer;
  }

  .move_up_img {
    float: right;
    margin-top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .move_down_img {
    transform: rotate(180deg);
  }
}
</style>
