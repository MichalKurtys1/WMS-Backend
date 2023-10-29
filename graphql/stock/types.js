export const types = `
  type Stock {
    id: ID!
    productId: ID!
    code: String!
    totalQuantity: Float!
    availableStock: Float!
    ordered: Float!
    preOrdered: Float!
  }

  type StockData {
    id: ID!
    productId: ID!
    code: String!
    totalQuantity: Float!
    availableStock: Float!
    ordered: Float!
    product: ProductData!
    preOrdered: Float!
  }
`;
