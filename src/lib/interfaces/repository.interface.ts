export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PageResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IReadableRepository<T, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface IWritableRepository<T, ID = number, C = Omit<T, "id">> {
  create(data: C): Promise<T>;
  update(id: ID, data: Partial<C>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

export interface IRepository<T, ID = number, C = Omit<T, "id">>
  extends IReadableRepository<T, ID>, IWritableRepository<T, ID, C> {}

export interface IPaginableRepository<T, F = Record<string, unknown>> {
  findPaginated(page: number, pageSize: number, filters?: F): Promise<{ data: T[]; count: number }>;
}

export interface ISearchableRepository<T> {
  search(query: string): Promise<T[]>;
}