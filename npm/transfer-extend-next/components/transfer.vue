<template>
  <div class="component-transfer">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <el-checkbox
          :indeterminate="from_is_indeterminate"
          v-model="from_check_all"
          @change="fromAllBoxChange"
        ></el-checkbox>
        <span>{{ fromTitle }}</span>
        <slot name="title-left"></slot>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <slot name="from"></slot>
        <el-input
          v-if="filter"
          clearable
          size="small"
          :placeholder="placeholder"
          v-model="filterFrom"
          class="filter-tree"
        ></el-input>
        <el-tree
          ref="from-tree"
          show-checkbox
          :lazy="lazy"
          :indent="indent"
          :draggable="draggable"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :icon-class="iconClass"
          :node-key="node_key"
          :load="leftloadNode"
          :props="defaultProps"
          :data="self_from_data"
          :accordion="accordion"
          :default-expand-all="openAll"
          :highlight-current="highLight"
          :check-strictly="checkStrictly"
          :render-content="renderContentLeft"
          :filter-node-method="filterNodeFrom"
          :check-on-click-node="checkOnClickNode"
          :render-after-expand="renderAfterExpand"
          :expand-on-click-node="expandOnClickNode"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="from_expanded_keys"
          @check="fromTreeChecked"
          @node-drag-start="nodeDragStartLeft"
          @node-drag-enter="nodeDragEnterLeft"
          @node-drag-leave="nodeDragLeaveLeft"
          @node-drag-over="nodeDragOverLeft"
          @node-drag-end="nodeDragEndLeft"
          @node-drop="nodeDropLeft"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <slot name="content-left" :node="node" :data="data">
              <span>{{ node.label }}</span>
            </slot>
          </span>
        </el-tree>
        <slot name="left-footer"></slot>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center">
      <template v-if="button_text">
        <p class="transfer-center-item">
          <el-button type="primary" @click="addToAims(true)" :disabled="from_disabled">
            {{ fromButton || "添加" }}
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </p>
        <p class="transfer-center-item">
          <el-button
            type="primary"
            @click="removeToSource"
            :disabled="to_disabled"
            icon="el-icon-arrow-left"
            >{{ toButton || "移除" }}</el-button
          >
        </p>
      </template>
      <template v-else>
        <p class="transfer-center-item">
          <el-button
            type="primary"
            @click="addToAims(true)"
            icon="el-icon-arrow-right"
            circle
            :disabled="from_disabled"
          ></el-button>
        </p>
        <p class="transfer-center-item">
          <el-button
            type="primary"
            @click="removeToSource"
            :disabled="to_disabled"
            icon="el-icon-arrow-left"
            circle
          ></el-button>
        </p>
      </template>
    </div>
    <!-- 右侧穿梭框 目标框 -->
    <div class="transfer-right">
      <h3 class="transfer-title">
        <el-checkbox
          :indeterminate="to_is_indeterminate"
          v-model="to_check_all"
          @change="toAllBoxChange"
        ></el-checkbox>
        <span>{{ toTitle }}</span>
        <slot name="title-right"></slot>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <slot name="to"></slot>
        <el-input
          v-if="filter"
          clearable
          size="small"
          v-model="filterTo"
          :placeholder="placeholder"
          class="filter-tree"
        ></el-input>
        <el-tree
          slot="to"
          ref="to-tree"
          show-checkbox
          :indent="indent"
          :draggable="draggable"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :icon-class="iconClass"
          :lazy="lazyRight"
          :data="self_to_data"
          :node-key="node_key"
          :props="defaultProps"
          :load="rightloadNode"
          :default-expand-all="openAll"
          :highlight-current="highLight"
          :check-strictly="checkStrictly"
          :filter-node-method="filterNodeTo"
          :render-content="renderContentRight"
          :check-on-click-node="checkOnClickNode"
          :render-after-expand="renderAfterExpand"
          :expand-on-click-node="expandOnClickNode"
          :default-expanded-keys="to_expanded_keys"
          @check="toTreeChecked"
          @node-drag-start="nodeDragStartRight"
          @node-drag-enter="nodeDragEnterRight"
          @node-drag-leave="nodeDragLeaveRight"
          @node-drag-over="nodeDragOverRight"
          @node-drag-end="nodeDragEndRight"
          @node-drop="nodeDropRight"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <slot name="content-right" :node="node" :data="data">
              <span>{{ node.label }}</span>
            </slot>
          </span>
        </el-tree>
        <slot name="right-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { arrayToTree, valInDeep } from "wl-core";

