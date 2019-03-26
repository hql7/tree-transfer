/**
 * auth: weilan
 * github: https://github.com/hql7
 * description: 一个数组操作函数库
 */

// 从树形数据中递归筛选目标值
function valInDeep(arr = [], val, id, childs) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[id] == val ? item : valInDeep(item[childs] || [], val, id, childs)
    );
  }, []);
}

// 将树形数据向下递归为一维数组
function flattenDeep(arr = [], childs) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item,
      item[childs] ? flattenDeep(item[childs], childs) : []
    );
  }, []);
}

// 将树形数据向上将此支线递归为一维数组
function flattenDeepParents(arr, parent) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[parent] || [],
      item[parent] ? flattenDeepParents([item[parent]], parent) : []
    );
  }, []);
}

// 根据条件递归祖先元素
function regDeepParents(row, parent, reg) {
  if (row[parent]) {
    reg && reg(row[parent]);
    regDeepParents(row[parent], parent, reg);
  }
}

// 将数组转化成树结构
function arrayToTree(
  array = [],
  options = { id: "id", pid: "pid", children: "children" }
) {
  let array_ = []; // 创建储存剔除叶子节点后的骨架节点数组
  let unique = {}; // 创建盒子辅助本轮children合并去重
  array.forEach(item => {
    // 适应el-tree-transfer 将根节点pid重置为 0
    let root = ["undefined", undefined, null].includes(item[options.pid]);
    if (root) item[options.pid] = 0;
    // 筛选可以插入当前节点的所有子节点
    let children_array = array.filter(
      it => it[options.pid] === item[options.id]
    );
    if (item.children && item.children instanceof Array) {
      // 去重合并数组
      item.children.map(i => (unique[i[options.id]] = 1));
      item.children.push(
        ...children_array.filter(i => unique[i[options.id]] !== 1)
      );
    } else {
      item.children = children_array;
    }
    // 当children_array有数据时插入下一轮array_，当无数据时将最后留下来的根节点树形插入数组
    let has_children = children_array.length > 0;
    if (
      has_children ||
      (!has_children && [0, "0"].includes(item[options.pid]))
    ) {
      array_.push(item);
    }
  });
  // 当数组内仅有根节点时退出，否组继续处理 最终递归深度次
  if (!array_.every(item => [0, "0"].includes(item[options.pid]))) {
    return arrayToTree(array_, options);
  } else {
    return array_;
  }
}

export {
  valInDeep,
  flattenDeep,
  flattenDeepParents,
  regDeepParents,
  arrayToTree
};
