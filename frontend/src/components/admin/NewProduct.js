import React, { Fragment, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../actions/categoryActions";
import { clearErrors, newProduct } from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.allCategories);
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [stockError, setStockError] = useState("");
  const [sellerError, setSellerError] = useState("");

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product created successfully");
      navigate("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      setImagesPreview((oldArray) => [...oldArray, URL.createObjectURL(file)]);
      setImages((oldArray) => [...oldArray, file]);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setPriceError("");
    setCategoryError("");
    setDescriptionError("");
    setStockError("");
    setSellerError("");

    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!price) {
      setPriceError("Price is required");
      isValid = false;
    }
    if (!category) {
      setCategoryError("Category is required");
      isValid = false;
    }
    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    }
    if (!stock) {
      setStockError("Stock is required");
      isValid = false;
    }
    if (!seller.trim()) {
      setSellerError("Seller is required");
      isValid = false;
    }

    if (!isValid) return;

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("category", category);
    formData.set("description", description);
    formData.set("stock", stock);
    formData.set("seller", seller);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(newProduct(formData));
  };

  return (
    <Fragment>
      <Infos title="Create Product" />
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
                        <h2 className="mb-2">Create Product</h2>
                      </div>

                      <form
                        onSubmit={submitHandler}
                        encType="multipart/form-data"
                      >
                        {/* Name and Seller */}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-outline mb-4">
                              <label
                                htmlFor="name_field"
                                className="form-label"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                id="name_field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`form-control form-control-lg ${
                                  nameError ? "is-invalid" : ""
                                }`}
                                placeholder="Product Name"
                              />
                              {nameError && (
                                <div className="invalid-feedback">
                                  {nameError}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-outline mb-4">
                              <label
                                htmlFor="seller_field"
                                className="form-label"
                              >
                                Seller
                              </label>
                              <input
                                type="text"
                                id="seller_field"
                                value={seller}
                                onChange={(e) => setSeller(e.target.value)}
                                className={`form-control form-control-lg ${
                                  sellerError ? "is-invalid" : ""
                                }`}
                                placeholder="Seller"
                              />
                              {sellerError && (
                                <div className="invalid-feedback">
                                  {sellerError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price and Stock */}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-outline mb-4">
                              <label
                                htmlFor="price_field"
                                className="form-label"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                id="price_field"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={`form-control form-control-lg ${
                                  priceError ? "is-invalid" : ""
                                }`}
                              />
                              {priceError && (
                                <div className="invalid-feedback">
                                  {priceError}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-outline mb-4">
                              <label
                                htmlFor="stock_field"
                                className="form-label"
                              >
                                Stock
                              </label>
                              <input
                                type="number"
                                id="stock_field"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className={`form-control form-control-lg ${
                                  stockError ? "is-invalid" : ""
                                }`}
                              />
                              {stockError && (
                                <div className="invalid-feedback">
                                  {stockError}
                                </div>
                              )}
                            </div>
                          </div>
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

                        {/* Category */}
                        <div className="form-group mb-4">
                          <label>Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`form-control ${
                              categoryError ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">Choose Category</option>
                            {categories &&
                              categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                          {categoryError && (
                            <div className="invalid-feedback">
                              {categoryError}
                            </div>
                          )}
                        </div>

                        {/* Images */}
                        <div className="form-group mb-4">
                          <label>Images</label>
                          <input
                            type="file"
                            name="product_images"
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
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Add Product
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

export default NewProduct;
