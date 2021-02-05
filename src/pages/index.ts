import { App } from "vue"
import TreeTransfer from "./tree-transfer/index";

const components = [TreeTransfer];

const install = function (Vue: App) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && (window as any).Vue) {
  install((window as any).Vue);
}

export default {
  install,
  TreeTransfer,
};
