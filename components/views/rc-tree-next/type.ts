export enum DropType {
    Prev,
    Inner,
    Next,
};

export type DropInfo = {
    dragNode: React.ReactElement;
    dropNode: React.ReactElement;
    dropType: DropType;
};

export type Key = React.Key;

export interface BasicItemData {
    key: Key;
}

export interface TreeProps<ItemData extends BasicItemData> {
    className?: string;
    style?: React.CSSProperties;
    activeKey?: Key;
    itemDatas: ItemData[];
    expandedKeys?: Key[];
    selectedKeys?: Key[];
    itemRender?: (data: ItemData) => React.ReactNode;
    onFocus?: React.FocusEventHandler<HTMLDivElement>;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};
