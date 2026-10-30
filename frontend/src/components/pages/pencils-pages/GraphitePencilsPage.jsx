import React from "react";
import ProductList from "../../ProductList";

const GraphitePencilsPage = () => {
  return (
    <section className="graphite-pencils-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Graphite Pencils</h2>
      <ProductList category="graphite-pencils" />
    </section>
  );
};
export default GraphitePencilsPage;
