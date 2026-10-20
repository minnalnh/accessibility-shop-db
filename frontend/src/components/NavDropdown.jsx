import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const NavDropdown = ({ id, title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={() => setIsOpen((open) => !open)}
        className="mx-2 mt-[1.3em] cursor-pointer border-none bg-transparent px-3 py-1.5 text-[1.2rem] text-button hover:bg-button-hover hover:text-white"
      >
        {title}
      </button>

      {isOpen && (
        <ul
          id={`${id}-menu`}
          className="absolute left-0 z-10 m-0 mt-1 min-w-48 list-none rounded-lg bg-white py-2 pl-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
        >
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-5 py-2.5 text-button hover:font-bold hover:underline"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavDropdown;
