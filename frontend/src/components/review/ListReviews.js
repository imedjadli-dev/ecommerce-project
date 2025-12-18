import React from "react";

const ListReviews = ({ reviews = [] }) => {
  if (!reviews.length) {
    return <p className="text-muted w-75">No reviews yet.</p>;
  }

  return (
    <div className="reviews w-75">
      {reviews.map((review) => {
        const ratingPercentage = (review.rating / 5) * 100;

        return (
          <div className="review-card my-3" key={review._id}>
            {/*  Rating */}
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${ratingPercentage}%` }}
              />
            </div>

            {/*  Reviewer Info */}
            <p className="review_user mt-2">
              Reviewed At:{" "}
              <strong>{review.commentedAt?.substring(0, 10)}</strong> | By:{" "}
              <strong>{review.name}</strong>
            </p>

            {/*  Comment */}
            <p>
              <strong>Comment:</strong> {review.comment}
            </p>

            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default ListReviews;
