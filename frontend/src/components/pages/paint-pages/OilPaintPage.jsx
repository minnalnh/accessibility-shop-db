import React from "react";
import ProductList from "../../ProductList";

const OilPaintPage = () => {
  return (
    <section className="oil-paint-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Oil Paint</h2>
      <ProductList category="oil-paint" />
    </section>
  );
};
export default OilPaintPage;
