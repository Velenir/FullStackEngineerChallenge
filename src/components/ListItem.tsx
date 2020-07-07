import React from 'react';
import Link from 'next/link';

import { DataTypeFromQuery } from 'client/types';
import { UsersQuery, ReviewQuery } from 'generated/graphql';

type UserProps = {
  item: DataTypeFromQuery<UsersQuery['users']>[0];
  prefix?: string
};

export const UserListItem = ({ item, prefix = '' }: UserProps) => (
  <Link href={`${prefix}/users/[id]`} as={`${prefix}/users/${item.id}`}>
    <a>
      {item.id}: {item.firstName} {item.firstName}
    </a>
  </Link>
);

type ReviewProps = {
  item: DataTypeFromQuery<ReviewQuery['reviews']>[0];
  prefix?: string
};

export const ReviewListItem = ({ item, prefix = '' }: ReviewProps) => (
  <Link href={`${prefix}/reviews/[id]`} as={`${prefix}/reviews/${item.id}`}>
    <a>
      Review of {item.reviewee.email} by {item.reviewer.email}
    </a>
  </Link>
);


