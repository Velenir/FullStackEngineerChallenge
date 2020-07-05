import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  users: Array<User>;
  reviews: Array<Review>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Scalars['Int'];
};

export type Review = {
  __typename?: 'Review';
  id: Scalars['Int'];
  text?: Maybe<Scalars['String']>;
  reviewer: User;
  reviewee: User;
  completed: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  revokeRefreshTokensForUser: Scalars['Boolean'];
  login: LoginResponse;
  logout: Scalars['Boolean'];
  updateUser: Array<User>;
  addUser: Array<User>;
  deleteUser: Array<User>;
  requestReview: Array<Review>;
  completeReview: Review;
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  updatedUser: UpdateUserRequest;
};


export type MutationAddUserArgs = {
  newUser: AddUserRequest;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Int'];
};


export type MutationRequestReviewArgs = {
  newReview: AddReviewRequest;
};


export type MutationCompleteReviewArgs = {
  review: CompleteReview;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type UpdateUserRequest = {
  user_id: Scalars['Int'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type AddUserRequest = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type AddReviewRequest = {
  reviewer_id: Scalars['Int'];
  reviewee_id: Scalars['Int'];
};

export type CompleteReview = {
  text: Scalars['String'];
  review_id: Scalars['Int'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
  )> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
  )> }
);

export type AddUserMutationVariables = Exact<{
  newUser: AddUserRequest;
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { addUser: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  updatedUser: UpdateUserRequest;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
  )> }
);

export type ReviewQueryVariables = Exact<{ [key: string]: never; }>;


export type ReviewQuery = (
  { __typename?: 'Query' }
  & { reviews: Array<(
    { __typename?: 'Review' }
    & Pick<Review, 'id' | 'text' | 'completed'>
    & { reviewer: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ), reviewee: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ) }
  )> }
);

export type RequestReviewMutationVariables = Exact<{
  newReview: AddReviewRequest;
}>;


export type RequestReviewMutation = (
  { __typename?: 'Mutation' }
  & { requestReview: Array<(
    { __typename?: 'Review' }
    & Pick<Review, 'id' | 'text' | 'completed'>
    & { reviewer: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ), reviewee: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ) }
  )> }
);

export type CompleteReviewMutationVariables = Exact<{
  review: CompleteReview;
}>;


export type CompleteReviewMutation = (
  { __typename?: 'Mutation' }
  & { completeReview: (
    { __typename?: 'Review' }
    & Pick<Review, 'id' | 'text' | 'completed'>
    & { reviewer: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ), reviewee: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id'>
    ) }
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName'>
    ) }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);


export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    role
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
    firstName
    lastName
    role
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;
export const AddUserDocument = gql`
    mutation AddUser($newUser: AddUserRequest!) {
  addUser(newUser: $newUser) {
    id
    email
    firstName
    lastName
    role
  }
}
    `;
export type AddUserMutationFn = ApolloReactCommon.MutationFunction<AddUserMutation, AddUserMutationVariables>;

/**
 * __useAddUserMutation__
 *
 * To run a mutation, you first call `useAddUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserMutation, { data, loading, error }] = useAddUserMutation({
 *   variables: {
 *      newUser: // value for 'newUser'
 *   },
 * });
 */
export function useAddUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddUserMutation, AddUserMutationVariables>) {
        return ApolloReactHooks.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, baseOptions);
      }
export type AddUserMutationHookResult = ReturnType<typeof useAddUserMutation>;
export type AddUserMutationResult = ApolloReactCommon.MutationResult<AddUserMutation>;
export type AddUserMutationOptions = ApolloReactCommon.BaseMutationOptions<AddUserMutation, AddUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($updatedUser: UpdateUserRequest!) {
  updateUser(updatedUser: $updatedUser) {
    id
    email
    firstName
    lastName
    role
  }
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      updatedUser: // value for 'updatedUser'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: Int!) {
  deleteUser(userId: $userId) {
    id
    email
    firstName
    lastName
    role
  }
}
    `;
export type DeleteUserMutationFn = ApolloReactCommon.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, baseOptions);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = ApolloReactCommon.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ReviewDocument = gql`
    query Review {
  reviews {
    id
    reviewer {
      email
      id
    }
    reviewee {
      email
      id
    }
    text
    completed
  }
}
    `;

/**
 * __useReviewQuery__
 *
 * To run a query within a React component, call `useReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useReviewQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
        return ApolloReactHooks.useQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, baseOptions);
      }
export function useReviewLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, baseOptions);
        }
export type ReviewQueryHookResult = ReturnType<typeof useReviewQuery>;
export type ReviewLazyQueryHookResult = ReturnType<typeof useReviewLazyQuery>;
export type ReviewQueryResult = ApolloReactCommon.QueryResult<ReviewQuery, ReviewQueryVariables>;
export const RequestReviewDocument = gql`
    mutation RequestReview($newReview: AddReviewRequest!) {
  requestReview(newReview: $newReview) {
    id
    reviewer {
      email
      id
    }
    reviewee {
      email
      id
    }
    text
    completed
  }
}
    `;
export type RequestReviewMutationFn = ApolloReactCommon.MutationFunction<RequestReviewMutation, RequestReviewMutationVariables>;

/**
 * __useRequestReviewMutation__
 *
 * To run a mutation, you first call `useRequestReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestReviewMutation, { data, loading, error }] = useRequestReviewMutation({
 *   variables: {
 *      newReview: // value for 'newReview'
 *   },
 * });
 */
export function useRequestReviewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RequestReviewMutation, RequestReviewMutationVariables>) {
        return ApolloReactHooks.useMutation<RequestReviewMutation, RequestReviewMutationVariables>(RequestReviewDocument, baseOptions);
      }
export type RequestReviewMutationHookResult = ReturnType<typeof useRequestReviewMutation>;
export type RequestReviewMutationResult = ApolloReactCommon.MutationResult<RequestReviewMutation>;
export type RequestReviewMutationOptions = ApolloReactCommon.BaseMutationOptions<RequestReviewMutation, RequestReviewMutationVariables>;
export const CompleteReviewDocument = gql`
    mutation CompleteReview($review: CompleteReview!) {
  completeReview(review: $review) {
    id
    reviewer {
      email
      id
    }
    reviewee {
      email
      id
    }
    text
    completed
  }
}
    `;
export type CompleteReviewMutationFn = ApolloReactCommon.MutationFunction<CompleteReviewMutation, CompleteReviewMutationVariables>;

/**
 * __useCompleteReviewMutation__
 *
 * To run a mutation, you first call `useCompleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeReviewMutation, { data, loading, error }] = useCompleteReviewMutation({
 *   variables: {
 *      review: // value for 'review'
 *   },
 * });
 */
export function useCompleteReviewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CompleteReviewMutation, CompleteReviewMutationVariables>) {
        return ApolloReactHooks.useMutation<CompleteReviewMutation, CompleteReviewMutationVariables>(CompleteReviewDocument, baseOptions);
      }
export type CompleteReviewMutationHookResult = ReturnType<typeof useCompleteReviewMutation>;
export type CompleteReviewMutationResult = ApolloReactCommon.MutationResult<CompleteReviewMutation>;
export type CompleteReviewMutationOptions = ApolloReactCommon.BaseMutationOptions<CompleteReviewMutation, CompleteReviewMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    user {
      id
      email
      role
      firstName
      lastName
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;