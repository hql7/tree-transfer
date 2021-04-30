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
          :data="self_from_data"
          :accordion="accordion"
          :props="selfDefaultProps"
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
          :load="rightloadNode"
          :props="selfDefaultProps"
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
import { arrayToTree, flattenDeep } from "wl-core";
import { differenceBy } from "lodash";
import { findParents } from "../assets/js";

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
         * @param modular积木模式：纯父子不关联穿梭，也不保持完整的树形结构，像积木一样右侧要形成树形则需要把左侧拆除，左侧拆的越多右侧形成的树结构越完整；此模式左右两侧保证严格的唯一性
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
  data() {
    return {
      from_is_indeterminate: false, // 源数据是否半选
      from_check_all: false, // 源数据是否全选
      from_expanded_keys: [], // 源数据展开节点
      from_disabled: true, // 添加按钮是否禁用
      from_check_keys: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      from_array_clone: [], // 左侧数据一维化后存储为json格式
      to_check_all: false, // 目标数据是否全选
      to_is_indeterminate: false, // 目标数据是否半选
      to_expanded_keys: [], // 目标数据展开节点
      to_disabled: true, // 移除按钮是否禁用
      to_check_keys: [], // 目标数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      to_array_clone: [], // 右侧数据一维化后存储为json格式
      filterFrom: "", // 源数据筛选
      filterTo: "", // 目标数据筛选
      strictly_parents: [], // 当使用父子不关联时，将左侧数据向右侧移动时，为了保证在右侧能形成树结构，必须将父节点也移动
      strictly_transferred: [], // 父子不关联时已经穿梭过的节点记录，用于第一次拼接父节点穿梭后，其他子节点不再拼接父节点
    };
  },
  computed: {
    // 左侧数据
    self_from_data() {
      const _form_data = !this.arrayToTree
        ? this.from_data
        : arrayToTree(this.from_data, {
            id: this.node_key,
            pid: this.pid,
            children: this.selfDefaultProps.children,
          });
      if (this.checkStrictly) {
        this.from_array_clone = flattenDeep(_form_data, this.selfDefaultProps.children);
      }
      return _form_data;
    },
    // 右侧数据
    self_to_data() {
      const _to_data = !this.arrayToTree
        ? this.to_data
        : arrayToTree(this.to_data, {
            id: this.node_key,
            pid: this.pid,
            children: this.selfDefaultProps.children,
          });
      if (this.checkStrictly) {
        this.to_array_clone = flattenDeep(_to_data, this.selfDefaultProps.children);
      }
      return _to_data;
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
      if (Array.isArray(this.button_text)) {
        return this.button_text[0];
      }
      return "";
    },
    // 下部按钮名
    toButton() {
      if (Array.isArray(this.button_text)) {
        return this.button_text[1];
      }
      return "";
    },
    // 配置项
    selfDefaultProps() {
      return {
        label: "label",
        children: "children",
        ...this.defaultProps,
      };
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
        let allCheck = false;
        if (!this.checkStrictly) {
          const roots = val.filter((item) => item[this.pid] === this.rootPidValue);
          allCheck = roots.length === this.self_from_data.length;
        } else {
          allCheck = val.length === this.from_array_clone.length;
        }
        if (allCheck) {
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
        let allCheck = false;
        if (!this.checkStrictly) {
          const roots = val.filter((item) => item[this.pid] === this.rootPidValue);
          allCheck = roots.length === this.self_to_data.length;
        } else {
          allCheck = val.length === this.to_array_clone.length;
        }
        if (allCheck) {
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
      let start = new Date().valueOf();
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["from-tree"].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let harfKeys = this.$refs["from-tree"].getHalfCheckedKeys();
      // 选中节点数据
      let arrayCheckedNodes = this.$refs["from-tree"].getCheckedNodes();
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["from-tree"].getHalfCheckedNodes();
      // 自定义参数读取设置
      let children__ = this.selfDefaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";
      let root__ = this.rootPidValue || 0;
      // 将目标侧数据拉平为一维数组，查询速度比每个节点去目标侧递归查询快
      this.to_array_clone = flattenDeep(
        this.self_to_data,
        this.selfDefaultProps.children
      );

      // 父子不关联的写法
      if (this.checkStrictly) {
        this.from_array_clone = flattenDeep(
          this.self_from_data,
          this.selfDefaultProps.children
        );
        // 清空由左向右移动时自动补充的父节点
        this.strictly_parents = [];
        this.checkStrictlyAdd(arrayCheckedNodes, { children__, pid__, id__, root__ });
      } else {
        // 第一步：排除在对面已经存在的半选节点，然后将需穿梭半选节点的children设置为[]并穿梭;
        arrayHalfCheckedNodes.forEach((i) => {
          let harfInTarget = this.to_array_clone.some((t) => t[id__] === i[id__]);
          if (harfInTarget) return;
          let _parent = root__ !== i[pid__] ? i[pid__] : null;
          this.$refs["to-tree"].append(
            Object.assign({}, i, {
              [children__]: [],
            }),
            _parent
          );
        });
        // 第二步：先将对面存在的节点抛弃
        let notInTargetNodes = differenceBy(arrayCheckedNodes, this.to_array_clone, id__);
        // 第三步：若a节点的父节点也在选中节点中，则将a节点也抛弃，最后将剩余的节点穿梭
        notInTargetNodes.forEach((i) => {
          let parentInHere = notInTargetNodes.some((t) => t[id__] === i[pid__]);
          if (parentInHere) return;
          let _parent = root__ !== i[pid__] ? i[pid__] : null;
          this.$refs["to-tree"].append(i, _parent);
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
      const all_move_nodes = [...arrayCheckedNodes, ...this.strictly_parents];

      emit &&
        this.$emit("add-btn", this.self_from_data, this.self_to_data, {
          keys,
          nodes: all_move_nodes,
          harfKeys,
          halfNodes: arrayHalfCheckedNodes,
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
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["to-tree"].getHalfCheckedNodes();
      // 自定义参数读取设置
      let children__ = this.selfDefaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";
      let root__ = this.rootPidValue || 0;
      // 将目标侧数据拉平为一维数组，查询速度比每个节点去目标侧递归查询快
      this.from_array_clone = flattenDeep(
        this.self_from_data,
        this.selfDefaultProps.children
      );

      // 父子不关联的写法
      if (this.checkStrictly) {
        this.to_array_clone = flattenDeep(
          this.self_to_data,
          this.selfDefaultProps.children
        );

        this.checkStrictlyRemove(arrayCheckedNodes, { children__, pid__, id__, root__ });
      } else {
        // 第一步：排除在对面已经存在的半选节点，然后将需穿梭半选节点的children设置为[]并穿梭;
        arrayHalfCheckedNodes.forEach((i) => {
          let harfInTarget = this.from_array_clone.some((t) => t[id__] === i[id__]);
          if (harfInTarget) return;
          let _parent = root__ !== i[pid__] ? i[pid__] : null;
          this.$refs["from-tree"].append(
            Object.assign({}, i, {
              [children__]: [],
            }),
            _parent
          );
        });
        // 第二步：先将对面存在的节点抛弃
        let notInTargetNodes = differenceBy(
          arrayCheckedNodes,
          this.from_array_clone,
          id__
        );
        // 第三步：若a节点的父节点也在选中节点中，则将a节点也抛弃，最后将剩余的节点穿梭
        notInTargetNodes.forEach((i) => {
          let parentInHere = notInTargetNodes.some((t) => t[id__] === i[pid__]);
          if (parentInHere) return;
          let _parent = root__ !== i[pid__] ? i[pid__] : null;
          this.$refs["from-tree"].append(i, _parent);
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
        nodes: arrayCheckedNodes,
        harfKeys,
        halfNodes: arrayHalfCheckedNodes,
      });
      // 处理完毕取消选中
      this.$refs["to-tree"].setCheckedKeys([]);
    },
    /**
     * @name 父子不关联-授权模式的add
     * @param {Array} nodes 选中节点
     * @param {Object} options 配置项{ children__, pid__, id__, root__ }
     */
    checkStrictlyAdd(nodes, options) {
      // 第一步：将对面存在的节点抛弃
      let notInTargetNodes = differenceBy(nodes, this.to_array_clone, options.id__);
      // 第一步：整理选中数据，不知道子节点是都都选中，先将子节点都置空，下一步再组装避免判断每个节点的的子节点应不应该穿梭
      const new_nodes = notInTargetNodes.map((i) => {
        let new_node = Object.assign({}, i, {
          [options.children__]: [],
        });
        return new_node;
      });
      // 第三步：组装能选中数据中能父子关联的，将子节点插入父节点后只需穿梭父节点
      const assembly_data = new_nodes.reduce((pre, item, idx, arr) => {
        const find_parent = arr.find((i) => i[options.id__] == item[options.pid__]);
        // 没找到父节点，将节点保留
        if (!find_parent) return pre.concat(item);
        // 找到父节点的，将节点推入父节点的children，不保留此节点
        find_parent[options.children__].push(item);
        return pre;
      }, []);
      // 第四步：穿梭组装好的数据
      assembly_data.forEach((i) => {
        this.$refs["to-tree"].append(i, i[options.pid__]);
      });
      // 第五步：移除叶子节点，移除后全选的父节点没了子节点自己也变成了叶子节点，继续移除
      this.loopRemoveCheckedLeafNodes(options);
    },
    // 一直移除左侧选中叶子节点，直到选中节点中不再有叶子节点
    loopRemoveCheckedLeafNodes(options) {
      const leafNodes = this.$refs["from-tree"].getCheckedNodes(true);
      if (!leafNodes.length) return;
      for (const i of leafNodes) {
        this.$refs["from-tree"].remove(i);
      }
      this.loopRemoveCheckedLeafNodes(options);
    },
    /**
     * @name 父子不关联-授权模式的remove
     * @param {Array} nodes 选中节点
     * @param {Object} options 配置项{ children__, pid__, id__, root__ }
     */
    checkStrictlyRemove(nodes, options) {
      // 第一步：将对面存在的节点抛弃
      let notInTargetNodes = differenceBy(nodes, this.from_array_clone, options.id__);
      // 第一步：整理选中数据，不知道子节点是都都选中，先将子节点都置空，下一步再组装避免判断每个节点的的子节点应不应该穿梭
      const new_nodes = notInTargetNodes.map((i) => {
        let new_node = Object.assign({}, i, {
          [options.children__]: [],
          __childrenLength: Array.isArray(i[options.children__])
            ? i[options.children__].length
            : 0,
        });
        return new_node;
      });
      // 第三步：组装能选中数据中能父子关联的，将子节点插入父节点后只需穿梭父节点
      const assembly_data = new_nodes.reduce((pre, item, idx, arr) => {
        const find_parent = arr.find((i) => i[options.id__] == item[options.pid__]);
        // 没找到父节点，将节点保留
        if (!find_parent) return pre.concat(item);
        // 找到父节点的，将节点推入父节点的children，不保留此节点
        find_parent[options.children__].push(item);
        return pre;
      }, []);
      // 第四步：穿梭组装好的数据
      assembly_data.forEach((i) => {
        this.deepFindParent(i, options);
      });
      // 第五步：移除本侧选中节点
      nodes.forEach((i) => {
        this.$refs["to-tree"].remove(i);
      });
    },
    // 递归查找对面存在能穿梭的父节点
    deepFindParent(node, options) {
      if (node[options.pid__] === options.root__) {
        this.$refs["from-tree"].append(node);
        return;
      }
      const parentInThere = this.from_array_clone.some(
        (i) => i[options.id__] === node[options.pid__]
      );
      if (parentInThere) {
        this.$refs["from-tree"].append(node, node[options.pid__]);
      } else {
        const parentHere = this.to_array_clone.find(
          (i) => i[options.id__] === node[options.pid__]
        );
        const _parent = Object.assign({}, parentHere, { [options.children__]: [node] });
        this.deepFindParent(_parent, options);
      }
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
      // 父子不关联-授权模式
      if (
        this.checkStrictly &&
        this.checkStrictlyType == "authorization" &&
        this.from_check_keys.some((i) => i[this.node_key] === nodeObj[this.node_key])
      ) {
        this.authorizationAutoCheckLeft(nodeObj);
      }
      this.$nextTick(() => {
        this.$emit("left-check-change", nodeObj, treeObj, this.from_check_all);
      });
    },
    // 父子不关联-授权模式-左侧选中子节点自动选中父节点
    authorizationAutoCheckLeft(node) {
      // 查询所有父节点
      const parents = findParents(node, this.from_array_clone, {
        id: this.node_key,
        parentId: this.pid,
        // children: this.selfDefaultProps.children,
        root: this.rootPidValue,
      });
      if (!parents.length) return;
      // 过滤掉已经选中过的父节点
      const autoAddParents = differenceBy(parents, this.from_check_keys, this.node_key);
      autoAddParents.forEach((i) => {
        this.$refs["from-tree"].setChecked(i, true);
        this.from_check_keys.push(i);
      });
    },
    // 目标树选中事件 - 是否禁用穿梭按钮
    toTreeChecked(nodeObj, treeObj) {
      this.to_check_keys = treeObj.checkedNodes;
      // 父子不关联-授权模式
      if (
        this.checkStrictly &&
        this.checkStrictlyType == "authorization" &&
        this.to_check_keys.some((i) => i[this.node_key] === nodeObj[this.node_key])
      ) {
        this.authorizationAutoCheckRight(nodeObj);
      }
      this.$nextTick(() => {
        this.$emit("right-check-change", nodeObj, treeObj, this.to_check_all);
      });
    },
    // 父子不关联-授权模式-右侧选中父节点自动选中子节点
    authorizationAutoCheckRight(nodeObj) {
      // 查询所有子节点
      const children = flattenDeep([nodeObj], this.selfDefaultProps.children);
      if (!children.length) return;
      // 过滤掉已经选中过的子节点
      const autoAddChildren = differenceBy(children, this.to_check_keys, this.node_key);
      autoAddChildren.forEach((i) => {
        this.to_check_keys.push(i);
        this.$refs["to-tree"].setChecked(i, true);
      });
    },
    // 源数据 总全选checkbox
    fromAllBoxChange(val) {
      if (!this.self_from_data.length) return;
      if (val) {
        this.from_check_keys = this.checkStrictly
          ? flattenDeep(this.self_from_data, this.selfDefaultProps.children)
          : this.self_from_data;
        this.$refs["from-tree"].setCheckedNodes(this.from_check_keys);
      } else {
        this.$refs["from-tree"].setCheckedNodes([]);
        this.from_check_keys = [];
      }
      this.$emit("left-check-change", null, null, this.from_check_all);
    },
    // 目标数据 总全选checkbox
    toAllBoxChange(val) {
      if (!this.self_to_data.length) return;
      if (val) {
        this.to_check_keys = this.checkStrictly
          ? flattenDeep(this.self_to_data, this.selfDefaultProps.children)
          : this.self_to_data;
        this.$refs["to-tree"].setCheckedNodes(this.to_check_keys);
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
      return data[this.selfDefaultProps.label].indexOf(value) !== -1;
    },
    // 目标数据筛选
    filterNodeTo(value, data) {
      if (this.filterNode) {
        return this.filterNode(value, data, "to");
      }
      if (!value) return true;
      return data[this.selfDefaultProps.label].indexOf(value) !== -1;
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
    /**
     * @name 父子不关联的穿梭
     * @param {Array} nodes 移动的节点信息
     * @param {Object} options 字段名配置项{ children__, pid__, id__, root__ }
     * @param {Boolean} isAdd 是add还是remove
     */
    /* checkStrictlyTransfer(nodes, options, isAdd) {
      this.strictly_transferred = [];
      // 根据添加|移除穿梭操作来分配源数据
      let from_data = [];
      let to_data = [];
      let from_ref = "";
      let to_ref = "";
      if (isAdd) {
        from_data = this.from_array_clone;
        to_data = this.to_array_clone;
        from_ref = "from-tree";
        to_ref = "to-tree";
      } else {
        from_data = this.to_array_clone;
        to_data = this.from_array_clone;
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
        const inThere = to_data.some((t) => t[options.id__] === i[options.id__]);
        if (inThere) {
          // 当此节点是叶子节点时，删除此节点
          if (!i.__childrenLength) {
            this.$refs[from_ref].remove(i);
          }
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
    }, */
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
    /* findParentInTarget(item, options, from_data, to_data, from_ref, to_ref, isAdd) {
      // 父节点在对面或者本轮刚把它的父节点穿梭过了，则此节点直接穿梭
      const parentInThere = to_data.some((t) => t[options.id__] === item[options.pid__]);
      const parentTransferred = this.strictly_transferred.some(
        (t) => t[options.id__] === item[options.pid__]
      );
      if (parentInThere || parentTransferred) {
        this.$refs[to_ref].append(item, item[options.pid__]);
        // 当是授权时，如果父节点下子节点已经穿梭空，则把父节点移除
        if (!isAdd) return;
        const parent_node = from_data.find(
          (t) => t[options.id__] === item[options.pid__]
        );
        if (!parent_node) return;
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
      const parent_node = from_data.find((t) => t[options.id__] === item[options.pid__]);
      const _parent_node = Object.assign({}, parent_node, {
        [options.children__]: [item],
      });
      // 当授权时既然要在右边出现，必然需要左侧父节点，而删除授权时，移除子权限并不代表想移除父权限
      if (isAdd) {
        this.strictly_parents.push(item);
      }
      // 将之前没有的，本轮穿梭过的父节点收集起来，其他子节点不需要再往这个父节点找
      this.strictly_transferred.push(_parent_node);
      this.findParentInTarget(
        _parent_node,
        options,
        from_data,
        to_data,
        from_ref,
        to_ref,
        isAdd
      );
    }, */
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
      this.from_disabled = leftKeys.length<=0;
      this.to_disabled = rightKeys.length<=0;
      this.$refs["from-tree"].setCheckedKeys(leftKeys);
      this.$refs["to-tree"].setCheckedKeys(rightKeys);
    },
    /**
     * @name 清除搜索条件
     * @param {String} type left左边 right右边 all全部 默认all
     */
    clearFilter(type = "all") {
      if (type === "left") {
        this.filterFrom = "";
      } else if (type === "right") {
        this.filterTo = "";
      } else {
        this.filterFrom = "";
        this.filterTo = "";
      }
    },
  },
};
</script>
