export interface Product {
  id: string
  name: string
  description: string
  brand: string
  in_stock: boolean
  price: number
  gallery: string[]
  attributes: Attribute[]
}

export interface Attribute {
  id: string
  name: string
  type: string
  items: AttributeItem[]
}

export interface AttributeItem {
  id: string
  displayValue: string
  value: string
}

export interface AttributeSet {
  id: string
  items: AttributeItem[]
  name: string
  type: string
}

export interface Category {
  id: string
  name: string
  products: Product[]
}

export interface OrderItem {
  product_id: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  status: string
  items: OrderItem[]
}
