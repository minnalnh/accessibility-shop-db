import React from "react";
import ProductList from "../../ProductList";

const FlatBrushesPage = () => {
  return (
    <section className="flat-brushes-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Flat Brushes</h2>
      <ProductList category="flat-brushes" />
    </section>
  );
};
export default FlatBrushesPage;
