import React from "react";
import ProductList from "../../ProductList";

const WatercolorPaintPage = () => {
  return (
    <section className="watercolor-paint-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Watercolor Paint</h2>
      <ProductList category="watercolor-paint" />
    </section>
  );
};
export default WatercolorPaintPage;
