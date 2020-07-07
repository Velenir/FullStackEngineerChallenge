import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Form } from './Form';

export interface SubmitReviewData {
  text: string;
}

interface SubmitReviewProps {
  onSubmit: (data: SubmitReviewData) => void;
}

export const SubmitReview: React.FC<SubmitReviewProps> = ({
  onSubmit,
  children,
}) => {
  const { register, handleSubmit, errors } = useForm<SubmitReviewData>();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span>Review text: </span>
        <textarea name="text" ref={register({ required: true })} />
        <ErrorMessage name="text" errors={errors} />
      </label>
      <button type="submit">Submit</button>
      {children}
      <style jsx>{`
        label {
          display: flex;
          flex-direction: column;
          margin: 1em 0;
        }

        textarea {
          min-width: 40ch;
          min-height: 10em;
        }
      `}</style>
    </Form>
  );
};
