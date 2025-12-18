import { MDBDataTable } from "mdbreact";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearErrors,
  deleteCategory,
  getAllCategories,
} from "../../actions/categoryActions";
import { DELETE_CATEGORY_RESET } from "../../constants/categoryConstantes";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const CategoriesList = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, categories } = useSelector(
    (state) => state.allCategories
  );

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.category
  );

  const deleteCategoryHandler = (id) => {
    setCategoryToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCategory(categoryToDelete));
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
    setShowConfirmation(false);
  };

  useEffect(() => {
    dispatch(getAllCategories());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Category deleted successfully");
      dispatch({ type: DELETE_CATEGORY_RESET });
      navigate("/categories");
    }
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const setCategories = () => {
    const data = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Products", field: "products", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        data.rows.push({
          id: category._id,
          name: category.name,
          products: category.products.length,
          actions: (
            <Fragment>
              <Link
                to={`/categorie/${category._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-eye"></i>
              </Link>

              <Link
                to={`/category/${category._id}`}
                className="btn btn-primary py-1 px-2 ml-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>

              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => deleteCategoryHandler(category._id)}
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
      <Infos title={"All Categories"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Categories</h1>

            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setCategories()}
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
                    Are you sure you want to delete this category?
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
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default CategoriesList;
