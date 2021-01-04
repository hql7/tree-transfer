# el-tree-transfer

## 简介

el-tree-fransfer 是一个基于 VUE 和 element-ui 的树形穿梭框组件，使用前请确认已经引入[element-ui](http://element.eleme.io/#/zh-CN/component/quickstart)！
此组件功能类似于`element-ui`的[transfer](http://element.eleme.io/#/zh-CN/component/transfer)组件，但是里面的数据是树形结构！
实际上，el-tree-transfer 依赖的 element-ui 组件分别是[Checkbox 多选框](http://element.eleme.io/#/zh-CN/component/checkbox#checkbox-duo-xuan-kuang)，[Button 按钮](http://element.eleme.io/#/zh-CN/component/button)，和最主要的[Tree 树形控件](http://element.eleme.io/#/zh-CN/component/tree)写成！并非是在 element-ui 的穿梭框组件上的扩展，而仅仅是参照了其外观样式和功能。

因为公司业务使用 vue 框架，ui 库使用的 element-ui。在市面上找到一个好用的 vue 树形穿梭框组件都很难，又不想仅仅因为一个穿梭框在 element-ui 之外引入其他重量级插件，因此就有了 el-tree-transfer。轻量，易用，无需投入其他学习成本。

### [文档地址](http://docs.wlui.com.cn/) - [在线访问](http://wlui.com.cn/) - [GitHub](https://github.com/hql7/tree-transfer) - [掘金](https://juejin.im/post/5b3ecae8e51d4519213fae4b)

### 重要更新

> 2.4.7 修复重构错误（请勿使用2.4.0-2.4.5）；增加父子不关联的三种模式(其中完成授权模式)；调整组件目录结构；重构穿梭算法，demo数据粗略测试性能提升较大；优化父子不关联时全选；修改事件addBtn为add-btn，removeBtn为remove-btn；增加拖拽；增加自定义节点slot；修复左右同时选中穿梭两次后的数据消失；搜索框增加清空；增加父子不关联穿梭功能 

> 2.3.3 修改穿梭匹配逻辑；增加rootPidValue参数。详细说明见下方版本说明  

## 快速上手

> 先 npm 下载插件

`npm install el-tree-transfer --save`

或

`npm i el-tree-transfer -S`

> 然后你可以像使用普通组件一样使用 el-tree-transfer

```js
    <template>
      <div>
        // 你的代码
        ...
        // 使用树形穿梭框组件
        <tree-transfer :title="title" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @add-btn='add' @remove-btn='remove' :mode='mode' height='540px' filter openAll>
      </tree-transfer>
      </div>
    </template>

    <script>
      import treeTransfer from 'el-tree-transfer' // 引入

      export defult {
        data(){
          return:{
            mode: "transfer", // transfer addressList
            fromData:[
              {
                id: "1",
                pid: 0,
                label: "一级 1",
                children: [
                  {
                    id: "1-1",
                    pid: "1",
                    label: "二级 1-1",
                    disabled: true,
                    children: []
                  },
                  {
                    id: "1-2",
                    pid: "1",
                    label: "二级 1-2",
                    children: [
                      {
                        id: "1-2-1",
                        pid: "1-2",
                        children: [],
                        label: "二级 1-2-1"
                      },
                      {
                        id: "1-2-2",
                        pid: "1-2",
                        children: [],
                        label: "二级 1-2-2"
                      }
                    ]
                  }
                ]
              },
            ],
            toData:[]
          }
        },
        methods:{
          // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
          changeMode() {
            if (this.mode == "transfer") {
              this.mode = "addressList";
            } else {
              this.mode = "transfer";
            }
          },
          // 监听穿梭框组件添加
          add(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
          },
          // 监听穿梭框组件移除
          remove(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
          }
        },
        components:{ treeTransfer } // 注册
      }
    </script>

    <style>
    ...
    </style>
```

## 文档
| 序号 | 参数 | 说明 | 类型 | 默认值 | 补充 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 1 | width | 宽度 | String |  100% | 建议在外部盒子设定宽度和位置|
| 2 | height | 高度 | String | 320px | - |
| 3 | title | 标题 | String |  ["源列表", "目标列表"] | - |
| 4 | button_text | 按钮名字 | Array | - | - |
| 5 | from_data | 源数据 | Array | - | 数据格式同element-ui tree组件，但必须有id和pid |
| 6 | to_data | 目标数据 | Array | - | 数据格式同element-ui tree组件，但必须有id和pid |
| 7 | defaultProps | 配置项-同el-tree中props | Object | { label: "label", children: "children", isLeaf: "leaf", disable: "disable" } | 用法和el-tree的props一样 |
| 8 | node_key | 自定义node-key的值，默认为id | String | id | 必须与treedata数据内的id参数名一致，必须唯一 |
| 9 | pid | 自定义pid的参数名，默认为"pid" | String | pid | 有网友提出后台给的字段名不叫pid，因此增加自定义支持 |
| 10 | leafOnly | 废弃 | - | - | - |
| 11 | filter | 是否开启筛选功能 | Boolean | false | 根据defaultProps参数的label字段筛选 |
| 12 | openAll | 是否默认展开全部 | Boolean | false | 存在性能问题 |
| 13 | ~~renderContent~~ renderContentLeft, renderContentRight | 自定义树节点， 用法同element-ui tree | Function | - | 2.2.3版本拆为两个函数分别定义左右两侧自定义节点 |
| 14 | mode | 设置穿梭框模式 | String | transfer | mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人 |
| 15 | transferOpenNode | 穿梭后是否展开穿梭的节点 | Boolean | true | 默认为true即展开穿梭的节点，便于视觉查看，增加此参数是因为数据量大时展开会有明显卡顿问题，但注意，如此参数设置为false则穿梭后不展开，毕竟无法确定第几层就会有庞大数据 |
| 16 | defaultCheckedKeys | 默认选中节点 | Array | false | 只匹配初始时默认节点，不会在你操作后动态改变默认节点 |
| 17 | placeholder | 设置搜索框提示语 | String | 输入关键词进行筛选 | - |
| 18 | defaultTransfer | 是否自动穿梭一次默认选中defaultCheckedKeys的节点 | Boolean | false | 用来满足用户不想将数据拆分成fromData和toData的需求 |
| 19 | arrayToTree | 是否开启一维数组转化为树形结构 | Boolean | false | 数据必须存在根节点，并且不会断节，数据格式详见github上app.vue，根据id、pid对应关系转化，存在一定的性能问题 |
| 20 | addressOptions | 通讯录模式配置项 | Object | {num: Number, suffix: String, connector: String} | num-> 所需右侧通讯录个数,默认3 suffix-> label后想要拼接的字段（如id，即取此条数据的id拼接在后方）默认suffix connector -> 连接符（字符串）默认- |
| 21 | lazy | 是否启用懒加载 | Boolean | false | 效果动el-tree懒加载，不可和openAll或默认展开同时使用 |
| 22 | lazyFn | 懒加载的回调函数 | Function | - | 当适用lazy时必须传入回调函数，示例:lazyFn='loadNode',返回参数loadNode(node, resolve, from), node->当前展开节点node，resolve->懒加载resolve，from -> left/right 表示回调来自左侧/右侧 |
| 23 | high-light | 是否高亮当前选中节点| Boolean | false | - |
| 24 | filterNode | 自定义搜索函数 | Function | - | 不传则仍默认根据defaultProps参数的label字段筛选 |
| 25 | defaultExpandedKeys | 默认展开节点 | Array | - | 要展开的节点id数组，会自动去重生效在左右两侧 |
| 26 | lazyRight |  2.2.9 版本lazy属性只对左侧树生效，如果需要右侧也是用懒加载->lazyRight | Boolean | - | - | - |
| 27 | sjr | 通讯录模式，设置右侧收件人数据 | Array | - | - | 
| 28 | csr | 通讯录模式，设置右侧抄送人数据 | Array | - | - | 
| 29 | msr | 通讯录模式，设置右侧密送人数据 | Array | - | - | 
| 30 | rootPidValue | 穿梭框模式，根节点数据pid的值，用于匹配退出循环，重要 | String,Number | 0 | - | - | 插件不再强制将你的数据根节点pid都改为0 |
| 31 | checkStrictly | 是否父子不关联 | Boolean | false | 此模式不支持lazy，返回的fromData和toData是最新数据，obj里面的keys，nodes不完整。且对删空子节点后的父节点左右两边处理逻辑有差异：当授权时既然要在右边出现，必然需要左侧父节点，而删除授权时，移除子权限并不代表想移除父权限 |
| 32 | renderAfterExpand | 是否在第一次展开某个树节点后才渲染其子节点 | Boolean | true | - |
| 33 | expandOnClickNode | 是否在点击节点的时候展开或者收缩节点 | Boolean | true | - | 
| 34 | checkOnClickNode | 是否在点击节点的时候选中节点 | Boolean | false | - |
| 35 | indent | 相邻级节点间的水平缩进，单位为像素 | Number | 16 | - |
| 36 | icon-class | 自定义树节点的图标 | String | - | - |
| 37 | draggable | 是否开启拖拽节点功能 | Boolean | false | - |
| 38 | allow-drag | 判断节点能否被拖拽 | Function(node) | - | - |
| 39 | allow-drop | 拖拽时判定目标节点能否被放置 | Function(draggingNode, dropNode, type) | - | type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后 |
| 40 | checkStrictlyType | 父子不关联的三种模式:authorization授权模式,puppet木偶模式modular积木模式 | String | authorization:左侧选择子节点自动带着父节点；右侧选择父节点自动带着子节点；此模式两侧可能存在相同的非叶子节点;puppet:纯父子不关联穿梭，但要保持完整的树形结构，只自动带上穿梭到对面拼接所需的骨架结构；此模式两侧可能存在相同的非叶子节点;modular纯父子不关联穿梭，也不保持完整的树形结构，像积木一样右侧要形成树形则需要把左侧拆除，左侧拆的越多右侧形成的树结构越完整；此模式左右两侧保证严格的唯一性 |
> -----------------------------------------------------------

## 事件

| 序号 | 事件名称 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | add-btn | 点击添加按钮时触发的事件(2.4.0以前为addBtn) | function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表 |
| 2 | remove-btn | 点击移除按钮时触发的事件(2.4.0以前为removeBtn) | function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表 |
| 3 | left-check-change | 左侧源数据勾选事件 | function(nodeObj, treeObj, checkAll)见el-tree组件check事件返回值, 新增checkAll参数表示是否全部选中 | 
| 4 | right-check-change | 右侧目标数据勾选事件 | function(nodeObj, treeObj, checkAll)见el-tree组件check事件返回值, 新增checkAll参数表示是否全部选中 |
| 5 | node-drag-start | 节点开始拖拽时触发的事件 | 共3个参数，依次为："left"/"right"、被拖拽节点对应的 Node、event |
| 6 | node-drag-enter | 拖拽进入其他节点时触发的事件 | 共4个参数，依次为："left"/"right"、被拖拽节点对应的 Node、所进入节点对应的 Node、event |
| 7 | node-drag-leave | 拖拽离开某个节点时触发的事件 | 	共4个参数，依次为："left"/"right"、被拖拽节点对应的 Node、所离开节点对应的 Node、event |
| 8 | node-drag-over | 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件） | 共4个参数，依次为："left"/"right"、被拖拽节点对应的 Node、当前进入节点对应的 Node、event |
| 9 | node-drag-end | 拖拽结束时（可能未成功）触发的事件 | 共5个参数，依次为："left"/"right"、被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event |
| 10 | node-drop | 拖拽成功完成时触发的事件 | 共5个参数，依次为："left"/"right"、被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event |

> --------------------------------------------------------

## 方法

| 序号 | 名称 | 说明 |
| ---- | ---- | ---- |
| 0 | addToAims | 手动调用添加穿梭，用于调整初始数据默认穿梭 function(useCallBack: Boolean) 本次穿梭是否需要触发@add-btn的emit回调 | 
| 1 | clearChecked | 清除选中节点，默认清除全部 function(type: String) left左边 right右边 all全部 默认all |
| 2 | getChecked | 获取选中数据 | 
| 3 | setChecked | 设置选中数据 function(leftKeys = [], rightKeys = []) |
| 4 | clearFilter | 清除搜索框条件，默认清除全部 function(type: String) left左边 right右边 all全部 默认all | 

> --------------------------------------------------------

## slot

| 序号 | 名字 | 说明 |
| ---- | ---- | ---- |
| 1 | left-footer | 穿梭框左侧、右侧底部slot |
| 2 | right-footer | 穿梭框左侧、右侧底部slot |
| 3 | title-left | 穿梭框标题区左侧、右侧自定义内容 |
| 4 | title-right | 穿梭框标题区左侧、右侧自定义内容 |
| 5 | from | 左侧内容区上部slot |
| 6 | to | 右侧内容区上部slot | 
| 7 | content-left | 自定义左侧树节点 | 
| 8 | content-right | 自定义右侧树节点 |


## 版本说明

> 2.4.7 修复重构错误（请勿使用2.4.0-2.4.5）；增加父子不关联的三种模式(其中完成授权模式)；调整组件目录结构；重构穿梭算法，demo数据粗略测试性能提升较大；优化父子不关联时全选；修改事件addBtn为add-btn，removeBtn为remove-btn；增加拖拽；增加自定义节点slot；修复左右同时选中穿梭两次后的数据消失；搜索框增加清空；增加父子不关联穿梭功能 

> 2.3.3 更改判断穿梭目标是否已在对面存在的算法，避免原来str正则意外匹配结果（如children和list两个字段里都有这个id，穿梭移除后，children里的数据没了，list里面数据还在，此时原来的匹配逻辑仍会任务目标已在对面存在而忽略穿梭）；增加`rootPidValue`字段，不再强制将根节点的pid都改为0

> 2.3.2 优化通讯录模式

> 2.3.1 将外层对el-tree的css设定移入内层，消除2.3.0取消css scoped产生的影响

> 2.3.0 取消css scoped

> 2.2.9 版本lazy属性只对左侧树生效，如果需要右侧也是用懒加载->lazyRight

> 2.2.8 优化defaultCheckedKeys和defaultTransfer配合使用时，触发了添加事件的问题，通常默认第一次穿梭是后台偷懒没有生成fromData和toData
两份数据，需要前端拆分，此时再触发添加事件则务必要；另可不使用defaultTransfer而是在defaultCheckedKeys改变后手动调用addToAims(false)函数，参数传false则不会触发emit回调

> 2.2.6 增加`clearChecked`清空选中节点方法

> 2.2.5 增加参数`defaultExpandedKeys`默认展开节点

> 2.2.3 拆分自定义树节点函数`参数13 renderContent` 为 `renderContentLeft,renderContentRight`分别定义左右两侧自定义节点函数；增加`filterNode`函数来自定义搜索

> 2.2.2 增加选中高亮参数

> 2.2.1 增加title处的全选事件，具体参数说明见`事件3，事件4`

> 2.2.0 增加lazy懒加载功能(非通讯录模式)，具体参数说明见`参数21, 参数22`

> 2.1.2 增加通讯录模式的可配置项，但作为非主要维护模式灵活度仍较低，具体参数说明见`参数20`

> 2.1.1 修复 array 数组模式选择根节点穿梭错误,废弃`leafOnly`参数，注意已经是树结构的不要使用 arrayToTree 参数

> 2.1.0 增加 arrayTotree 参数，处理一维数组自动转化为所需树结构(详见参数 19,或 github-app.vue)；修复穿梭后半选节点残留的问题；去除部分不必要变量

> 2.0.2 增加标题头部 slot 自定义内容区

> 2.0.1 修复父子不关联问题。

> 2.0.0 版本增加穿梭框左侧、右侧数据勾选事件，穿梭框左侧、右侧底部 slot。

> 1.9.8 版本修复自定义按钮`button_text`的报错。

> 1.9.7 版本增加`defaultTransfer`属性用来满足用户不想将数据拆分成 fromData 和 toData 的需求，增加`placeholder`属性。

> 1.9.0 增强 id 既有数字又有字符型时的正则匹配强度。

> 1.8.9 版本修复一个节点既是一侧的枝干节点又是另一侧的叶子节点时穿梭引起的重复错误！解决自定义节点名时筛选无效错误。

> 1.8.8 版本增加`transferOpenNode`参数用来管理穿梭后是否展开节点，`defaultCheckedKeys`用来设置初始时默认展开节点。

> 1.8.7 版本增加通讯录模式，可通过 mode 字段配置模式，mode 字段可选值为`transfer`|`addressList`。

> 1.7.7 版本 `addBtn` 和 `removeBtn` 事件参数调整，返回三个参数，第一个参数是移动后的 fromData 数据，第二个参数是移动后的 toData 数据，第三个参数是{keys, nodes, harfKeys, harfNodes}对象。增加 `renderContent` 参数支持树节点自定义。

> 1.6.7 版本增加`filter,openAll`参数，来设置是否开启筛选和是否默认展开全部

> 1.5.9 版本增加`leafOnly`参数，来设置是否只返回树的末端叶子节点

> 1.5.8 版本恢复上个版本莫名删掉的返回`nodes`的代码，如果您的项目只需要穿梭的 node-key 值则无需更新！道歉 ing。。。

> 1.5.7 版本修复子组件异步数据有时不会更新的问题！修复了自定义参数名 node_key,children 时的一个错误，自动把第一层数据的 pid 替换为 0

> 1.4.9 版本增加了添加和移除按钮的回调参数，function(keys,nodes)第一个参数为选中节点 node-key 值，第二个参数为选中节点 node

> 1.4.8 版本修复了 id 为 number 类型时无法通过重复校验函数的问题，但仍然推荐 id 使用 string 型

> 1.4.7 版本增加了`defaultProps`参数，`node_key`参数，`pid`参数，主要作用为可以自定义一些重要字段名，来提高数据灵活性，避免和后台因为字段名不同而被祭天

> 1.3.7 版本取消了对 loadsh 库的依赖，此前仅用此库做某些深拷贝处理

## 旧版文档【不再更新】
1.  参数：`width` 说明：`宽度` 类型：`String` 必填：`false` 默认：`100%` 补充：`建议在外部盒子设定宽度和位置`

2.  参数：`height` 说明：`高度` 类型：`String` 必填：`false` 默认：`320px`

3.  参数：`title` 说明：`标题` 类型：`Array` 必填：`false` 默认：`["源列表", "目标列表"]`

4.  参数：`button_text` 说明：`按钮名字` 类型：`Array` 必填：`false` 默认：`空`

5.  参数：`from_data` 说明：`源数据` 类型：`Array` 必填：`true` 补充：`数据格式同element-ui tree组件，但必须有id和pid`

6.  参数：`to_data` 说明：`目标数据` 类型：`Array` 必填：`true` 补充：`数据格式同element-ui tree组件，但必须有id和pid`

7.  参数：`defaultProps` 说明：`配置项-同el-tree中props` 必填： `false` 补充：`用法和el-tree的props一样`

8.  参数：`node_key` 说明：`自定义node-key的值，默认为id` 必填：`false` 补充：`必须与treedata数据内的id参数名一致，必须唯一`

9.  参数：`pid` 说明：`自定义pid的参数名，默认为"pid"` 必填：`false` 补充：`有网友提出后台给的字段名不叫pid，因此增加自定义支持`

10. --(废弃) 不建议使用！参数：`leafOnly` 说明：`是否只返回叶子节点` 类型：`Boolean` 必填：`false` 补充：`默认false，如果你只需要返回的末端子节点可使用此参数`

11. 参数：`filter` 说明：`是否开启筛选功能` 类型：`Boolean` 必填：`false`

12. 参数：`openAll` 说明：`是否默认展开全部` 类型：`Boolean` 必填：`false`

13. 参数：`renderContent` 说明：`自定义树节点` 类型：`Function` 必填：`false` 补充：`用法同element-ui tree`

14. 参数：`mode` 说明：`设置模式，字段可选值为transfer|addressList` 类型：`String` 必填：`false` 补充：`mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人`

15. 参数：`transferOpenNode` 说明：`穿梭后是否展开穿梭的节点` 类型：`Boolean` 必填：`false` 补充：`默认为true即展开穿梭的节点，便于视觉查看，增加此参数是因为数据量大时展开会有明显卡顿问题，但注意，如此参数设置为false则穿梭后不展开，毕竟无法确定第几层就会有庞大数据`

16. 参数：`defaultCheckedKeys` 说明：`默认展开节点` 类型：`Array` 必填：`false` 补充：`只匹配初始时默认节点，不会在你操作后动态改变默认节点`

17. 参数：`placeholder` 说明：`设置搜索框提示语` 类型：`String` 必填：`false` 补充：`默认为请输入关键词进行筛选`

18. 参数：`defaultTransfer` 说明：`是否自动穿梭一次默认选中defaultCheckedKeys的节点` 类型：`Boolean` 必填：`false` 补充：`默认false，用来满足用户不想将数据拆分成fromData和toData的需求`

19. 参数：`arrayToTree` 说明：`是否开启一维数组转化为树形结构` 类型：`Boolean` 必填：`false` 补充：`数据必须存在根节点，并且不会断节，数据格式详见github上app.vue，根据id、pid对应关系转化，存在一定的性能问题`

20. 参数：`addressOptions` 说明：`通讯录模式配置项{num: Number, suffix: String, connector: String}` 类型：`Object` 必填：`false` 补充：`num-> 所需右侧通讯录个数,默认3 suffix-> label后想要拼接的字段（如id，即取此条数据的id拼接在后方）默认suffix connector -> 连接符（字符串）默认-`

21. 参数：`lazy` 说明：`是否启用懒加载` 类型：`Boolean` 必填：`false` 补充：`默认false，效果动el-tree懒加载，不可和openAll或默认展开同时使用`

22. 参数：`lazyFn` 说明：`懒加载的回调函数` 类型：`Function` 必填：`true` 补充：`当适用lazy时必须传入回调函数，示例:lazyFn='loadNode',返回参数loadNode(node, resolve, from), node->当前展开节点node，resolve->懒加载resolve，from -> left|right 表示回调来自左侧|右侧`

23. 事件：`addBtn` 说明：`点击添加按钮时触发的事件` 回调参数：`function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表`

24. 事件：`removeBtn` 说明：`点击移除按钮时触发的事件` 回调参数：`function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表`

25. 事件：`left-check-change` 说明：`左侧源数据勾选事件` 回调参数：`function(nodeObj, treeObj, checkall)见el-tree组件check事件返回值,新增第三个参数表示是否全部选中`

26. 事件：`right-check-change` 说明：`右侧目标数据勾选事件` 回调参数：`function(nodeObj, treeObj, checkall)见el-tree组件check事件返回值，新增第三个参数表示是否全部选中`

27. Slot：`left-footer`, `right-footer` 说明：`穿梭框左侧、右侧底部slot`

28. Slot: `title-left`, `title-right` 说明：`穿梭框标题区左侧、右侧自定义内容`

## [GitHub demo 代码地址](https://github.com/hql7/tree-transfer) 欢迎 star 谢谢

## 有好多有脾气的老哥找我给打赏，谢过

![微信](/src/assets/wx.png)
![支付宝](/src/assets/zfb.jpg)