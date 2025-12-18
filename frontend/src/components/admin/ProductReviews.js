import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import {
  clearErrors,
  deleteProductReview,
  getProductsReviews,
} from "../../actions/productActions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [productId, setProductId] = useState(id || "");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const { error, reviews } = useSelector((state) => state.productReviews);
  const { isDeleted } = useSelector((state) => state.review);

  // Open confirmation modal
  const deleteReviewHandler = (id) => {
    setReviewToDelete(id);
    setShowConfirmation(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    dispatch(deleteProductReview(reviewToDelete, productId));
    setShowConfirmation(false);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setReviewToDelete(null);
    setShowConfirmation(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (productId !== "") {
      dispatch(getProductsReviews(productId));
    }

    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      navigate("/admin/reviews");
    }
  }, [dispatch, toast, error, productId, isDeleted, navigate]);

  // Handle form submit to fetch reviews
  const submitHandler = (e) => {
    e.preventDefault();
    if (productId !== "") {
      dispatch(getProductsReviews(productId));
    }
  };

  // Prepare table data
  const setReviews = () => {
    const data = {
      columns: [
        { label: "Review ID", field: "id", sort: "asc" },
        { label: "Rating", field: "rating", sort: "asc" },
        { label: "Comment", field: "comment", sort: "asc" },
        { label: "User", field: "user", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    if (reviews) {
      reviews.forEach((review) => {
        data.rows.push({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          user: review.name,
          actions: (
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteReviewHandler(review._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          ),
        });
      });
    }

    return data;
  };

  return (
    <Fragment>
      <Infos title="Product Reviews" />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="row justify-content-center mt-5">
              <div className="col-5">
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="productId_field">Enter Product ID</label>
                    <input
                      type="text"
                      id="productId_field"
                      className="form-control"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>

            {reviews && reviews.length > 0 ? (
              <Fragment>
                <MDBDataTable
                  data={setReviews()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />

                <Modal show={showConfirmation} onHide={cancelDelete}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete this review?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Fragment>
            ) : (
              <p className="mt-5 text-center">No Reviews</p>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
