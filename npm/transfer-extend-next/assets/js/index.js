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

export {
  findParents,
}