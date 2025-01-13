import { FC, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGraphQL } from "../../services/graphql/client";
import { GET_CATEGORIES } from "../../services/graphql/queries";
import { Category } from "../../services/graphql/types";
import { Logo } from "../Icons/Logo";
import { CartIcon } from "../Icons/CartIcon";
import { CartContext } from "../../context/CartContext";
import CartOverlay from "../CartOverlay/CartOverlay";
import "./Header.css";

interface CategoriesResponse {
  data: {
    categories: Category[];
  };
}

const Header: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCart, setShowCart] = useState(false);
  const { items } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchGraphQL<CategoriesResponse>(GET_CATEGORIES);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <header>
      <div className="container d-flex justify-content-between align-items-center py-4">
        <nav className="d-flex gap-4">
          {categories.map((category) => {
            const path = `/${category.name.toLowerCase()}`;
            const isActive = location.pathname === path;

            return (
              <a
                key={category.id}
                href={path}
                data-testid={isActive ? "active-category-link" : "category-link"}
                className={`text-decoration-none ${
                  isActive
                    ? "fw-bold text-success border-bottom border-success"
                    : "text-dark"
                }`}
                onClick={(e) => handleCategoryClick(e, path)}
              >
                {category.name.toLocaleUpperCase()}
              </a>
            );
          })}
        </nav>

        <div className="position-absolute start-50 translate-middle-x">
          <Logo />
        </div>

        <div className="position-relative">
          <button
            className="btn btn-link position-relative p-0"
            onClick={() => setShowCart(!showCart)}
            data-testid="cart-btn"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                {itemCount}
              </span>
            )}
          </button>
          {showCart && <CartOverlay />}
        </div>
      </div>
    </header>
  );
};

export default Header;