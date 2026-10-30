import React from "react";
import ProductList from "../../ProductList";

const ColoredPencilsPage = () => {
  return (
    <section className="colored-pencils-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Colored Pencils</h2>
      <ProductList category="colored-pencils" />
    </section>
  );
};
export default ColoredPencilsPage;
