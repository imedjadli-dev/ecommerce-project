import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategories } from "../../actions/categoryActions";
import {
  clearErrors,
  getSingleProduct,
  updateProduct,
} from "../../actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { categories = [] } = useSelector((state) => state.allCategories);
  const { product, error } = useSelector((state) => state.ProductDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  /* Load categories + product */
  useEffect(() => {
    dispatch(getAllCategories());

    if (!product || product._id !== id) {
      dispatch(getSingleProduct(id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setSeller(product.seller);
      setStock(product.stock);
      setOldImages(product.images || []);
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
      toast.success("Product updated successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, id, product, error, updateError, isUpdated, navigate]);

  /* Image upload */
  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages(files);
  };

  /* Submit */
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);
    formData.set("seller", seller);

    images.forEach((img) => {
      formData.append("images", img);
    });

    dispatch(updateProduct(id, formData));
  };

  return (
    <Fragment>
      <Infos title="Update Product" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <div className="login-form border p-5">
            <h2 className="text-center mb-4">Update Product</h2>

            <form onSubmit={submitHandler} encType="multipart/form-data">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Seller</label>
                  <input
                    type="text"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label>Description</label>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  style={{ height: "200px" }}
                />
              </div>

              <div className="mb-3">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Choose category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label>Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={onChange}
                />

                <div className="mt-3">
                  {oldImages.map((img) => (
                    <img
                      key={img}
                      src={`http://localhost:4000/products/${img}`}
                      alt={img}
                      width="55"
                      height="52"
                      className="mr-2"
                    />
                  ))}

                  {imagesPreview.map((img) => (
                    <img
                      key={img}
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
                className="btn btn-dark btn-block"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
