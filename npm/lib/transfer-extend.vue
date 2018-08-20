<template>
  <div class="transfer" :style="{width,height}">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <el-checkbox :indeterminate="from_is_indeterminate" v-model="from_check_all" @change='fromAllBoxChange'></el-checkbox>
        <span class="u-right">{{fromTitle}}</span>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <!-- <slot name="from"></slot> -->
        <el-input v-if="filter" placeholder="输入关键字进行过滤" v-model="filterFrom" size="small" class="filter-tree">
        </el-input>
        <el-tree ref='from-tree' :data="self_from_data" show-checkbox :node-key="node_key" @check='fromTreeChecked' :default-expanded-keys="from_expanded_keys" :props="defaultProps" :filter-node-method="filterNodeFrom" :default-expand-all="openAll">
        </el-tree>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center">
      <template v-if='button_text'>
        <p class="transfer-center-item">
          <el-button type="primary" @click="addTo" :disabled="from_disabled">
            {{fromButton || '添加'}}
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </p>
        <p class="transfer-center-item">
          <el-button type="primary" @click='removeTo' :disabled="to_disabled" icon="el-icon-arrow-left">{{toButton || '移除'}}</el-button>
        </p>
      </template>
      <template v-else>
        <p class="transfer-center-item">
          <el-button type="primary" @click="addToAims" icon="el-icon-arrow-right" circle :disabled="from_disabled"></el-button>
        </p>
        <p class="transfer-center-item">
          <el-button type="primary" @click='removeToSource' :disabled="to_disabled" icon="el-icon-arrow-left" circle></el-button>
        </p>
      </template>
    </div>
    <!-- 右侧穿梭框 目标框 -->
    <div class="transfer-right">
      <h3 class="transfer-title">
        <el-checkbox :indeterminate="to_is_indeterminate" v-model="to_check_all" @change="toAllBoxChange"></el-checkbox>
        <span class="u-right">{{toTitle}}</span>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <!-- <slot name='to'></slot> -->
        <el-input v-if="filter" placeholder="输入关键字进行过滤" v-model="filterTo" size="small" class="filter-tree">
        </el-input>
        <el-tree slot='to' ref='to-tree' :data="self_to_data" show-checkbox :node-key="node_key" @check='toTreeChecked' :default-expanded-keys="to_expanded_keys" :props="defaultProps" :filter-node-method="filterNodeTo" :default-expand-all="openAll">
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
// import { cloneDeepWith } from "lodash";
export default {
  data() {
    return {
      from_is_indeterminate: false, // 源数据是否半选
      from_check_all: false, // 源数据是否全选
      to_is_indeterminate: false, // 目标数据是否半选
      to_check_all: false, // 目标数据是否全选
      from_expanded_keys: [], // 源数据展开节点
      to_expanded_keys: [], // 目标数据展开节点
      // self_from_data: [...this.from_data], // 左侧数据
      // self_to_data: [...this.to_data], // 右侧数据
      self_from: [], // 子组件左侧数据
      self_to: [], // 子组件右侧数据
      from_disabled: true, // 添加按钮是否禁用
      to_disabled: true, // 移除按钮是否禁用
      from_check_keys: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      to_check_keys: [], // 目标数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      filterFrom: "", // 源数据筛选
      filterTo: "" // 目标数据筛选
    };
  },
  props: {
    // 宽度
    width: {
      type: String,
      default: "100%"
    },
    // 高度
    height: {
      type: String,
      default: "320px"
    },
    // 标题
    title: {
      type: Array,
      default: () => ["源列表", "目标列表"]
    },
    // 穿梭按钮名字
    button_text: Array,
    // 源数据
    from_data: {
      type: Array,
      default: () => []
    },
    // 选中数据
    to_data: {
      type: Array,
      default: () => []
    },
    // el-tree 配置项
    defaultProps: {
      type: Object,
      default: () => {
        return { label: "label", children: "children" };
      }
    },
    // el-tree node-key 必须唯一
    node_key: {
      type: String,
      default: "id"
    },
    // 自定义 pid参数名
    pid: {
      type: String,
      default: "pid"
    },
    // 是否只返回叶子节点
    leafOnly: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    // 添加按钮
    addToAims() {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["from-tree"].getCheckedKeys(this.leafOnly);
      // 选中节点数据
      let arrayCheckedNodes = this.$refs["from-tree"].getCheckedNodes(
        this.leafOnly
      );
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = JSON.parse(JSON.stringify(arrayCheckedNodes));
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["from-tree"].getHalfCheckedNodes();

      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";

      /*
       * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
       * 再将所有末端叶子节点根据pid直接推入目标树即可
       * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
       * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
       */

      // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
      let self_to_data = JSON.stringify(this.self_to_data);
      // 第一步
      let skeletonHalfCheckedNodes = JSON.parse(
        JSON.stringify(arrayHalfCheckedNodes)
      ); // 深拷贝数据 - 半选节点
      // 筛选目标树不存在的骨架节点 - 半选内的节点
      let newSkeletonHalfCheckedNodes = [];
      skeletonHalfCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonHalfCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
      newSkeletonHalfCheckedNodes.forEach(item => {
        item[children__] = [];
        if (item[pid__] == 0) {
          this.$refs["to-tree"].append(item);
        } else {
          this.$refs["to-tree"].append(item, item[pid__]);
        }
      });

      // 第二步
      let cloneSkeletonCheckedNodes = JSON.parse(
        JSON.stringify(arrayCheckedNodes)
      ); // 深拷贝数据 -选中节点
      // 筛选目标树不存在的骨架节点 - 全选内的节点
      let newSkeletonCheckedNodes = [];
      cloneSkeletonCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
      newSkeletonCheckedNodes.forEach(item => {
        if (item[children__] && item[children__].length > 0) {
          item[children__] = [];
          this.$refs["to-tree"].append(item, item[pid__]);
        }
      });

      // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
      let leafCheckedNodes = arrayCheckedNodes.filter(
        item => !item[children__] || item[children__].length == 0
      );
      // 末端叶子直接插入目标树
      leafCheckedNodes.forEach(item => {
        this.$refs["to-tree"].append(item, item[pid__]);
      });

      // 递归查询data内是否存在item函数
      function inquireIsExist(item, strData = self_to_data) {
        // 将树形数据格式化成一维字符串 然后通过匹配来判断是否已存在
        let strItem =
          typeof item[id__] == "number"
            ? `"${id__}":${item[id__]}`
            : `"${id__}":"${item[id__]}"`;
        let reg = RegExp(strItem);
        let existed = reg.test(strData);

        /*  for (let i of data) {
          if (item.id == i.id) {
            existed = true;
          } else if (i.children.length > 0) {
            inquireIsExist(item, i.children);
          }
        } */
        return existed;
      }

      /*  // 选中项 从源数据移除
      arrayCheckedNodes.forEach(item => {
        recursive(item, this.self_from_data);
      });

      // 源树递归查询
      function recursive(obj, data) {
        for (let i of data) {
          if (i.id == obj.id) {
            console.log("f", data);
            let arr = data.filter(b => b.id != obj.id);
            data = arr;
            console.log("t", data);

            continue;
          } else {
            recursive(obj, i.children);
          }
        }
      } */

      // 左侧删掉选中数据
      arrayCheckedNodes.forEach(item => {
        this.$refs["from-tree"].remove(item);
      });

      // 处理完毕按钮恢复禁用状态
      this.from_check_keys = [];

      // 目标数据节点展开
      this.to_expanded_keys = keys;

      // 传递信息给父组件
      this.$emit("addBtn", keys, nodes);
    },
    // 移除按钮
    removeToSource() {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["to-tree"].getCheckedKeys(this.leafOnly);
      // 获取选中通过穿梭框的nodes 选中节点数据
      let arrayCheckedNodes = this.$refs["to-tree"].getCheckedNodes(
        this.leafOnly
      );
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = JSON.parse(JSON.stringify(arrayCheckedNodes));
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["to-tree"].getHalfCheckedNodes();

      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";

      /*
       * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
       * 再将所有末端叶子节点根据pid直接推入目标树即可
       * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
       * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
       */

      // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
      let self_from_data = JSON.stringify(this.self_from_data);
      // 第一步
      let skeletonHalfCheckedNodes = JSON.parse(
        JSON.stringify(arrayHalfCheckedNodes)
      ); // 深拷贝数据 - 半选节点
      // 筛选目标树不存在的骨架节点 - 半选内的节点
      let newSkeletonHalfCheckedNodes = [];
      skeletonHalfCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonHalfCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
      newSkeletonHalfCheckedNodes.forEach(item => {
        item[children__] = [];
        if (item[pid__] == 0) {
          this.$refs["from-tree"].append(item);
        } else {
          this.$refs["from-tree"].append(item, item[pid__]);
        }
      });

      // 第二步
      let cloneSkeletonCheckedNodes = JSON.parse(
        JSON.stringify(arrayCheckedNodes)
      ); // 深拷贝数据 -选中节点
      // 筛选目标树不存在的骨架节点 - 全选内的节点
      let newSkeletonCheckedNodes = [];
      cloneSkeletonCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
      newSkeletonCheckedNodes.forEach(item => {
        if (item[children__] && item[children__].length > 0) {
          item[children__] = [];
          this.$refs["from-tree"].append(item, item[pid__]);
        }
      });

      // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
      let leafCheckedNodes = arrayCheckedNodes.filter(
        item => !item[children__] || item[children__].length == 0
      );
      // 末端叶子直接插入目标树
      leafCheckedNodes.forEach(item => {
        this.$refs["from-tree"].append(item, item[pid__]);
      });

      // 递归查询data内是否存在item函数
      function inquireIsExist(item, strData = self_from_data) {
        // 将树形数据格式化成一维字符串 然后通过匹配来判断是否已存在
        let strItem =
          typeof item[id__] == "number"
            ? `"${id__}":${item[id__]}`
            : `"${id__}":"${item[id__]}"`;
        let reg = RegExp(strItem);
        let existed = reg.test(strData);
        /*  for (let i of data) {
          if (item.id == i.id) {
            existed = true;
          } else if (i.children.length > 0) {
            inquireIsExist(item, i.children);
          }
        } */
        return existed;
      }

      /*  // 选中项 从源数据移除
      arrayCheckedNodes.forEach(item => {
        recursive(item, this.self_from_data);
      });

      // 源树递归查询
      function recursive(obj, data) {
        for (let i of data) {
          if (i.id == obj.id) {
            console.log("f", data);
            let arr = data.filter(b => b.id != obj.id);
            data = arr;
            console.log("t", data);

            continue;
          } else {
            recursive(obj, i.children);
          }
        }
      } */

      // 右侧删掉选中数据
      arrayCheckedNodes.forEach(item => {
        this.$refs["to-tree"].remove(item);
      });

      // 处理完毕按钮恢复禁用状态
      this.to_check_keys = [];

      // 目标数据节点展开
      this.from_expanded_keys = keys;

      // 传递信息给父组件
      this.$emit("removeBtn", keys, nodes);
    },
    // 源树选中事件 - 是否禁用穿梭按钮
    fromTreeChecked(nodeObj, treeObj) {
      this.from_check_keys = treeObj.checkedNodes;
    },
    // 目标树选中事件 - 是否禁用穿梭按钮
    toTreeChecked(nodeObj, treeObj) {
      this.to_check_keys = treeObj.checkedNodes;
    },
    // 源数据 总全选checkbox
    fromAllBoxChange(val) {
      if (this.self_from_data.length == 0) {
        return;
      }
      if (val) {
        // let array = [...this.from_data];
        this.from_check_keys = this.self_from_data;
        this.$refs["from-tree"].setCheckedNodes(this.self_from_data);
      } else {
        this.$refs["from-tree"].setCheckedNodes([]);
        this.from_check_keys = [];
      }
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
    },
    // 源数据 筛选
    filterNodeFrom(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 目标数据筛选
    filterNodeTo(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  computed: {
    // 左侧数据
    self_from_data() {
      let from_array = [...this.from_data, ...this.self_from];
      from_array.forEach(item => {
        item[this.pid] = 0;
      });
      return from_array;
    },
    // 右侧数据
    self_to_data() {
      let to_array = [...this.to_data, ...this.self_to];
      to_array.forEach(item => {
        item[this.pid] = 0;
      });
      return to_array;
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
    }
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
        let allCheck = val.filter(item => item[this.pid] == 0);
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
        let allCheck = val.filter(item => item[this.pid] == 0);
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
    }
  }
};
</script>

<style scoped>
@import "./clear.css";
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

.transfer {
  position: relative;
  overflow: hidden;
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
</style>

