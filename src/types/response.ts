export type Filter<T> = Partial<T> & {
  _page?: number;
  _limit?: number;
  _search?: string;
  _sort?: string;
  _order?: "asc" | "desc";
  _all?: boolean;
};

export type Response<T> = {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
