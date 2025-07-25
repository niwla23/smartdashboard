/* eslint-disable camelcase */
export interface Item {
  label: string;
  item_name: string;
  suffix: string | null;
  digits: number | null;
}

export interface Page {
  name: string;
  title: string;
  icon: string;
  type?: "grid" | "iframe";
  iframeUrl?: string;
  refresh: number;
  columns: number;
  items: Item[];
}

export interface DashboardConfig {
  ping_url?: string;
  pages: Page[];
}

export interface ItemRegistryItem {
  state: string;
  statePattern: string;
  type: string;
  unit?: string;
}
