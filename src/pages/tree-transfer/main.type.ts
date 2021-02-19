import { ComponentInternalInstance, VNode, h } from 'vue'
// tree配置项
export declare interface defaultProps {
  label?: string
  children?: string
  disabled?: boolean
  isLeaf?: boolean
}
// 自定义树节点的函数
declare interface TreeNodeData {
  [key: string]: any
}
export declare type hType = typeof h
export declare type RenderContentFunction = (h: hType, context: RenderContentContext) => (VNode | VNode[])
declare interface RenderContentContext {
  _self: ComponentInternalInstance
  node: any
  data: TreeNodeData
  store: any
}
// 自定义筛选
declare type FilterValue = any
export declare type FilterNodeMethodFunction = (value: FilterValue, data: TreeNodeData, child: Node) => boolean
// 懒加载
export declare type TreeData = TreeNodeData[]
export declare type LoadFunction = (rootNode: Node, loadedCallback: (data: TreeData) => void) => void
// 是否可被拖拽
export declare type AllowDragFunction = (node: Node) => boolean
declare type DropType = 'inner' | 'prev' | 'next'
export declare type AllowDropFunction = (draggingNode: Node, dropNode: Node, type: DropType) => boolean

// 通讯录模式配置项
declare interface addressOptions {
  num?: number
  suffix?: string
  connector?: string
}
export declare interface ITransferProps {
  fromData: any[]
  toData: any[]
  nodeKey: string
  pid: string
  width?: string
  height?: string
  mode?: string
  title?: string[]
  buttonText?: string[]
  defaultProps?: defaultProps
  rootPidValue?: string | number
  filter?: boolean
  openAll?: boolean
  checkStrictly?: boolean
  checkStrictlyType?: string
  accordion?: boolean
  renderContentLeft?: RenderContentFunction
  renderContentRight?: RenderContentFunction
  defaultTransfer?: boolean
  transferOpenNode?: boolean
  defaultCheckedKeys?: any[]
  defaultExpandedKeys?: any[]
  placeholder?: string
  highLight?: boolean
  renderAfterExpand?: boolean
  checkOnClickNode?: boolean
  filterNode?: FilterNodeMethodFunction
  arrayToTree?: boolean
  lazy?: boolean
  lazyRight?: boolean
  lazyFn?: LoadFunction
  indent?: number
  iconClass?: string
  draggable?: boolean
  allowDrag?: AllowDragFunction
  allowDrop?: AllowDropFunction
  addressOptions?: addressOptions
  sjr?: any[]
  csr?: any[]
  msr?: any[]
}