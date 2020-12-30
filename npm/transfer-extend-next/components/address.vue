<template>
  <div class="component-address">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <el-checkbox
          :indeterminate="from_is_indeterminate"
          v-model="from_check_all"
          @change="fromAllBoxChange"
        ></el-checkbox>
        <span>{{ fromTitle }}</span>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <slot name="from"></slot>
        <el-input
          v-if="filter"
          clearable
          size="small"
          class="filter-tree"
          :placeholder="placeholder"
          v-model="filterFrom"
        ></el-input>
        <el-tree
          ref="from-tree"
          show-checkbox
          :indent="indent"
          :draggable="draggable"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :icon-class="iconClass"
          :node-key="node_key"
          :props="defaultProps"
          :data="self_from_data"
          :default-expand-all="openAll"
          :highlight-current="highLight"
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
        ></el-tree>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center address-list-center">
      <p
        class="transfer-center-item"
        v-show="!move_up"
        :class="{ 'address-only-item': addressOptions.num === 1 }"
      >
        <el-button
          type="primary"
          @click="addressListTransfer(0)"
          icon="el-icon-arrow-right"
          circle
          class="address-first-btn"
          :disabled="from_disabled"
        ></el-button>
      </p>
      <p class="transfer-center-item" v-if="addressOptions.num > 1">
        <el-button
          type="primary"
          @click="addressListTransfer(1)"
          :disabled="from_disabled"
          icon="el-icon-arrow-right"
          circle
        ></el-button>
      </p>
      <p class="transfer-center-item" v-show="move_up">
        <el-button
          type="primary"
          @click="addressListTransfer(2)"
          :disabled="from_disabled"
          icon="el-icon-arrow-right"
          circle
        ></el-button>
      </p>
    </div>
    <!-- 右侧列表区 -->
    <div class="transfer-right">
      <div
        class="transfer-right-item"
        :class="{
          'transfer-right-small': move_up,
          'transfer-right-only': addressOptions.num === 1,
        }"
      >
        <h3 class="transfer-title">
          <span>{{ toTitle }}</span>
          <span class="u-clear" @click="clearList(0, 'all')" v-if="!move_up">清空</span>
          <img
            class="move_up_img move_down_img"
            v-else
            src="../assets/images/shang.png"
            alt="icon"
            @click="moveUp('down')"
          />
        </h3>
        <!-- 内容区 -->
        <div class="transfer-main" v-if="!move_up">
          <slot name="to"></slot>
          <el-input
            v-if="filter"
            :placeholder="placeholder"
            v-model="filterListFirst"
            size="small"
            class="filter-tree"
          ></el-input>
          <ul class="address-list-ul">
            <li class="address-list-li" v-for="item of addressee" :key="item[node_key]">
              <label>
                {{ item[defaultProps.label] }}
                {{ addressOptions.connector }}
                {{ item[addressOptions.suffix] }}
              </label>
              <i
                class="address-list-del el-icon-delete"
                @click="clearList(0, item[node_key])"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="transfer-right-item" v-if="addressOptions.num >= 2">
        <h3 class="transfer-title">
          <span>{{ toTitleSecond || "抄送人" }}</span>
          <span class="u-clear" @click="clearList(1, 'all')">清空</span>
        </h3>
        <!-- 内容区 -->
        <div class="transfer-main">
          <slot name="to"></slot>
          <el-input
            v-if="filter"
            :placeholder="placeholder"
            v-model="filterListSecond"
            size="small"
            class="filter-tree"
          ></el-input>
          <ul class="address-list-ul">
            <li class="address-list-li" v-for="item of Cc" :key="item[node_key]">
              <label>
                {{ item[defaultProps.label] }}
                {{ addressOptions.connector }}
                {{ item[addressOptions.suffix] }}
              </label>
              <i
                class="address-list-del el-icon-delete"
                @click="clearList(1, item[node_key])"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="addressOptions.num === 3"
        class="transfer-right-item"
        :class="{ 'transfer-right-small': !move_up }"
      >
        <h3 class="transfer-title">
          <span>{{ toTitleThird || "密送人" }}</span>
          <span class="u-clear" @click="clearList(2, 'all')" v-if="move_up">清空</span>
          <img
            class="move_up_img"
            v-else
            src="../assets/images/shang.png"
            alt="icon"
            @click="moveUp('up')"
          />
        </h3>
        <!-- 内容区 -->
        <div class="transfer-main" v-if="move_up">
          <slot name="to"></slot>
          <el-input
            v-if="filter"
            :placeholder="placeholder"
            v-model="filterListThird"
            size="small"
            class="filter-tree"
          ></el-input>
          <ul class="address-list-ul">
            <li
              class="address-list-li"
              v-for="item of secret_receiver"
              :key="item[node_key]"
            >
              <label>
                {{ item[defaultProps.label] }}
                {{ addressOptions.connector }}
                {{ item[addressOptions.suffix] }}
              </label>
              <i
                class="address-list-del el-icon-delete"
                @click="clearList(2, item[node_key])"
              >
              </i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { arrayToTree } from "wl-core";

