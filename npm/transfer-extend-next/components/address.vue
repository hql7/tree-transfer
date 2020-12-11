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
          :placeholder="placeholder"
          v-model="filterFrom"
          size="small"
          class="filter-tree"
        ></el-input>
        <el-tree
          ref="from-tree"
          show-checkbox
          :node-key="node_key"
          :props="defaultProps"
          :data="self_from_data"
          :default-expand-all="openAll"
          :highlight-current="highLight"
          :render-content="renderContentLeft"
          :filter-node-method="filterNodeFrom"
          :default-expanded-keys="from_expanded_keys"
          @check="fromTreeChecked"
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
          <span class="u-clear" @click="clearList(0, 'all')" v-if="!move_up"
            >清空</span
          >
          <img
            class="move_up_img move_down_img"
            v-else
            src="../assets/images/shang.png"
            alt
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
            <li
              class="address-list-li"
              v-for="item of addressee"
              :key="item[node_key]"
            >
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
            <li
              class="address-list-li"
              v-for="item of Cc"
              :key="item[node_key]"
            >
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
          <span class="u-clear" @click="clearList(2, 'all')" v-if="move_up"
            >清空</span
          >
          <img
            class="move_up_img"
            v-else
            src="../assets/images/shang.png"
            alt
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
export default {
  name: "address",
  data() {
    return {
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
};
</script>