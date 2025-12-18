import React, { Fragment, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getSingleBlog } from "../../actions/blogActions";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";

const BlogsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, blog } = useSelector((state) => state.blogDetails);

  useEffect(() => {
    if (id) {
      dispatch(getSingleBlog(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const title = blog?.title || "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}&text=${encodeURIComponent(`Check out this blog post: ${title}`)}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        blog && (
          <Fragment>
            <div className="row f-flex justify-content-around mt-4">
              <div
                className="col-12 col-lg-5 img-fluid"
                style={{ maxHeight: "500px" }}
              >
                {blog.images?.length > 0 && (
                  <Carousel pause="hover">
                    {blog.images.map((image, idx) => (
                      <Carousel.Item key={idx}>
                        <img
                          className="d-block w-100"
                          src={`http://localhost:4000/blogs/${image}`}
                          alt={blog.title}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>

              <div className="col-12 col-lg-5 mt-5">
                <h3>{blog.title}</h3>
                <p className="info">
                  <span className="author">Author: {blog.user?.name}</span>
                  <time className="ml-3">
                    {blog.createdAt?.substring(0, 10)}
                  </time>
                </p>

                <div dangerouslySetInnerHTML={{ __html: blog.description }} />

                <h5 className="mt-4">Share on social media:</h5>
                <div className="share-buttons">
                  <i
                    className="fa fa-facebook-square"
                    onClick={() => handleShare("facebook")}
                    style={{
                      fontSize: "30px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <i
                    className="fa fa-instagram"
                    onClick={() => handleShare("instagram")}
                    style={{
                      fontSize: "30px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <i
                    className="fa fa-twitter-square"
                    onClick={() => handleShare("twitter")}
                    style={{
                      fontSize: "30px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </Fragment>
        )
      )}
    </Fragment>
  );
};

export default BlogsDetails;
