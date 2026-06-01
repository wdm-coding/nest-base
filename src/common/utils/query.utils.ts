// 构建查询参数
import { SelectQueryBuilder,ObjectLiteral } from 'typeorm';
export interface SearchConfigType {
  field: string; // 搜索字段名
  param: string; // 搜索参数
  type: 'exact' | 'like' // 搜索类型
}
export function buildQueryParams<T extends ObjectLiteral>(
  queryBuilder:SelectQueryBuilder<T>,
  params: Record<string, any>,
  searchConfigs: SearchConfigType[]): SelectQueryBuilder<T>
{
  const alias = queryBuilder.alias;
  searchConfigs.forEach((item) => {
    const { field, param, type } = item;
    const value = params[param];
    if (value !== undefined && value !== null && value !== '') {
      if (type === 'exact') {
        queryBuilder.andWhere(`${alias}.${field} = :${param}`, {
          [param]: value,
        });
      } else if (type === 'like') {
        queryBuilder.andWhere(`${alias}.${field} LIKE :${param}`, {
          [param]: `%${value}%`,
        });
      }
    }
  });
  return queryBuilder;
}