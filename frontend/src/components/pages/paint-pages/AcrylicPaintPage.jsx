import React from "react";
import ProductList from "../../ProductList";

const AcrylicPaintPage = () => {
  return (
    <section className="acrylic-paint-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Acrylic Paint</h2>
      <ProductList category="acrylic-paint" />
    </section>
  );
};
export default AcrylicPaintPage;
