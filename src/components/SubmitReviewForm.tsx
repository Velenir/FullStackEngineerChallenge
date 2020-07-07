import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useOneReviewQuery } from 'generated/graphql';

export interface SubmitReviewData {
  text: string;
}

interface SubmitReviewProps {
  onSubmit: (data: SubmitReviewData) => void;
  reviewId: number;
}

export const SubmitReview: React.FC<SubmitReviewProps> = ({
  onSubmit,
  reviewId,
  children,
}) => {
  const { register, handleSubmit, errors } = useForm<SubmitReviewData>();

  const { data, error: gqlError } = useOneReviewQuery({
    variables: { reviewId },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}
    >
      <label>
        <span>Review text: </span>
        <textarea name="text" ref={register({ required: true })} />
        <ErrorMessage name="text" errors={errors} />
      </label>
      <button type="submit">Submit</button>
      {gqlError && <p>{gqlError.message}</p>}
      {children}
    </form>
  );
};
