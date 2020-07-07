import { MyReviewsQuery, MeQuery } from 'generated/graphql';

export type DataTypeFromQuery<T> = Omit<
  Exclude<T, null | undefined>,
  '__typename'
>;

export type ReviewType = DataTypeFromQuery<MyReviewsQuery['myReviews']>[0];

export type MeData = DataTypeFromQuery<MeQuery['me']>;
