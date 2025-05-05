export interface IPagination {
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
}

export interface IPaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
