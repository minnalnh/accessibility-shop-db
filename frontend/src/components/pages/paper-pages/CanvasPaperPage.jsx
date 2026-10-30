import React from "react";
import ProductList from "../../ProductList";

const BrushesPage = () => {
  return (
    <section className="canvas-paper-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Canvas Paper</h2>
      <ProductList category="canvas-paper" />
    </section>
  );
};
export default BrushesPage;
