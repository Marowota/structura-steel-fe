export interface IPagination {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  search?: string;
  all?: boolean;
  deleted?: boolean;
}

export interface IPaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const DEFAULT_PAGINATION_PARAMS: IPagination = {
  pageNo: 0,
  pageSize: 10,
  sortBy: "id",
  sortDir: "asc",
  search: "",
  all: false,
  deleted: false,
};

export const DEFAULT_PAGINATION_RESPONSE: IPaginationResponse<unknown> = {
  pageNo: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
  last: true,
  content: [],
};
