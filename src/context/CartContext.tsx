import { createContext, FC, ReactNode, useState, useEffect } from 'react'
import { Product } from '../services/graphql/types'
import { fetchGraphQL } from '../services/graphql/client'
import { CREATE_ORDER } from '../services/graphql/mutations'

// Type definition for product attributes
export interface Attributes {
  [key: string]: string
}

// Interface defining the structure of a cart item
export interface CartItem {
  product: Product
  quantity: number
  Attributes: Attributes
}

// Type definition for the cart context
interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, attributes: { [key: string]: string }) => void
  removeFromCart: (productId: string, attributes: { [key: string]: string }) => void
  updateQuantity: (productId: string, quantity: number) => void
  placeOrder: () => Promise<void>
}

// Create context with default values
export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  placeOrder: async () => {}
})

// Cart Provider component for managing cart state
export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize cart state from localStorage or empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Add product to cart with selected attributes
  const addToCart = (product: Product, selectedAttributes?: Attributes) => {
    const attributes: Attributes = selectedAttributes || {}
    
    // Set default attributes if none provided
    if (!selectedAttributes) {
      product.attributes?.forEach(attr => {
        attributes[attr.id] = attr.items[0].id
      })
    }

    setItems(currentItems => {
      // Check if item with same product and attributes exists
      const existingItem = currentItems.find(item =>
        item.product.id === product.id &&
        JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      )

      // Increment quantity if item exists, otherwise add new item
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id &&
          JSON.stringify(item.Attributes) === JSON.stringify(attributes)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { product, quantity: 1, Attributes: attributes }]
    })
  }

  // Remove item from cart based on product ID and attributes
  const removeFromCart = (productId: string, attributes: { [key: string]: string }) => {
    setItems(prevItems => prevItems.filter(item => {
      const isSameProduct = item.product.id === productId
      const isSameAttributes = JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      return !(isSameProduct && isSameAttributes)
    }))
  }

  // Update quantity of specific cart item
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Process order placement with current cart items
  const placeOrder = async () => {
    try {
      // Format cart items for order submission
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        selected_attributes: Object.entries(item.Attributes).map(([name, attribute_id]) => ({
          name,
          attribute_id
        }))
      }));

      // Submit order to backend
      await fetchGraphQL(CREATE_ORDER, {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: orderItems
      });
      
      // Clear cart after successful order
      setItems([]);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  // Provide cart context to children components
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider