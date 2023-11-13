export const types = `
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
