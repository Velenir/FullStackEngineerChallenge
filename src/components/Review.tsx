import React from 'react';
import { ReviewQuery } from '../generated/graphql';
import { DataTypeFromQuery } from 'client/types';
interface ReviewProps {
  review: DataTypeFromQuery<ReviewQuery['reviews']>[0];
}

export const Review: React.FC<ReviewProps> = ({ review }) => {
  const { reviewee, reviewer, completed, text } = review;
  return (
    <>
      <h3>Review</h3>
      <div>
        <label>
          <span>Reviewee: </span>
          <span>
            {reviewee.firstName} {reviewee.lastName}
          </span>
        </label>
        <label>
          <span>Reviewer: </span>
          <span>
            {reviewer.firstName} {reviewer.lastName}
          </span>
        </label>
        <p>{text}</p>
        <label>
          <span>Completed: </span>
          <span>{completed ? 'YES' : 'NO'}</span>
        </label>
      </div>
    </>
  );
};
