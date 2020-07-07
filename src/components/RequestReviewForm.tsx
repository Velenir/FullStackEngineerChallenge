import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useUsersQuery } from 'generated/graphql';
import { Form } from './Form';

export interface RequestReviewData {
  reviewer_id: string;
  reviewee_id: string;
}

interface RequestReviewFormProps {
  onSubmit: (data: RequestReviewData) => void;
  defaultValues?: RequestReviewData;
  isAdding?: boolean;
}

export const RequestReviewForm: React.FC<RequestReviewFormProps> = ({
  onSubmit,
  children,
  defaultValues,
}) => {
  const { register, handleSubmit, watch } = useForm<RequestReviewData>({
    defaultValues,
  });

  const { data } = useUsersQuery();

  const firstUserId = data?.users[0].id;

  const revieweeId = +watch(
    'reviewee_id',
    firstUserId ? String(firstUserId) : undefined
  );

  const reviewers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((user) => user.id !== revieweeId);
  }, [data?.users, revieweeId]);

  if (!data?.users) return null;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span>Reviewee: </span>
        <select name="reviewee_id" ref={register}>
          {data.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}: {user.email}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Reviewer: </span>
        <select name="reviewer_id" ref={register}>
          {reviewers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}: {user.email}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Submit</button>
      {children}
    </Form>
  );
};
