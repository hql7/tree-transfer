 <template >
  <div class="component-transfer">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <el-checkbox
          :indeterminate="from_is_indeterminate"
          v-model="from_check_all"
          @change="fromAllBoxChange"
        ></el-checkbox>
        <span>{{ selfTitle.left }}</span>
        <slot name="title-left"></slot>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <slot name="from"></slot>
        <el-input
          v-if="filter"
          :placeholder="placeholder"
          v-model="filterFrom"
          size="small"
          class="filter-tree"
        ></el-input>
        <el-tree
          ref="from-tree"
          show-checkbox
          :lazy="lazy"
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
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="from_expanded_keys"
          @check="fromTreeChecked"
        ></el-tree>
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
          :placeholder="placeholder"
          v-model="filterTo"
          size="small"
          class="filter-tree"
        ></el-input>
        <el-tree
          slot="to"
          ref="to-tree"
          show-checkbox
          :lazy="lazyRight"
          :data="self_to_data"
          :node-key="node_key"
          :props="defaultProps"
          :load="rightloadNode"
          :default-expand-all="openAll"
          :highlight-current="highLight"
          :check-strictly="checkStrictly"
          :render-content="renderContentRight"
          :filter-node-method="filterNodeTo"
          :default-expanded-keys="to_expanded_keys"
          @check="toTreeChecked"
        ></el-tree>
        <slot name="right-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { arrayToTree, valInDeep } from "wl-core";

export default {
  name: "transfer",
  props: {
    title: Array, // 标题
    filter: Boolean, // 是否开启筛选
    placeholder: String, // 搜索提示语
    lazy: Boolean, // 是否懒加载
    node_key: String, // 是否懒加载
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
    // 标题
    selfTitle() {
      const [left, right] = this.title;
      return { left, right };
    },
  },
  created(){
    console.log(this.title);
  },
  methods: {
    // 源数据 总全选checkbox
    fromAllBoxChange(val) {
      if (!this.self_from_data.length) return;
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
      if (!this.self_to_data.length) return;
      if (val) {
        this.to_check_keys = this.self_to_data;
        this.$refs["to-tree"].setCheckedNodes(this.self_to_data);
      } else {
        this.$refs["to-tree"].setCheckedNodes([]);
        this.to_check_keys = [];
      }
      this.$emit("right-check-change", null, null, this.to_check_all);
    },
    // 异步加载左侧
    leftloadNode(node, resolve) {
      this.lazyFn && this.lazyFn(node, resolve, "left");
    },
    // 异步加载右侧
    rightloadNode(node, resolve) {
      this.lazyFn && this.lazyFn(node, resolve, "right");
    },
  },
};
</script>