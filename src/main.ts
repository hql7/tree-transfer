import { createApp } from 'vue'
import App from './App.vue'
import { ElButton, ElCheckbox, ElInput, ElScrollbar, ElTree } from "element-plus"
import TreeTransfer from "./pages/index"
import "./assets/css/clear.min.css"

const app = createApp(App);
app.use(ElButton)
app.use(ElCheckbox)
app.use(ElInput)
app.use(ElScrollbar)
app.use(ElTree)
app.use(TreeTransfer)
app.mount('#app')
