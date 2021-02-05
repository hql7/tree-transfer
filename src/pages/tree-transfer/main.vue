<template>
  <div class="wl-transfer transfer" :style="{ width, height }">
    <component
      ref="wl-transfer-component"
      v-bind="$props"
      :is="activeComponent"
      @add-btn="handleAddBtn"
      @remove-btn="handleRemoveBtn"
    
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

<script lang="ts">
import { defineComponent, computed } from "vue";
import ComponentTransfer from "./components/transfer.vue";
import ComponentAddress from "./components/address.vue";
import { ITransferProps } from "./main.type";

export default defineComponent({
  name: "TreeTransfer",
  components: { ComponentTransfer, ComponentAddress },
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
    buttonText: Array,
    // 源数据
    fromData: {
      type: Array,
      default: () => [],
    },
    // 选中数据
    toData: {
      type: Array,
      default: () => [],
    },
    // el-tree 配置项
    defaultProps: Object,
    // el-tree node-key 必须唯一
    nodeKey: {
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
      validator: function (value: string) {
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
  emits: ["add-btn", "remove-btn"],
  setup(props: ITransferProps, ctx) {
    const activeComponent = computed(() => {
      return props.mode == "transfer" ? "ComponentTransfer" : "ComponentAddress";
    });
    const handleAddBtn = (fromData: any[], toData: any[], obj: {}): void => {
      ctx.$emit("add-btn", fromData, toData, obj);
    };
    const handleRemoveBtn = (fromData: any[], toData: any[], obj: {}): void => {
      ctx.$emit("remove-btn", fromData, toData, obj);
    };
    return { activeComponent, handleAddBtn, handleRemoveBtn };
  },
});
</script>

<style lang="scss"></style>
