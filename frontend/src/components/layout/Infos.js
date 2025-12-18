import React from "react";
import { Helmet } from "react-helmet";

const Infos = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - Ecommerce`}</title>
    </Helmet>
  );
};

export default Infos;
