import React, { Key } from 'react';
import Item from './item';

export default function Tree(props: {
    className?: string;
    style?: React.CSSProperties;
    activeKey?: Key;
    treeData: any[];
}) {

    return (
        <div>
        <h1>Tree</h1>
        </div>
    );
}
