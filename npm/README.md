# el-tree-transfer

## 简介

---

el-tree-fransfer 是一个基于 VUE 和 element-ui 的树形穿梭框组件，使用前请确认已经引入[element-ui](http://element.eleme.io/#/zh-CN/component/quickstart)！
此组件功能类似于`element-ui`的[transfer](http://element.eleme.io/#/zh-CN/component/transfer)组件，但是里面的数据是树形结构！
实际上，el-tree-transfer 依赖的 element-ui 组件分别是[Checkbox 多选框](http://element.eleme.io/#/zh-CN/component/checkbox#checkbox-duo-xuan-kuang)，[Button 按钮](http://element.eleme.io/#/zh-CN/component/button)，和最主要的[Tree 树形控件](http://element.eleme.io/#/zh-CN/component/tree)写成！并非是在 element-ui 的穿梭框组件上的扩展，而仅仅是参照了其外观样式和功能。

因为公司业务使用 vue 框架，ui 库使用的 element-ui。在市面上找到一个好用的 vue 树形穿梭框组件都很难，又不想仅仅因为一个穿梭框在 element-ui 之外引入其他重量级插件，因此就有了 el-tree-transfer。轻量，易用，无需投入其他学习成本。

### [在线访问](http://tree-transfer.zhongxiang.shop/)

### 注意！

>第一层数据的 pid 请设定为 0！！

>id推荐为string，但也可以是number，请不要混用

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
        <tree-transfer :from_data = 'fromData' :to_data = 'toData' @addBtn='add' @removeBtn='remove'></tree-transfer>
      </div>
    </template>  

    <script>
      import treeTransfer from 'el-tree-transfer' // 引入

      export defult {
        data(){
          return:{
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
          // 监听穿梭框组件添加
          add(data){
            conlose.log(data)
          },
          // 监听穿梭框组件移除
          remove(data){
            conlose.log(data)
          }
        },
        comporents:{ treeTransfer } // 注册
      }
    </script>

    <style>
    ...
    </style>

## 文档

1.  参数：`width` 说明：`宽度` 类型：`String` 必填：`false` 默认：`100%` 补充：`建议在外部盒子设定宽度和位置`

2.  参数：`height` 说明：`高度` 类型：`String` 必填：`false` 默认：`320px`

3.  参数：`title` 说明：`标题` 类型：`Array` 必填：`false` 默认：`["源列表", "目标列表"]`

4.  参数：`button_text` 说明：`按钮名字` 类型：`Array` 必填：`false` 默认：`空`

5.  参数：`from_data` 说明：`源数据` 类型：`Array` 必填：`true` 补充：`数据格式同element-ui tree组件，但必须有id和pid`

6.  参数：`to_data` 说明：`目标数据` 类型：`Array` 必填：`true` 补充：`数据格式同element-ui tree组件，但必须有id和pid`

7.  参数：`defaultProps` 说明：`配置项-同el-tree中props` 必填： `false` 补充：`用法和el-tree的props一样`

8.  参数：`node_key` 说明：`自定义node-key的值，默认为id` 必填：`false` 补充：`必须与treedata数据内的id参数名一致，必须唯一`

9.  参数：`pid` 说明：`自定义pid的参数名，默认为"pid"` 必填：`false` 补充：`有网友提出后台给的字段名不叫pid，因此增加自定义支持`

10. 事件：`addBtn` 说明：`点击添加按钮时触发的事件` 回调参数：`data为选中节点id`

11. 事件：`removeBtn` 说明：`点击移除按钮时触发的事件` 回调参数：`data为选中节点id`

## 版本说明

> 1.4.8 版本修复了id为number类型时无法通过重复校验函数的问题，但仍然推荐id使用string型

> 1.4.7 版本增加了`defaultProps`参数，`node_key`参数，`pid`参数，主要作用为可以自定义一些重要字段名，来提高数据灵活性，避免和后台因为字段名不同而被祭天

> 1.3.7 版本取消了对 loadsh 库的依赖，此前仅用此库做某些深拷贝处理

## [GitHub demo 代码地址](https://github.com/hql7/tree-transfer) 欢迎 star 谢谢
