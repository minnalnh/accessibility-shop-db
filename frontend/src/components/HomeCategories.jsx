import { Link } from "react-router-dom";

const categories = [
    {
        title: "Brushes",
        products: [
            { image: "json-images/round-brush-set-of-3.png", alt: "Round Brush Set of 3", to: "/round-brushes" },
            { image: "json-images/bristle-fan-brush.png", alt: "Bristle Fan Brush", to: "/fan-brushes" },
        ],
    },
    {
        title: "Paint",
        products: [
            { image: "json-images/cadmium-yellow.png", alt: "Cadmium Yellow Paint", to: "/oil-paint" },
            { image: "json-images/cobalt-blue.png", alt: "Cobalt Blue Paint", to: "/watercolor-paint" },
        ],
    },
    {
        title: "Paper",
        products: [
            { image: "json-images/canvas-panel-set.png", alt: "Canvas Panel Set Paper", to: "/canvas-paper" },
            { image: "json-images/cold-pressed-watercolor-pad.png", alt: "Cold-Pressed Watercolor Pad", to: "/watercolor-paper" },
        ],
    },
    {
        title: "Pencils",
        products: [
            { image: "json-images/premium-graphite-pencil-set.png", alt: "Premium Graphite Pencil Set", to: "/graphite-pencils" },
            { image: "json-images/watercolor-pencil-set.png", alt: "Watercolor Pencil Set", to: "/colored-pencils" },
        ],
    },
];

const HomeCategories = () => {
    return (
        <div>
            <h2>Popular Products:</h2>
            <hr />
            <div className="flex-container home-categories">
                {categories.map((category) => (
                    <div key={category.title} className="item">
                        <h3 className="category-title">{category.title}</h3>
                        <div className="category product-img-container">
                            {category.products.map((product) => (
                                <Link key={product.image} to={product.to} className="home-img-link">
                                    <img src={product.image} alt={product.alt} className="product-img home-img"></img>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <br />
        </div>
    )
}

export default HomeCategories;
