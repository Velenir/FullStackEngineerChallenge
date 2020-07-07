import React from 'react';

type Props<T extends any[]> = {
  items: T;
  itemComponent: React.FC<{ item: T[0], prefix?: string }>;
  prefix?: string
};

const List = <T extends any[],>({ items, itemComponent: Item, prefix = '' }: Props<T>) => (
  <ul>
    {items.map((item, index) => (
      <li key={item.id ?? index}>
        <Item item={item} prefix={prefix} />
      </li>
    ))}
  </ul>
);

export default List;
