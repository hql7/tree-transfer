import { App } from "vue"
import TreeTransfer from "./main.vue";

TreeTransfer.install = function (Vue: App): void {
  Vue.component(TreeTransfer.name, TreeTransfer);
};

export default TreeTransfer;
