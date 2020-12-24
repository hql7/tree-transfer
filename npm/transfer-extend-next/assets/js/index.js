/**
 * @name 从一维数组中找到节点的父祖节点
 * @param {Object} item 当前节点
 * @param {Array} arr 全部节点数组
 * @param {Object} options 配置项
 */
const findParents = (item, arr, options = { id: 'id', parentId: 'parentId', root: 0 }) => {
  let _parents = [];
  return function findParent(item) {
    if (item[options.parentId] === options.root) return _parents;
    const parent = arr.find(i => i[options.id] === item[options.parentId]);
    if (parent) {
      _parents.push(parent);
      return findParent(parent)
    } else {
      return _parents
    }
  }(item);
}

/**
 * @name 检查节点的子孙节点是否都被全部选中
 * @param {Array} nodes 节点数据
 */
const checkDescendantIntegrity = (nodes, children) => {
  return nodes.reduce((prv, i) => {
    if (i.__childrenLength !== i[children].length) {
      prv = false
      return prv
    } else {
      prv = true;
      return !i[children].length ? prv : checkDescendantIntegrity(i[children], children)
    }
  }, false)
}

/**
 * @name 从树形数组中找到节点的全部父祖节点
 * @param {Object} item 当前节点
 * @param {Array} arr 全部节点数组
 * @param {Object} options 配置项
 */
const findParentsFromTree = (item, arr, options = { id: 'id', parentId: 'parentId', children: 'children', root: 0 }) => {
  let _parents = [];
  let stop = false;
  if (item[options.parentId] === options.root) return _parents;
  (function findParent(arr) {
    for (let i of arr) {
      if (stop) break;
      console.log(1);

      if (i[options.id] === item[options.parentId]) {
        console.log(2);
        stop = true
      }
      if (Array.isArray(i[options.children]) && i[options.children].length) {
        _parents.push(i)

        console.log(3, i.name);
        findParent(i[options.children])
      } else {
        console.log(4);
      }
    }
  })(arr)
  console.log(_parents);
  return _parents
}

export {
  findParents,
  checkDescendantIntegrity
}