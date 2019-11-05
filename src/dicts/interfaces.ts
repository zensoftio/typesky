export interface Filter {
  [key: string]: string[]
}

export interface Sorting {
  orderBy: string
  sort: string
}

export interface Pagination {
  limit: number
  page: number
}

export interface Params {
  pagination: Pagination
  filters: Filter | null
  sorting: Sorting | null
}

export interface Modificators {
  filters: Filter
  sorting: Sorting
}

export interface ListColumns {
  title?: string,
  accessor: string,
}
