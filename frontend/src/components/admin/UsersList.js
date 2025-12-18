import { MDBDataTable } from "mdbreact";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { allUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstantes";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { isDeleted } = useSelector((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
      dispatch(allUsers());
      navigate("/admin/users");
    }
  }, [dispatch, error, isDeleted, navigate]);

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUser(selectedUserId));
    setShowModal(false);
  };

  const cancelDelete = () => {
    setSelectedUserId(null);
    setShowModal(false);
  };

  const setUsersData = () => {
    const data = {
      columns: [
        { label: "User ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Email", field: "email", sort: "asc" },
        { label: "Role", field: "role", sort: "asc" },
        { label: "Actions", field: "actions" },
      ],
      rows: [],
    };

    users &&
      users.forEach((user) => {
        data.rows.push({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          actions: (
            <Fragment>
              <Link
                to={`/admin/user/${user._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-pencil" />
              </Link>

              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => openDeleteModal(user._id)}
              >
                <i className="fa fa-trash" />
              </button>
            </Fragment>
          ),
        });
      });

    return data;
  };

  return (
    <Fragment>
      <Infos title="All Users" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <h1 className="my-5">All Users</h1>

          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <MDBDataTable
                data={setUsersData()}
                className="px-3"
                bordered
                striped
                hover
              />

              {/* Confirmation Modal */}
              <Modal show={showModal} onHide={cancelDelete} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this user?
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

export default UsersList;
