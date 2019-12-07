# el-tree-transfer

## 简介

---

el-tree-fransfer 是一个基于 VUE 和 element-ui 的树形穿梭框组件，使用前请确认已经引入[element-ui](http://element.eleme.io/#/zh-CN/component/quickstart)！
此组件功能类似于`element-ui`的[transfer](http://element.eleme.io/#/zh-CN/component/transfer)组件，但是里面的数据是树形结构！
实际上，el-tree-transfer 依赖的 element-ui 组件分别是[Checkbox 多选框](http://element.eleme.io/#/zh-CN/component/checkbox#checkbox-duo-xuan-kuang)，[Button 按钮](http://element.eleme.io/#/zh-CN/component/button)，和最主要的[Tree 树形控件](http://element.eleme.io/#/zh-CN/component/tree)写成！并非是在 element-ui 的穿梭框组件上的扩展，而仅仅是参照了其外观样式和功能。

因为公司业务使用 vue 框架，ui 库使用的 element-ui。在市面上找到一个好用的 vue 树形穿梭框组件都很难，又不想仅仅因为一个穿梭框在 element-ui 之外引入其他重量级插件，因此就有了 el-tree-transfer。轻量，易用，无需投入其他学习成本。

### [在线访问](http://tree-transfer.zhongxiang.shop/) - [GitHub](https://github.com/hql7/tree-transfer) - [NPM](https://www.npmjs.com/package/el-tree-transfer) - [SegmentFault](https://segmentfault.com/a/1190000015553081) - [CSDN](https://blog.csdn.net/qq_15390381/article/details/80943549)- [掘金](https://juejin.im/post/5b3ecae8e51d4519213fae4b)

#### 注意！ 2.2.0 版本增加lazy懒加载功能
#### 注意！ 2.0.0 版本存在父子不关联错误，2.1.1 版本增加 arrayToTree 支持，但已经是树形数据的请不要使用此参数
#### 注意！ 1.9.0 版本增强 id 为数字型的匹配强度，1.9.7 版本增加`defaultTransfer`属性用来满足用户不想将数据拆分成 fromData 和 toData 的需求
#### 注意！ 1.8.7 版本增加通讯录模式，可通过 mode 字段配置模式
#### 注意！ 1.7.7 版本移动事件参数调整，直接返回移动后的 fromData 数据和 toData 数据。
#### 注意！ 1.5 以上版本改为自动处理
> 第一层数据的 pid 请设定为 0！！ pid 就是父级的 id！别再跑过来问了真的
> id 推荐为 string，但也可以是 number，请不要混用，id 不要重复！！！
#### 这里有一个兄弟组件-树形表格：[在线访问](http://eltreetable.zhongxiang.shop/) - [GitHub](https://github.com/hql7/el-tree-table)

## 快速上手

> 先 npm 下载插件

`npm install el-tree-transfer --save`

或

`npm i el-tree-transfer -S`

> 然后你可以像使用普通组件一样使用 el-tree-transfer

    <template>
      <div>
        // 你的代码
        ...
        // 使用树形穿梭框组件
        <tree-transfer :title="title" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' height='540px' filter openAll>
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
        comporents:{ treeTransfer } // 注册
      }
    </script>

    <style>
    ...
    </style>

## 文档

| 序号 | 参数 | 说明 | 类型 | 必填 | 可选值 | 默认值 | 补充 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1 | width | 宽度 | String | false | - | 100% | 建议在外部盒子设定宽度和位置|
| 2 | height | 高度 | String | false | - | 320px | - |
| 3 | title | 标题 | String | false | - | ["源列表", "目标列表"] | - |
| 4 | button_text | 按钮名字 | Array | false | - | - | - |
| 5 | from_data | 源数据 | Array | true | - | - | 数据格式同element-ui tree组件，但必须有id和pid |
| 6 | to_data | 目标数据 | Array | true | - | - | 数据格式同element-ui tree组件，但必须有id和pid |
| 7 | defaultProps | 配置项-同el-tree中props | Object | false | - | { label: "label", children: "children", isLeaf: "leaf", disable: "disable" } | 用法和el-tree的props一样 |
| 8 | node_key | 自定义node-key的值，默认为id | String | false | - | id | 必须与treedata数据内的id参数名一致，必须唯一 |
| 9 | pid | 自定义pid的参数名，默认为"pid" | String | false | - | pid | 有网友提出后台给的字段名不叫pid，因此增加自定义支持 |
| 10 | leafOnly | 废弃 | - | - | - | - | - |
| 11 | filter | 是否开启筛选功能 | Boolean | false| - | false | 根据defaultProps参数的label字段筛选 |
| 12 | openAll | 是否默认展开全部 | Boolean | false | - | false | 存在性能问题 |
| 13 | ~~renderContent~~ renderContentLeft, renderContentRight | 自定义树节点， 用法同element-ui tree | Function | false | - | - | 2.2.3版本拆为两个函数分别定义左右两侧自定义节点 |
| 14 | mode | 设置穿梭框模式 | String | false | transfer/addressList | transfer | mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人 |
| 15 | transferOpenNode | 穿梭后是否展开穿梭的节点 | Boolean | false | - | true | 默认为true即展开穿梭的节点，便于视觉查看，增加此参数是因为数据量大时展开会有明显卡顿问题，但注意，如此参数设置为false则穿梭后不展开，毕竟无法确定第几层就会有庞大数据 |
| 16 | defaultCheckedKeys | 默认选中节点 | Array | false | - | - | 只匹配初始时默认节点，不会在你操作后动态改变默认节点 |
| 17 | placeholder | 设置搜索框提示语 | String | false | - | 输入关键词进行筛选 | - |
| 18 | defaultTransfer | 是否自动穿梭一次默认选中defaultCheckedKeys的节点 | Boolean | false | - | false | 用来满足用户不想将数据拆分成fromData和toData的需求 |
| 19 | arrayToTree | 是否开启一维数组转化为树形结构 | Boolean | false | - | false | 数据必须存在根节点，并且不会断节，数据格式详见github上app.vue，根据id、pid对应关系转化，存在一定的性能问题 |
| 20 | addressOptions | 通讯录模式配置项 | Object | false | - | {num: Number, suffix: String, connector: String} | num-> 所需右侧通讯录个数,默认3 suffix-> label后想要拼接的字段（如id，即取此条数据的id拼接在后方）默认suffix connector -> 连接符（字符串）默认- |
| 21 | lazy | 是否启用懒加载 | Boolean | false | - | false | 效果动el-tree懒加载，不可和openAll或默认展开同时使用 |
| 22 | lazyFn | 懒加载的回调函数 | Function | true | - | - | 当适用lazy时必须传入回调函数，示例:lazyFn='loadNode',返回参数loadNode(node, resolve, from), node->当前展开节点node，resolve->懒加载resolve，from -> left/right 表示回调来自左侧/右侧 |
| 23 | high-light | 是否高亮当前选中节点| Boolean | false | - | false | - |
| 24 | filterNode | 自定义搜索函数 | Function | false | - | - | 不传则仍默认根据defaultProps参数的label字段筛选 |

> -----------------------------------------------------------

| 序号 | 事件名称 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | addBtn | 点击添加按钮时触发的事件 | unction(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表 |
| 2 | removeBtn | 点击移除按钮时触发的事件 | function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表 |
| 3 | left-check-change | 左侧源数据勾选事件 | function(nodeObj, treeObj, checkAll)见el-tree组件check事件返回值, 新增checkAll参数表示是否全部选中 | 
| 4 | right-check-change | 右侧目标数据勾选事件 | function(nodeObj, treeObj, checkAll)见el-tree组件check事件返回值, 新增checkAll参数表示是否全部选中 |

> --------------------------------------------------------

| 序号 | 名字 | 说明 |
| ---- | ---- | ---- |
| 1 | left-footer | 穿梭框左侧、右侧底部slot |
| 2 | right-footer | 穿梭框左侧、右侧底部slot |
| 3 | title-left | 穿梭框标题区左侧、右侧自定义内容 |
| 4 | title-right | 穿梭框标题区左侧、右侧自定义内容 |



## 版本说明

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