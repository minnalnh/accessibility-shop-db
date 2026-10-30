import React from "react";
import ProductList from "../../ProductList";

const CharcoalPencilsPage = () => {
  return (
    <section className="charcoal-pencils-page">
      <h1 className="page-title">Brushes</h1>
      <article className="shopping-page-img">
        <p className="sr-only">Painting brush getting dipped in paint</p>
      </article>
      <h2>Charcoal Pencils</h2>
      <ProductList category="charcoal-pencils" />
    </section>
  );
};
export default CharcoalPencilsPage;
