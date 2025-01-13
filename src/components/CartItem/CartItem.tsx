import { FC } from "react";
import { Product } from "../../services/graphql/types";
import Attribute from "../Attribute/Attribute";
import { toKebabCase } from "../../utils/helpers";

interface CartItemProps {
  item: Product;
  quantity: number;
  selectedAttributes: { [key: string]: string };
  onUpdateQuantity: (productId: string, quantity: number, attributes: { [key: string]: string }) => void;
  onRemoveFromCart: (productId: string, attributes: { [key: string]: string }) => void;
}
const CartItem: FC<CartItemProps> = ({
  item,
  quantity,
  selectedAttributes,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(item.id, newQuantity, selectedAttributes)
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      onRemoveFromCart(item.id, selectedAttributes);
    } else {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="row">
      <div className="col">
        <div className="row fw-bold">{item.name}</div>
        <div className="row fs-5">${item.price}</div>
        {item.attributes?.map((attribute) => (
          <div
            key={attribute.id}
            data-testid={`cart-item-attribute-${toKebabCase(attribute.name)}`}
          >
            <Attribute
              attribute={attribute}
              selectedValue={selectedAttributes[attribute.id]}
              variant="cart"
            />
          </div>
        ))}
      </div>
      <div className="col-1">
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            data-testid="cart-item-amount-increase"
          >
            +
          </button>
          <span data-testid="cart-item-amount">{quantity}</span>
          <button
            onClick={handleDecrease}
            data-testid="cart-item-amount-decrease"
          >
            -
          </button>
        </div>
      </div>
      <div
        className="col p-0 product-image"
        style={{
          backgroundImage: `url(${item.gallery?.[0]})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "121px",
          height: "190px",
        }}
      />
    </div>
  );
};
export default CartItem;
