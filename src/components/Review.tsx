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
          <strong>Reviewee: </strong>
          <span>
            {reviewee.firstName} {reviewee.lastName}
          </span>
        </label>
        <label>
          <strong>Reviewer: </strong>
          <span>
            {reviewer.firstName} {reviewer.lastName}
          </span>
        </label>
        {text && <p>{text}</p>}
        <label>
          <strong>Completed: </strong>
          <span>{completed ? 'YES' : 'NO'}</span>
        </label>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
        }

        p {
          padding: 1em;
          background-color: aqua;
        }
      `}</style>
    </>
  );
};
