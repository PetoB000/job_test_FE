export const CREATE_ORDER = `
  mutation CreateOrder(
    $customerName: String!, 
    $customerEmail: String!, 
    $items: [OrderItemInput!]!
  ) {
    createOrder(
      customer_name: $customerName,
      customer_email: $customerEmail,
      items: $items
    ) {
      id
      customer_name
      customer_email
      status
      items {
        product_id
        quantity
        price
        selected_attributes {
          name
          value
        }
      }
    }
  }
`;
