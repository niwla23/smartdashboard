export interface Item {
    label: string;
    item_name: string;
    suffix: string | null
}

export interface Page {
    name: string;
    refresh: number;
    columns: number;
    background_color: string;
    background_image: string;
    box_color: string;
    items: Item[];
}

export interface DashboardConfig {
    pages: Page[];
}
