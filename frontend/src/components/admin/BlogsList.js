import { MDBDataTable } from "mdbreact";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearErrors,
  deleteBlog,
  getAdminBlogs,
} from "../../actions/blogActions";
import { DELETE_BLOG_RESET } from "../../constants/blogConstantes";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const BlogsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, blogs } = useSelector((state) => state.allBlogs);
  const { isDeleted, error: deleteError } = useSelector((state) => state.blog);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const deleteBlogHandler = (id) => {
    setBlogToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    dispatch(deleteBlog(blogToDelete));
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setBlogToDelete(null);
    setShowConfirmation(false);
  };

  useEffect(() => {
    dispatch(getAdminBlogs());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Blog deleted successfully");
      dispatch({ type: DELETE_BLOG_RESET });
      navigate("/admin/blogs");
    }
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const setBlogs = () => {
    const data = {
      columns: [
        { label: "Blog ID", field: "id", sort: "asc" },
        { label: "Title", field: "title", sort: "asc" },
        { label: "Description", field: "description", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    if (blogs && blogs.length > 0) {
      blogs.forEach((blog) => {
        let description = blog.description;
        if (description.length > 100) {
          description = description.slice(0, 100) + "...";
        }

        data.rows.push({
          id: blog._id,
          title: blog.title,
          description: (
            <Fragment>
              <div>
                {description}
                {blog.description.length > 100 && (
                  <Link
                    to={`/admin/blogs/blog/${blog._id}`}
                    className="btnRead"
                  >
                    read more
                  </Link>
                )}
              </div>
            </Fragment>
          ),
          actions: (
            <Fragment>
              <Link
                to={`/admin/blogs/blog/${blog._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>

              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => deleteBlogHandler(blog._id)}
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
      <Infos title={"All Blogs"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Blogs</h1>

            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setBlogs()}
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
                    Are you sure you want to delete this blog?
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

export default BlogsList;
