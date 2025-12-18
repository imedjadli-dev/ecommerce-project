import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const Search = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const searchHandler = useCallback(
    (e) => {
      e.preventDefault();

      const query = keyword.trim();
      navigate(query ? `/search/${query}` : "/");
    },
    [keyword, navigate]
  );

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group d-flex align-items-center">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search products"
        />

        <button type="submit" className="btn" aria-label="Search">
          <i className="fa fa-search" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

export default Search;
