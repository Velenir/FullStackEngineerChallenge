export type DataTypeFromQuery<T> = Omit<
  Exclude<T, null | undefined>,
  '__typename'
>;
