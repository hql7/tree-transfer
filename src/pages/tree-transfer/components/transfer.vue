<template>
  <div class="component-transfer">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <el-checkbox
          :indeterminate="fromIsIndeterminate"
          v-model="fromCheckAll"
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
          :default-expanded-keys="fromExpandedKeys"
          @check="fromTreeChecked"
          @node-drag-start="nodeDragStartLeft"
          @node-drag-enter="nodeDragEnterLeft"
          @node-drag-leave="nodeDragLeaveLeft"
          @node-drag-over="nodeDragOverLeft"
          @node-drag-end="nodeDragEndLeft"
          @node-drop="nodeDropLeft"
        >
          <template class="custom-tree-node" #default="{ node, data }">
            <slot name="content-left" :node="node" :data="data">
              <span>{{ node.label }}</span>
            </slot>
          </template>
        </el-tree>
        <slot name="left-footer"></slot>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center">
      <template v-if="button_text">
        <p class="transfer-center-item">
          <el-button
            type="primary"
            @click="addToAims(true)"
            :disabled="from_disabled"
          >
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
          <template class="custom-tree-node" #default="{ node, data }">
            <slot name="content-right" :node="node" :data="data">
              <span>{{ node.label }}</span>
            </slot>
          </template>
        </el-tree>
        <slot name="right-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { arrayToTree, flattenDeep } from "wl-core";
import { differenceBy } from "lodash";
import { findParents } from "../utils/index";

export default defineComponent({
  name: "TreeTransfer",
  props: {
    // 标题
    title: {
      type: Array,
      default: () => ["源列表", "目标列表"]
    },
    // 穿梭按钮名字
    buttonText: Array,
    // 源数据
    fromData: {
      type: Array,
      default: () => []
    },
    // 选中数据
    toData: {
      type: Array,
      default: () => []
    },
    // el-tree 配置项
    defaultProps: Object,
    // el-tree node-key 必须唯一
    nodeKey: {
      type: String,
      default: "id"
    },
    // 自定义 pid参数名
    pid: {
      type: String,
      default: "pid"
    },
    // 自定义根节点pid的值，用于结束递归
    rootPidValue: {
      type: [String, Number],
      default: 0
    },
    // 是否启用筛选
    filter: {
      type: Boolean,
      default: false
    },
    // 是否展开所有节点
    openAll: {
      type: Boolean,
      default: false
    },
    // 左侧自定义树节点
    renderContentLeft: Function,
    // 右侧自定义树节点
    renderContentRight: Function,
    // 穿梭后是否展开节点
    transferOpenNode: {
      type: Boolean,
      default: true
    },
    // 源数据 默认选中节点
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    // 源数据 默认展开节点
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    // 筛选placeholder
    placeholder: {
      type: String,
      default: "输入关键字进行过滤"
    },
    // 自定义筛选函数
    filterNode: Function,
    // 默认穿梭一次默认选中数据
    defaultTransfer: {
      type: Boolean,
      default: false
    },
    // 是否开启arrayToTree
    arrayToTree: {
      type: Boolean,
      default: false
    },
    // 是否启用懒加载
    lazy: {
      type: Boolean,
      default: false
    },
    // 是否右侧树也启用懒加载
    lazyRight: {
      type: Boolean,
      default: false
    },
    // 懒加载的回调函数
    lazyFn: Function,
    // 是否高亮当前选中节点，默认值是 false。
    highLight: {
      type: Boolean,
      default: false
    },
    // 是否遵循父子不关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 父子不关联模式
    checkStrictlyType: {
      type: String,
      default: "authorization",
      validator: function(value: string) {
        /**
         * @name 父子不关联的三种模式，第一种适合业务授权场景，后两种不存在快速选中需要手选
         * @param authorization授权模式：左侧选择子节点自动带着父节点；右侧选择父节点自动带着子节点；此模式两侧可能存在相同的非叶子节点
         * @param puppet木偶模式：纯父子不关联穿梭，但要保持完整的树形结构，只自动带上穿梭到对面拼接所需的骨架结构；此模式两侧可能存在相同的非叶子节点
         * @param modular积木模式：纯父子不关联穿梭，也不保持完整的树形结构，像积木一样右侧要形成树形则需要把左侧拆除，左侧拆的越多右侧形成的树结构越完整；此模式左右两侧保证严格的唯一性
         */
        return ["authorization", "puppet", "modular"].indexOf(value) !== -1;
      }
    },
    // 是否每次只打开一个同级树节点
    accordion: {
      type: Boolean,
      default: false
    },
    // 是否在第一次展开某个树节点后才渲染其子节点
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    // 是否在点击节点的时候展开或者收缩节点
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    // 是否在点击节点的时候选中节点
    checkOnClickNode: {
      type: Boolean,
      default: false
    },
    // 相邻级节点间的水平缩进，单位为像素
    indent: {
      type: Number,
      default: 16
    },
    // 	自定义树节点的图标
    iconClass: String,
    // 是否开启拖拽节点功能
    draggable: Boolean,
    // 判断节点能否被拖拽
    allowDrag: Function,
    // 拖拽时判定目标节点能否被放置
    allowDrop: Function
  },
  setup() {
    // 源数据是否半选
    const fromIsIndeterminate = ref(false);
    // 源数据是否全选
    const fromCheckAll = ref(false);
    // 源数据展开节点
    const fromExpandedKeys = reactive([]);
    return { fromIsIndeterminate, fromCheckAll, fromExpandedKeys };
  }
});
</script>

<style lang="scss"></style>