export default {
  name: "AddressBook",
  data() {
    return {
      from_is_indeterminate: false, // 源数据是否半选
      from_check_all: false, // 源数据是否全选
      from_expanded_keys: [], // 源数据展开节点
      from_disabled: true, // 添加按钮是否禁用
      from_check_keys: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      filterFrom: "", // 源数据筛选
      filterListFirst: "", // 通讯录模式 右1筛选
      filterListSecond: "", // 通讯录模式 右2筛选
      filterListThird: "", // 通讯录模式 右3筛选
      archiveFirst: [], // 存档右侧筛选前数据
      archiveSecond: [], // 存档右侧筛选前数据
      archiveThird: [], // 存档右侧筛选前数据
      addressee: [], // 收件人列表
      Cc: [], // 抄送人列表
      secret_receiver: [], // 密送人列表
      move_up: false, // 通讯录模式 切换右侧
    };
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
    // 标题
    title: {
      type: Array,
      default: () => ["源列表", "目标列表"],
    },
    // 源数据
    from_data: {
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
    // 右侧菜单名2
    toTitleSecond() {
      let [, , text] = this.title;
      return text;
    },
    // 右侧菜单名3
    toTitleThird() {
      let [, , , text] = this.title;
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
    // 左侧 数据筛选
    filterFrom(val) {
      this.$refs["from-tree"].filter(val);
    },
    // 通讯录模式 右1筛选
    filterListFirst(newval, oldval) {
      if (oldval == "") {
        this.archiveFirst = this.addressee;
      }
      if (newval == "") {
        this.addressee = this.archiveFirst;
      }
      let reg = RegExp(newval);
      this.addressee = this.addressee.filter((item) => reg.test(item.label));
    },
    // 通讯录模式 右2筛选
    filterListSecond(newval, oldval) {
      if (oldval == "") {
        this.archiveSecond = this.Cc;
      }
      if (newval == "") {
        this.Cc = this.archiveSecond;
      }
      let reg = RegExp(newval);
      this.Cc = this.Cc.filter((item) => reg.test(item.label));
    },
    // 通讯录模式 右3筛选
    filterListThird(newval, oldval) {
      if (oldval == "") {
        this.archiveThird = this.secret_receiver;
      }
      if (newval == "") {
        this.secret_receiver = this.archiveThird;
      }
      let reg = RegExp(newval);
      this.secret_receiver = this.secret_receiver.filter((item) => reg.test(item.label));
    },
    // 监视默认选中
    defaultCheckedKeys(val) {
      this.from_check_keys = val || [];
    },
    // 监视默认展开
    defaultExpandedKeys: {
      handler(val) {
        let _form = new Set(this.from_expanded_keys.concat(val));
        this.from_expanded_keys = [..._form];
      },
      immediate: true,
    },
    // 收件人默认值监测
    sjr: {
      handler(val) {
        this.addressee.push(...val);
      },
      immediate: true,
    },
    // 抄送人默认值监测
    csr: {
      handler(val) {
        this.Cc.push(...val);
      },
      immediate: true,
    },
    // 密送人默认值监测
    msr: {
      handler(val) {
        this.secret_receiver.push(...val);
      },
      immediate: true,
    },
  },
  methods: {
    // -------------------------------提供输出函数---------------------
    // 源树选中事件 - 是否禁用穿梭按钮
    fromTreeChecked(nodeObj, treeObj) {
      this.from_check_keys = treeObj.checkedNodes;
      this.$nextTick(() => {
        this.$emit("left-check-change", nodeObj, treeObj, this.from_check_all);
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
    // 源数据 筛选
    filterNodeFrom(value, data) {
      if (this.filterNode) {
        return this.filterNode(value, data, "form");
      }
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 通讯录模式 穿梭操作
    addressListTransfer(type) {
      // 选中节点数据
      let arrayCheckedNodes = this.$refs["from-tree"].getCheckedNodes(true);
      // 去重筛选
      let arrayDeWeighting = [];
      switch (type) {
        case 0:
          arrayDeWeighting = arrayCheckedNodes.filter((item) => {
            if (
              !this.addressee.some((ite) => ite[this.node_key] == item[this.node_key])
            ) {
              return item;
            }
          });
          this.addressee = [...this.addressee, ...arrayDeWeighting];
          break;
        case 1:
          arrayDeWeighting = arrayCheckedNodes.filter((item) => {
            if (!this.Cc.some((ite) => ite[this.node_key] == item[this.node_key])) {
              return item;
            }
          });
          this.Cc = [...this.Cc, ...arrayDeWeighting];
          break;
        case 2:
          arrayDeWeighting = arrayCheckedNodes.filter((item) => {
            if (
              !this.secret_receiver.some(
                (ite) => ite[this.node_key] == item[this.node_key]
              )
            ) {
              return item;
            }
          });
          this.secret_receiver = [...this.secret_receiver, ...arrayDeWeighting];
          break;
      }

      // 处理完毕取消选中
      this.$refs["from-tree"].setCheckedKeys([]);

      // 处理完毕按钮恢复禁用状态
      this.from_check_keys = [];

      // 传递信息给父组件
      this.$emit("add-btn", this.addressee, this.Cc, this.secret_receiver);
    },
    // 清理 通讯录选中 数据
    clearList(type, id) {
      switch (type) {
        case 0:
          this.addressee =
            id == "all" ? [] : this.addressee.filter((item) => item[this.node_key] != id);
          break;
        case 1:
          this.Cc =
            id == "all" ? [] : this.Cc.filter((item) => item[this.node_key] != id);
          break;
        case 2:
          this.secret_receiver =
            id == "all"
              ? []
              : this.secret_receiver.filter((item) => item[this.node_key] != id);
          break;
      }
      // 传递信息给父组件
      this.$emit("remove-btn", this.addressee, this.Cc, this.secret_receiver);
    },
    // 右侧 通讯录 上下自动
    moveUp(type) {
      if (type == "up") {
        this.move_up = true;
      } else {
        this.move_up = false;
      }
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
    // 以下为提供方法 ----------------------------------------------------------------方法--------------------------------------
    /**
     * @name 清空选中节点
     * @param {String} type left左边 right右边 all全部 默认all
     */
    clearChecked(type = "all") {
      this.$refs["from-tree"].setCheckedKeys([]);
      this.from_is_indeterminate = false;
      this.from_check_all = false;
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

      return {
        leftKeys,
        leftHarfKeys,
        leftNodes,
        leftHalfNodes,
      };
    },
    /**
     * @name 设置选中数据
     * @param {Array} leftKeys 左侧ids
     * @param {Array} rightKeys 右侧ids
     */
    setChecked(leftKeys = [], rightKeys = []) {
      this.$refs["from-tree"].setCheckedKeys(leftKeys);
    },
    /**
     * @name 清除搜索条件
     * @param {String} type left左边 right右边 all全部 默认all
     */
    clearFilter() {
      this.filterFrom = "";
    },
  },
};
</script>
