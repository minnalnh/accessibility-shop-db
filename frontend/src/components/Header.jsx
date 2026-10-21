import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Settings from "./Settings";
import ShoppingCart from "./ShoppingCart";
import MenuButton from "./MenuButton";
import Account from "./Account";
import NavDropdown from "./NavDropdown";
import { CartContext } from "./CartContext";

const categories = [
  {
    id: "brushes",
    title: "Brushes",
    items: [
      { label: "Fan Brushes", path: "/fan-brushes" },
      { label: "Round Brushes", path: "/round-brushes" },
      { label: "Flat Brushes", path: "/flat-brushes" },
    ],
  },
  {
    id: "paint",
    title: "Paint",
    items: [
      { label: "Acrylic Paint", path: "/acrylic-paint" },
      { label: "Oil Paint", path: "/oil-paint" },
      { label: "Watercolor Paint", path: "/watercolor-paint" },
    ],
  },
  {
    id: "paper",
    title: "Paper",
    items: [
      { label: "Watercolor Paper", path: "/watercolor-paper" },
      { label: "Drawing Paper", path: "/drawing-paper" },
      { label: "Canvas Paper", path: "/canvas-paper" },
    ],
  },
  {
    id: "pencils",
    title: "Pencils",
    items: [
      { label: "Graphite Pencils", path: "/graphite-pencils" },
      { label: "Colored Pencils", path: "/colored-pencils" },
      { label: "Charcoal Pencils", path: "/charcoal-pencils" },
    ],
  },
];

const Header = () => {
  const [activeBox, setActiveBox] = useState(null);
  const location = useLocation();
  const { notice, clearNotice } = useContext(CartContext);

  useEffect(() => {
    if (notice) setActiveBox(notice.type === "login" ? "account" : "shopping");
  }, [notice]);

  useEffect(() => {
    if (activeBox !== "shopping" && activeBox !== "account") clearNotice();
  }, [activeBox]);

  const toggleBoxVisibility = (boxName) => {
    setActiveBox((currentBox) => (currentBox === boxName ? null : boxName));
  };

  const handleCloseButtonClick = () => {
    setActiveBox(null);
  };

  const breadcrumbTrail = location.pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, paths) => ({
      name: path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      url: `/${paths.slice(0, index + 1).join("/")}`,
    }));

  return (
    <>
      {activeBox && <div className="shadow-box" />}
      <div className="header">
        <div className="flex-container">
          <Link to="/" className="logo">
            Art Supplies
          </Link>

          <div className="settings-action">
            <Settings
              isBoxVisible={activeBox === "accessibility"}
              toggleBoxVisibility={toggleBoxVisibility}
              handleCloseButtonClick={handleCloseButtonClick}
            />
          </div>

          <div className="top-actions">
            <ShoppingCart
              isBoxVisible={activeBox === "shopping"}
              toggleBoxVisibility={toggleBoxVisibility}
              handleCloseButtonClick={handleCloseButtonClick}
            />

            <Account
              isBoxVisible={activeBox === "account"}
              toggleBoxVisibility={toggleBoxVisibility}
              handleCloseButtonClick={handleCloseButtonClick}
              closeBox={handleCloseButtonClick}
            />
          </div>
        </div>

        <nav className="flex-container">
          {categories.map((category) => (
            <div key={category.id} className="hidden md:block">
              <NavDropdown
                id={`dropdown-${category.id}`}
                class="dropdown-button"
                title={category.title}
                items={category.items}
              />
            </div>
          ))}

          <div className="btn-container">
            <div>
              <MenuButton
                isBoxVisible={activeBox === "menu"}
                toggleBoxVisibility={toggleBoxVisibility}
                handleCloseButtonClick={handleCloseButtonClick}
              />
            </div>
          </div>

          <div className="breadcrumb">
            <NavLink to="/" className="home-page-breadcrumb">
              Home Page
            </NavLink>

            {breadcrumbTrail.map((item) => (
              <span key={item.url}>
                <span className="breadcrumb-separator">{" / "}</span>

                <NavLink to={item.url} className="breadcrumb-navlink">
                  <b>{item.name}</b>
                </NavLink>
              </span>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
