import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, newBlog } from "../../actions/blogActions";
import { NEW_BLOG_RESET } from "../../constants/blogConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newBlog);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Blog created successfully");
      navigate("/admin/blogs");
      dispatch({ type: NEW_BLOG_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      setImages((oldArray) => [...oldArray, file]);
      setImagesPreview((oldArray) => [...oldArray, URL.createObjectURL(file)]);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setTitleError("");
    setDescriptionError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(newBlog(formData));
  };

  return (
    <Fragment>
      <Infos title="Create Blog" />
      <div className="row">
        <div className="col-lg-3">
          <Sidebar />
        </div>
        <div className="col-lg-9">
          <div className="signUp-container">
            <div className="account section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="login-form border p-5">
                      <div className="text-center heading">
                        <h2 className="mb-2">Create Blog</h2>
                      </div>
                      <form
                        onSubmit={submitHandler}
                        encType="multipart/form-data"
                      >
                        {/* Title */}
                        <div className="form-group mb-4">
                          <label htmlFor="title_field">Title</label>
                          <input
                            type="text"
                            id="title_field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`form-control ${
                              titleError ? "is-invalid" : ""
                            }`}
                            placeholder="Blog Title"
                          />
                          {titleError && (
                            <div className="invalid-feedback">{titleError}</div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="form-group mb-4">
                          <label>Description</label>
                          <ReactQuill
                            value={description}
                            onChange={handleDescriptionChange}
                            className={`form-control ${
                              descriptionError ? "is-invalid" : ""
                            }`}
                          />
                          {descriptionError && (
                            <div className="invalid-feedback">
                              {descriptionError}
                            </div>
                          )}
                        </div>

                        {/* Images */}
                        <div className="form-group mb-4">
                          <label>Images</label>
                          <input
                            type="file"
                            name="blog_images"
                            className="form-control"
                            onChange={onChange}
                            multiple
                          />
                          <div className="mt-2">
                            {imagesPreview.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt="Preview"
                                width="55"
                                height="52"
                                className="mr-2"
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-dark btn-lg btn-block"
                          disabled={loading}
                        >
                          CREATE
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewBlog;
