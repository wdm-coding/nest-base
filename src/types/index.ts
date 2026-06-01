// 定义分页查询的参数接口
export interface PaginationParams {
  page?: number; // 当前页码
  limit: number; // 每页数量
  keyword?: string; // 搜索关键词
}
// 定义分页查询的返回结果接口
export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}