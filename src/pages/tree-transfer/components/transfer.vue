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
import { defineComponent, ref } from "vue";
// import { arrayToTree, flattenDeep } from "wl-core";
// import { differenceBy } from "lodash";
// import { findParents } from "../utils/index";

export default defineComponent({
  name: "TreeTransfer",
  components: {},
  setup() {
    return {};
  },
});

</script>

<style lang="scss"></style>
