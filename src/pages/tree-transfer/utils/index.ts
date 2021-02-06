/**
 * @name 从一维数组中找到节点的父祖节点
 * @param {Object} item 当前节点
 * @param {Array} arr 全部节点数组
 * @param {Object} options 配置项
 */
declare interface FindParentsOptions {
  id?: string;
  parentId?: string;
  root?: string | number;
}
declare interface Iarr {
  id: string;
  parentId: string;

}

function findParents(
  item: object,
  arr: Array<any>,
  options: FindParentsOptions
): Array<any> {
  const _parents: Array<any> = [];
  const _parentId: string = options.parentId || "parentId";
  const _id: string = options.id || "id";
  const _root: string | number = options.root || 0;
  return (function findParent(item: { [key: string]: any }): any {
    if (item[_parentId] === _root) return _parents;
    const parent = arr.find((i) => i[_id] === item[_parentId]);
    if (parent) {
      _parents.push(parent);
      return findParent(parent);
    } else {
      return _parents;
    }
  })(item);
}