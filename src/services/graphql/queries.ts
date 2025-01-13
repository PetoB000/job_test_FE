export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      id
      name
    }
  }
`

export const GET_PRODUCT = `
    query Product($id: String!) {
      product(id: $id) {
        id
        name
        description
        brand
        in_stock
        price
        gallery
        attributes {
          id
          name
          type
          items {
            id
            displayValue
            value
          }
        }
      }
    }
`

export const GET_CATEGORY = `
  query Category($name: String!) {
    category(name: $name) {
      id
      name
      products {
        id
        name
        price
        description
        in_stock
        gallery
        attributes {
          id
          name
          type
          items {
            id
            value
            displayValue
          }
        }
      }
    }
  }
`