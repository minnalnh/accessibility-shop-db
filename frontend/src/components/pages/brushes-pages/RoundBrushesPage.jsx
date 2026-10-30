import React from "react";
import ProductList from "../../ProductList";

const RoundBrushesPage = () => {
  return (
    <section className="round-brushes-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Round Brushes</h2>
      <ProductList category="round-brushes" />
    </section>
  );
};
export default RoundBrushesPage;
