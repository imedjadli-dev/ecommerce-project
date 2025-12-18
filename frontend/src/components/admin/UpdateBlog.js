import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getSingleBlog,
  updateBlog,
} from "../../actions/blogActions";
import { UPDATE_BLOG_RESET } from "../../constants/blogConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.blog);
  const { error, blog } = useSelector((state) => state.blogDetails);

  /* Load blog */
  useEffect(() => {
    if (!blog || blog._id !== id) {
      dispatch(getSingleBlog(id));
    } else {
      setTitle(blog.title);
      setDescription(blog.description);
      setOldImages(blog.images || []);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Blog updated successfully");
      navigate("/admin/blogs");
      dispatch({ type: UPDATE_BLOG_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, blog, id, navigate]);

  /* Submit */
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateBlog(id, formData));
  };

  /* Image handler */
  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      setImages((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <Infos title="Update Blog" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <div className="wrapper my-5">
            <form
              className="shadow-lg p-4"
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <h2 className="mb-4 text-center">Update Blog</h2>

              <div className="form-group mb-3">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group mb-3">
                <label>Images</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={onChange}
                  multiple
                />
              </div>

              {/* Old Images */}
              {oldImages &&
                oldImages.map((img) => (
                  <img
                    key={img}
                    src={`http://localhost:4000/blogs/${img}`}
                    alt="Old Blog"
                    className="mt-2 mr-2"
                    width="55"
                    height="52"
                  />
                ))}

              {/* New Images Preview */}
              {imagesPreview.map((img, index) => (
                <img
                  src={img}
                  key={index}
                  alt="Preview"
                  className="mt-2 mr-2"
                  width="55"
                  height="52"
                />
              ))}

              <button
                type="submit"
                className="btn btn-dark btn-block mt-4"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Blog"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateBlog;
