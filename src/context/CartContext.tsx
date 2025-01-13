import { createContext, FC, ReactNode, useState, useEffect } from 'react'
import { Product } from '../services/graphql/types'
import { fetchGraphQL } from '../services/graphql/client'
import { CREATE_ORDER } from '../services/graphql/mutations'
import CartOverlay from '../components/CartOverlay/CartOverlay'

// Define interface for product attributes
export interface Attributes {
  [key: string]: string
}

// Define structure for cart items
export interface CartItem {
  product: Product
  quantity: number
  Attributes: Attributes
}

// Define the shape of our cart context
interface CartContextType {
  items: CartItem[]
  showCart: boolean
  setShowCart: (show: boolean) => void
  addToCart: (product: Product, attributes: { [key: string]: string }) => void
  removeFromCart: (productId: string, attributes: { [key: string]: string }) => void
  updateQuantity: (productId: string, quantity: number) => void
  placeOrder: () => Promise<void>
}

// Create context with default values
export const CartContext = createContext<CartContextType>({
  items: [],
  showCart: false,
  setShowCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  placeOrder: async () => {}
})

// Cart Provider component that wraps the app and provides cart functionality
export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize cart state from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  // State for controlling cart overlay visibility
  const [showCart, setShowCart] = useState(false)

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Add product to cart with selected or default attributes
  const addToCart = (product: Product, selectedAttributes?: Attributes) => {
    const attributes: Attributes = selectedAttributes || {}
    
    // Set default attributes if none provided
    if (!selectedAttributes) {
      product.attributes?.forEach(attr => {
        attributes[attr.id] = attr.items[0].id
      })
    }

    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItem = currentItems.find(item =>
        item.product.id === product.id &&
        JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      )

      // Update quantity if item exists, otherwise add new item
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
    // Auto-open cart overlay when item is added
    setShowCart(true)
  }

  // Remove specific item from cart
  const removeFromCart = (productId: string, attributes: { [key: string]: string }) => {
    setItems(prevItems => prevItems.filter(item => {
      const isSameProduct = item.product.id === productId
      const isSameAttributes = JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      return !(isSameProduct && isSameAttributes)
    }))
  }

  // Update quantity of specific item in cart
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Process order placement
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
      }))

      // Submit order to backend
      await fetchGraphQL(CREATE_ORDER, {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: orderItems
      })
      
      // Clear cart and close overlay after successful order
      setItems([])
      setShowCart(false)
    } catch (error) {
      console.error('Failed to place order:', error)
    }
  }

  // Provide cart context and render cart overlay when visible
  return (
    <CartContext.Provider value={{
      items,
      showCart,
      setShowCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      placeOrder
    }}>
      {children}
      {showCart && <CartOverlay />}
    </CartContext.Provider>
  )
}

export default CartProvider