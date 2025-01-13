import { FC, useEffect, useContext } from 'react';
import { CartContext } from "../../context/CartContext";
import CartItem from "../CartItem/CartItem";
import "./CartOverlay.css";
import "../CartItem/CartItem.css";
import Backdrop from "../Backdrop/Backdrop";

// Overlay component for displaying cart contents and total
const CartOverlay: FC = () => {
  const { items, updateQuantity, removeFromCart, placeOrder } = useContext(CartContext);
  
  // Calculate total price of all items in cart
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    await placeOrder();
  };

  // Handle body scroll lock when overlay is open
  useEffect(() => {
    const scrollPosition = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
    document.body.classList.add('cart-open')
    
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.classList.remove('cart-open')
      window.scrollTo(0, scrollPosition)
    }
  }, [])
  return (
    <>
    <Backdrop />
    <div className="cart-overlay " data-testid="cart-overlay">
      <div className="cart-header ">
        <span className="cart-title">My Bag,</span>
        <span className="items-count">{items.length} items</span>
      </div>

      <div className="cart-items">
        {items.map(({ product, quantity, Attributes }) => (
          <div
            key={`${product.id}-${JSON.stringify(Attributes)}`}
            className="cart-item py-1"
          >
            <CartItem
              item={product}
              quantity={quantity}
              selectedAttributes={Attributes}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
            />
          </div>
        ))}
      </div>
        <div className="cart-footer">
          <div className="total d-flex justify-content-between" data-testid="cart-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <button 
              className="place-order-button" 
              disabled={items.length === 0}
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartOverlay;
