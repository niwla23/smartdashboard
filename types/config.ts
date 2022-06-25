/* eslint-disable camelcase */
export interface Item {
  label: string
  item_name: string
  suffix: string | null
  digits: number | null
}

export interface Page {
  name: string
  refresh: number
  columns: number
  items: Item[]
}

export interface DashboardConfig {
  pages: Page[]
}