export default {
  name: "TransferTree",
  props: {
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
  data() {
    return {
      from_is_indeterminate: false, // 源数据是否半选
      from_check_all: false, // 源数据是否全选
      to_is_indeterminate: false, // 目标数据是否半选
      to_check_all: false, // 目标数据是否全选
      from_expanded_keys: [], // 源数据展开节点
      to_expanded_keys: [], // 目标数据展开节点
      from_disabled: true, // 添加按钮是否禁用
      to_disabled: true, // 移除按钮是否禁用
      from_check_keys: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      to_check_keys: [], // 目标数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      filterFrom: "", // 源数据筛选
      filterTo: "", // 目标数据筛选
    };
  },
  computed: {
    // 左侧数据
    self_from_data() {
      let from_array = [...this.from_data];
      return !this.arrayToTree
        ? from_array
        : arrayToTree(from_array, {
            id: this.node_key,
            pid: this.pid,
            children: this.defaultProps.children,
          });
    },
    // 右侧数据
    self_to_data() {
      let to_array = [...this.to_data];
      return !this.arrayToTree
        ? to_array
        : arrayToTree(to_array, {
            id: this.node_key,
            pid: this.pid,
            children: this.defaultProps.children,
          });
    },
    // 左侧菜单名
    fromTitle() {
      let [text] = this.title;
      return text;
    },
    // 右侧菜单名
    toTitle() {
      let [, text] = this.title;
      return text;
    },
    // 上部按钮名
    fromButton() {
      if (this.button_text == undefined) {
        return;
      }

      let [text] = this.button_text;
      return text;
    },
    // 下部按钮名
    toButton() {
      if (this.button_text == undefined) {
        return;
      }
      let [, text] = this.button_text;
      return text;
    },
  },
  watch: {
    // 左侧 状态监测
    from_check_keys(val) {
      if (val.length > 0) {
        // 穿梭按钮是否禁用
        this.from_disabled = false;
        // 总半选是否开启
        this.from_is_indeterminate = true;

        // 总全选是否开启 - 根据选中节点中为根节点的数量是否和源数据长度相等
        let allCheck = val.filter((item) => item[this.pid] == 0);
        if (allCheck.length == this.self_from_data.length) {
          // 关闭半选 开启全选
          this.from_is_indeterminate = false;
          this.from_check_all = true;
        } else {
          this.from_is_indeterminate = true;
          this.from_check_all = false;
        }
      } else {
        this.from_disabled = true;
        this.from_is_indeterminate = false;
        this.from_check_all = false;
      }
    },
    // 右侧 状态监测
    to_check_keys(val) {
      if (val.length > 0) {
        // 穿梭按钮是否禁用
        this.to_disabled = false;
        // 总半选是否开启
        this.to_is_indeterminate = true;

        // 总全选是否开启 - 根据选中节点中为根节点的数量是否和源数据长度相等
        let allCheck = val.filter((item) => item[this.pid] == 0);
        if (allCheck.length == this.self_to_data.length) {
          // 关闭半选 开启全选
          this.to_is_indeterminate = false;
          this.to_check_all = true;
        } else {
          this.to_is_indeterminate = true;
          this.to_check_all = false;
        }
      } else {
        this.to_disabled = true;
        this.to_is_indeterminate = false;
        this.to_check_all = false;
      }
    },
    // 左侧 数据筛选
    filterFrom(val) {
      this.$refs["from-tree"].filter(val);
    },
    // 右侧 数据筛选
    filterTo(val) {
      this.$refs["to-tree"].filter(val);
    },
    // 监视默认选中
    defaultCheckedKeys: {
      handler(val) {
        this.from_check_keys = val || [];
        if (this.defaultTransfer && this.from_check_keys.length) {
          this.$nextTick(() => {
            this.addToAims(false);
          });
        }
      },
      immediate: true,
    },
    // 监视默认展开
    defaultExpandedKeys: {
      handler(val) {
        let _form = new Set(this.from_expanded_keys.concat(val));
        this.from_expanded_keys = [..._form];
        let _to = new Set(this.to_expanded_keys.concat(val));
        this.to_expanded_keys = [..._to];
      },
      immediate: true,
    },
  },
  methods: {
    // -------------------------------提供输出函数---------------------
    // 添加按钮
    addToAims(emit) {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["from-tree"].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let harfKeys = this.$refs["from-tree"].getHalfCheckedKeys();
      // 选中节点数据
      let arrayCheckedNodes = this.$refs["from-tree"].getCheckedNodes();
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = JSON.parse(JSON.stringify(arrayCheckedNodes));
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["from-tree"].getHalfCheckedNodes();
      // 获取半选通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let halfNodes = JSON.parse(JSON.stringify(arrayHalfCheckedNodes));
      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";
      let root__ = this.rootPidValue || 0;
      // let self__keys__ = []; // 当父子不关联时，收集穿梭子节点中，向上查询的到祖先节点，这些祖先节点肯定要穿梭到右侧
      // 父子不关联的写法
      if (this.checkStrictly) {
        // 清空由左向右移动时自动补充的父节点
        this.strictly_parents = [];
        this.checkStrictlyTransfer(
          arrayCheckedNodes,
          { children__, pid__, id__, root__ },
          true
        );
      } else {
        /*
         * 父子关联的写法
         * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
         * 再将所有末端叶子节点根据pid直接推入目标树即可
         * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
         * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
         */

        // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
        // let self_to_data = JSON.stringify(this.self_to_data);
        // 第一步
        let skeletonHalfCheckedNodes = JSON.parse(JSON.stringify(arrayHalfCheckedNodes)); // 深拷贝数据 - 半选节点
        // 筛选目标树不存在的骨架节点 - 半选内的节点
        let newSkeletonHalfCheckedNodes = [];
        skeletonHalfCheckedNodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_to_data, item[id__], id__, children__);
          if (!inThere.length) {
            newSkeletonHalfCheckedNodes.push(item);
          }
        });
        // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
        newSkeletonHalfCheckedNodes.forEach((item) => {
          item[children__] = [];
          root__ !== item[pid__]
            ? this.$refs["to-tree"].append(item, item[pid__])
            : this.$refs["to-tree"].append(item);
        });

        // 第二步
        // 筛选目标树不存在的骨架节点 - 全选内的节点
        let newSkeletonCheckedNodes = [];
        nodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_to_data, item[id__], id__, children__);
          if (!inThere.length) {
            newSkeletonCheckedNodes.push(item);
          }
        });
        // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
        newSkeletonCheckedNodes.forEach((item) => {
          if (item[children__] && item[children__].length > 0) {
            item[children__] = [];
            root__ !== item[pid__]
              ? this.$refs["to-tree"].append(item, item[pid__])
              : this.$refs["to-tree"].append(item);
          }
        });

        // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
        let leafCheckedNodes = arrayCheckedNodes.filter(
          (item) => !item[children__] || item[children__].length == 0
        );
        // 末端叶子插入目标树
        leafCheckedNodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_to_data, item[id__], id__, children__);
          if (!inThere.length) {
            this.$refs["to-tree"].append(item, item[pid__]);
          }
        });

        // 左侧删掉选中数据
        arrayCheckedNodes.map((item) => this.$refs["from-tree"].remove(item));
      }

      // 处理完毕按钮恢复禁用状态
      this.from_check_keys = [];
      // 清空对面选中
      this.$refs["to-tree"].setCheckedKeys([]);
      this.to_check_all = false;
      this.to_is_indeterminate = false;

      // 目标数据节点展开
      if (this.transferOpenNode && !this.lazy) {
        this.to_expanded_keys = keys;
      }

      // 传递信息给父组件
      const all_move_nodes = nodes.concat(this.strictly_parents);
      emit &&
        this.$emit("add-btn", this.self_from_data, this.self_to_data, {
          keys,
          all_move_nodes,
          harfKeys,
          halfNodes,
        });

      // 处理完毕取消选中
      this.$refs["from-tree"].setCheckedKeys([]);
    },
    // 移除按钮
    removeToSource() {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["to-tree"].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let harfKeys = this.$refs["to-tree"].getHalfCheckedKeys();
      // 获取选中通过穿梭框的nodes 选中节点数据
      let arrayCheckedNodes = this.$refs["to-tree"].getCheckedNodes();
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = JSON.parse(JSON.stringify(arrayCheckedNodes));
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["to-tree"].getHalfCheckedNodes();
      // 获取半选通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let halfNodes = JSON.parse(JSON.stringify(arrayHalfCheckedNodes));
      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";
      let root__ = this.rootPidValue || 0;
      // 父子不关联的写法
      if (this.checkStrictly) {
        this.checkStrictlyTransfer(
          arrayCheckedNodes,
          { children__, pid__, id__, root__ },
          false
        );
      } else {
        /*
         * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
         * 再将所有末端叶子节点根据pid直接推入目标树即可
         * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
         * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
         */

        // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
        // let self_from_data = JSON.stringify(this.self_from_data);
        // 第一步
        let skeletonHalfCheckedNodes = JSON.parse(JSON.stringify(arrayHalfCheckedNodes)); // 深拷贝数据 - 半选节点
        // 筛选目标树不存在的骨架节点 - 半选内的节点
        let newSkeletonHalfCheckedNodes = [];
        skeletonHalfCheckedNodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_from_data, item[id__], id__, children__);
          if (!inThere.length) {
            newSkeletonHalfCheckedNodes.push(item);
          }
        });
        // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
        newSkeletonHalfCheckedNodes.forEach((item) => {
          item[children__] = [];
          root__ !== item[pid__]
            ? this.$refs["from-tree"].append(item, item[pid__])
            : this.$refs["from-tree"].append(item);
        });

        // 第二步
        // 筛选目标树不存在的骨架节点 - 全选内的节点
        let newSkeletonCheckedNodes = [];
        nodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_from_data, item[id__], id__, children__);
          if (!inThere.length) {
            newSkeletonCheckedNodes.push(item);
          }
        });
        // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
        newSkeletonCheckedNodes.forEach((item) => {
          if (item[children__] && item[children__].length > 0) {
            item[children__] = [];
            root__ !== item[pid__]
              ? this.$refs["from-tree"].append(item, item[pid__])
              : this.$refs["from-tree"].append(item);
          }
        });

        // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
        let leafCheckedNodes = arrayCheckedNodes.filter(
          (item) => !item[children__] || item[children__].length == 0
        );
        // 末端叶子插入目标树
        leafCheckedNodes.forEach((item) => {
          // 判断目标是否已在对面存在
          let inThere = valInDeep(this.self_from_data, item[id__], id__, children__);
          if (!inThere.length) {
            this.$refs["from-tree"].append(item, item[pid__]);
          }
        });

        // 右侧删掉选中数据
        arrayCheckedNodes.map((item) => this.$refs["to-tree"].remove(item));
      }

      // 处理完毕按钮恢复禁用状态
      this.to_check_keys = [];
      // 清空对面选中
      this.$refs["from-tree"].setCheckedKeys([]);
      this.from_check_all = false;
      this.from_is_indeterminate = false;
      // 目标数据节点展开
      if (this.transferOpenNode && !this.lazy) {
        this.from_expanded_keys = keys;
      }

      // 传递信息给父组件
      this.$emit("remove-btn", this.self_from_data, this.self_to_data, {
        keys,
        nodes,
        harfKeys,
        halfNodes,
      });
      // 处理完毕取消选中
      this.$refs["to-tree"].setCheckedKeys([]);
    },
    /**
     * @name 父子不关联的穿梭
     * @param {Array} nodes 移动的节点信息
     * @param {Object} options 字段名配置项{ children__, pid__, id__, root__ }
     * @param {Boolean} isAdd 是add还是remove
     */
    checkStrictlyTransfer(nodes, options, isAdd) {
      // 根据添加|移除穿梭操作来分配源数据
      let from_data = [];
      let to_data = [];
      let from_ref = "";
      let to_ref = "";
      if (isAdd) {
        from_data = this.self_from_data;
        to_data = this.self_to_data;
        from_ref = "from-tree";
        to_ref = "to-tree";
      } else {
        from_data = this.self_to_data;
        to_data = this.self_from_data;
        from_ref = "to-tree";
        to_ref = "from-tree";
      }
      // 将数据转为新数据处理
      const new_nodes = nodes.map((i) => {
        let new_node = Object.assign({}, i, {
          [options.children__]: [],
          __childrenLength: Array.isArray(i[options.children__])
            ? i[options.children__].length
            : 0,
        });
        return new_node;
      });
      // 先组合选中节点中能拼接起来的父子节点
      const assembly_data = new_nodes.reduce((pre, item, idx, arr) => {
        const find_parent = arr.find((i) => i[options.id__] == item[options.pid__]);
        if (!find_parent) return pre.concat(item);
        Array.isArray(find_parent[options.children__])
          ? find_parent[options.children__].push(item)
          : (find_parent[options.children__] = [item]);
        return pre;
      }, []);
      // 准备处理数据
      assembly_data.forEach((i) => {
        // 查找此节点在对面是否存在，存在即退出此节点的处理
        const inThere = valInDeep(
          to_data,
          i[options.id__],
          options.id__,
          options.children__
        );
        if (inThere.length) {
          // 当此节点是叶子节点时，删除此节点
          this.$refs[from_ref].remove(i);
          return;
        }
        // 计算此节点的子节点有没有全部参与穿梭
        const children_num = Array.isArray(i[options.children__])
          ? i[options.children__].length
          : 0;
        const all_children_transfer = children_num === i.__childrenLength;
        delete i.__childrenLength;
        // 对面有此节点的父节点，直接插入到父节点;
        // 对面无此节点的父节点,从本测找父级再去查对面有没有，直到查到对面有此父级，或者找到本测根节点一起穿梭过去;
        this.findParentInTarget(i, options, from_data, to_data, from_ref, to_ref, isAdd);
        // 如果此节点所有子节点都参与本次穿梭，则此节点应从左侧移除
        if (all_children_transfer) {
          this.$refs[from_ref].remove(i);
        }
      });
    },
    /**
     * @name 根据节点找到对面存在的祖先节点，或者找到本测的根节点
     * @param {Object} item 当前节点
     * @param {options} options 字段名配置项{ children__, pid__, id__, root__ }
     * @param {Array} from_data 本侧数据
     * @param {Array} to_data 对侧数据
     * @param {String} from_ref 来源树dom
     * @param {String} to_ref 目标树dom
     * @param {Boolean} isAdd 是否添加
     */
    findParentInTarget(item, options, from_data, to_data, from_ref, to_ref, isAdd) {
      const parentInThere = valInDeep(
        to_data,
        item[options.pid__],
        options.id__,
        options.children__
      );
      // 父节点在对面直接穿梭
      if (parentInThere.length) {
        this.$refs[to_ref].append(item, item[options.pid__]);
        // 当是授权时，如果父节点下子节点已经穿梭空，则把父节点移除
        if (!isAdd) return;
        const [parent_node] = valInDeep(
          from_data,
          item[options.pid__],
          options.id__,
          options.children__
        );
        if (!parent_node || !Array.isArray(parent_node[options.children__])) return;
        this.$nextTick(() => {
          if (!parent_node[options.children__].length) {
            this.$refs[from_ref].remove(parent_node);
          }
        });
        return;
      }
      // 父节点不在对面
      // 当此节点是根节点时，直接穿梭
      if (item[options.pid__] === options.root__) {
        this.$refs[to_ref].append(item);
        return;
      }
      // 当此节点也不根节点，先从本侧数据找到父节点，再看父节点的pid是否在对面，或者直到找到根祖先直接穿梭
      const [parent_node] = valInDeep(
        from_data,
        item[options.pid__],
        options.id__,
        options.children__
      );
      const _parent_node = Object.assign({}, parent_node, {
        [options.children__]: [item],
      });
      // 当授权时既然要在右边出现，必然需要左侧父节点，而删除授权时，移除子权限并不代表想移除父权限
      if (isAdd) {
        this.strictly_parents.push(item);
        this.$refs[from_ref].remove(item);
      }
      this.findParentInTarget(
        _parent_node,
        options,
        from_data,
        to_data,
        from_ref,
        to_ref,
        isAdd
      );
    },
    // 异步加载左侧
    leftloadNode(node, resolve) {
      this.lazyFn && this.lazyFn(node, resolve, "left");
    },
    // 异步加载右侧
    rightloadNode(node, resolve) {
      this.lazyFn && this.lazyFn(node, resolve, "right");
    },
    // 源树选中事件 - 是否禁用穿梭按钮
    fromTreeChecked(nodeObj, treeObj) {
      this.from_check_keys = treeObj.checkedNodes;
      this.$nextTick(() => {
        this.$emit("left-check-change", nodeObj, treeObj, this.from_check_all);
      });
    },
    // 目标树选中事件 - 是否禁用穿梭按钮
    toTreeChecked(nodeObj, treeObj) {
      this.to_check_keys = treeObj.checkedNodes;
      this.$nextTick(() => {
        this.$emit("right-check-change", nodeObj, treeObj, this.to_check_all);
      });
    },
    // 源数据 总全选checkbox
    fromAllBoxChange(val) {
      if (this.self_from_data.length == 0) {
        return;
      }
      if (val) {
        this.from_check_keys = this.self_from_data;
        this.$refs["from-tree"].setCheckedNodes(this.self_from_data);
      } else {
        this.$refs["from-tree"].setCheckedNodes([]);
        this.from_check_keys = [];
      }
      this.$emit("left-check-change", null, null, this.from_check_all);
    },
    // 目标数据 总全选checkbox
    toAllBoxChange(val) {
      if (this.self_to_data.length == 0) {
        return;
      }
      if (val) {
        this.to_check_keys = this.self_to_data;
        this.$refs["to-tree"].setCheckedNodes(this.self_to_data);
      } else {
        this.$refs["to-tree"].setCheckedNodes([]);
        this.to_check_keys = [];
      }
      this.$emit("right-check-change", null, null, this.to_check_all);
    },
    // 源数据 筛选
    filterNodeFrom(value, data) {
      if (this.filterNode) {
        return this.filterNode(value, data, "form");
      }
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 目标数据筛选
    filterNodeTo(value, data) {
      if (this.filterNode) {
        return this.filterNode(value, data, "to");
      }
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 节点开始拖拽时触发的事件
    nodeDragStartLeft(node, dragEvent) {
      this.$emit("node-drag-start", "left", node, dragEvent);
    },
    // 拖拽进入其他节点时触发的事件
    nodeDragEnterLeft(node, target, dragEvent) {
      this.$emit("node-drag-enter", "left", node, target, dragEvent);
    },
    // 拖拽离开某个节点时触发的事件
    nodeDragLeaveLeft(node, leaved, dragEvent) {
      this.$emit("node-drag-leave", "left", node, leaved, dragEvent);
    },
    // 在拖拽节点时触发的事件
    nodeDragOverLeft(node, target, dragEvent) {
      this.$emit("node-drag-over", "left", node, target, dragEvent);
    },
    // 	拖拽结束时（可能未成功）触发的事件
    nodeDragEndLeft(node, target, location, dragEvent) {
      this.$emit("node-drag-end", "left", node, target, location, dragEvent);
    },
    // 拖拽成功完成时触发的事件
    nodeDropLeft(node, target, location, dragEvent) {
      this.$emit("node-drop", "left", node, target, location, dragEvent);
    },
    // 节点开始拖拽时触发的事件
    nodeDragStartRight(node, dragEvent) {
      this.$emit("node-drag-start", "right", node, dragEvent);
    },
    // 拖拽进入其他节点时触发的事件
    nodeDragEnterRight(node, target, dragEvent) {
      this.$emit("node-drag-enter", "right", node, target, dragEvent);
    },
    // 拖拽离开某个节点时触发的事件
    nodeDragLeaveRight(node, leaved, dragEvent) {
      this.$emit("node-drag-leave", "right", node, leaved, dragEvent);
    },
    // 在拖拽节点时触发的事件
    nodeDragOverRight(node, target, dragEvent) {
      this.$emit("node-drag-over", "right", node, target, dragEvent);
    },
    // 	拖拽结束时（可能未成功）触发的事件
    nodeDragEndRight(node, target, location, dragEvent) {
      this.$emit("node-drag-end", "right", node, target, location, dragEvent);
    },
    // 拖拽成功完成时触发的事件
    nodeDropRight(node, target, location, dragEvent) {
      this.$emit("node-drop", "right", node, target, location, dragEvent);
    },
    // 以下为提供方法 ----------------------------------------------------------------方法--------------------------------------
    /**
     * @name 清空选中节点
     * @param {String} type left左边 right右边 all全部 默认all
     */
    clearChecked(type = "all") {
      if (type === "left") {
        this.$refs["from-tree"].setCheckedKeys([]);
        this.from_is_indeterminate = false;
        this.from_check_all = false;
      } else if (type === "right") {
        this.$refs["to-tree"].setCheckedKeys([]);
        this.to_is_indeterminate = false;
        this.to_check_all = false;
      } else {
        this.$refs["from-tree"].setCheckedKeys([]);
        this.$refs["to-tree"].setCheckedKeys([]);
        this.from_is_indeterminate = false;
        this.from_check_all = false;
        this.to_is_indeterminate = false;
        this.to_check_all = false;
      }
    },
    /**
     * @name 获取选中数据
     */
    getChecked() {
      // 左侧选中信息
      let leftKeys = this.$refs["from-tree"].getCheckedKeys();
      let leftHarfKeys = this.$refs["from-tree"].getHalfCheckedKeys();
      let leftNodes = this.$refs["from-tree"].getCheckedNodes();
      let leftHalfNodes = this.$refs["from-tree"].getHalfCheckedNodes();
      // 右侧选中信息
      let rightKeys = this.$refs["to-tree"].getCheckedKeys();
      let rightHarfKeys = this.$refs["to-tree"].getHalfCheckedKeys();
      let rightNodes = this.$refs["to-tree"].getCheckedNodes();
      let rightHalfNodes = this.$refs["to-tree"].getHalfCheckedNodes();
      return {
        leftKeys,
        leftHarfKeys,
        leftNodes,
        leftHalfNodes,
        rightKeys,
        rightHarfKeys,
        rightNodes,
        rightHalfNodes,
      };
    },
    /**
     * @name 设置选中数据
     * @param {Array} leftKeys 左侧ids
     * @param {Array} rightKeys 右侧ids
     */
    setChecked(leftKeys = [], rightKeys = []) {
      this.$refs["from-tree"].setCheckedKeys(leftKeys);
      this.$refs["to-tree"].setCheckedKeys(rightKeys);
    },
  },
};
</script>
