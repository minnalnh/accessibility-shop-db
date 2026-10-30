import React from "react";
import ProductList from "../../ProductList";

const FanBrushesPage = () => {
  return (
    <section className="fan-brushes-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Fan Brushes</h2>
      <ProductList category="fan-brushes" />
    </section>
  );
};
export default FanBrushesPage;
