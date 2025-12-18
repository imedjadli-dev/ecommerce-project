import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import {
  clearErrors,
  deleteProduct,
  getAdminProducts,
} from "../../actions/productActions";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstantes";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Open confirmation modal
  const deleteProductHandler = (id) => {
    setProductToDelete(id);
    setShowConfirmation(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    dispatch(deleteProduct(productToDelete));
    setShowConfirmation(false);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setProductToDelete(null);
    setShowConfirmation(false);
  };

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product deleted successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, toast, error, deleteError, isDeleted, navigate]);

  // Prepare table data
  const setProducts = () => {
    const data = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Price", field: "price", sort: "asc" },
        { label: "Stock", field: "stock", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    if (products) {
      products.forEach((product) => {
        data.rows.push({
          id: product._id,
          name: product.name,
          price: `${product.price} DT`,
          stock: product.stock,
          actions: (
            <Fragment>
              <Link
                to={`/admin/product/${product._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>

              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => deleteProductHandler(product._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </Fragment>
          ),
        });
      });
    }

    return data;
  };

  return (
    <Fragment>
      <Infos title="All products" />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <h1 className="my-5">All Products</h1>

          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <MDBDataTable
                data={setProducts()}
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
                  Are you sure you want to delete this product?
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
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductsList;
