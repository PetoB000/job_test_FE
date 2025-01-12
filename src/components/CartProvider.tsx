import { FC, ReactNode, useState } from 'react'
import { Product } from '../services/graphql/types'

import { CartContext, CartItem, Attributes } from '../context/CartContext'
import { fetchGraphQL } from '../services/graphql/client'
import { CREATE_ORDER } from '../services/graphql/mutations'



interface CartProviderProps {
  children: ReactNode
}


export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  const addToCart = (product: Product, attributes: Attributes) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item =>
        item.product.id === product.id &&

        JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      )

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



  const removeFromCart = (productId: string, attributes: Attributes) => {
    setItems(prevItems => prevItems.filter(item => {
      const isSameProduct = item.product.id === productId
      const isSameAttributes = JSON.stringify(item.Attributes) === JSON.stringify(attributes)
      return !(isSameProduct && isSameAttributes)
    }))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const placeOrder = async () => {
    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        selected_attributes: Object.entries(item.Attributes).map(([name, attribute_id]) => ({
          name,
          attribute_id
        }))
      }))

      await fetchGraphQL(CREATE_ORDER, { 
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: orderItems 
      })
      
      setItems([])
    } catch (error) {
      console.error('Failed to place order:', error)
    }
  }

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