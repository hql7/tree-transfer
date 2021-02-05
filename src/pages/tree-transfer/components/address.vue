<template>
  <div>{{ n }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "TreeTransfer",
  components: {},
  setup() {
    const n = ref(2); // 生成的n是一个对象, 这样方便vue去监控它
    return { n };
  },
});
</script>

<style lang="scss"></style>
