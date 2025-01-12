import { FC, useContext } from "react";
import { Product } from "../../services/graphql/types";
import { CartContext } from "../../context/CartContext";
import { WhiteCartIcon } from "../Icons/WhiteCartIcon";
import { toKebabCase } from "../../utils/helpers";
import "./ProductCard.css";

// Card component for displaying product information in grid view
interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Initialize default attributes for quick add to cart
  const getDefaultAttributes = () => {
    const defaultAttributes: { [key: string]: string } = {};
    product.attributes?.forEach((attr) => {
      defaultAttributes[attr.id] = attr.items[0].id;
    });
    return defaultAttributes;
  };

  return (    <div
      className="product-card"
      data-testid={`product-${toKebabCase(product.name)}`}
    >
      <img
        src={product.gallery?.[0]}
        alt={product.name}
        className="product-image"
      />
      {!product.in_stock && (
        <div className="out-of-stock-overlay">
          <span>OUT OF STOCK</span>
        </div>
      )}
      {product.in_stock && (
        <button
          className="quick-add-button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, getDefaultAttributes());
          }}
        >
          <WhiteCartIcon />
        </button>
      )}

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">${product.price}</span>
      </div>
    </div>
  );
};
export default ProductCard;
