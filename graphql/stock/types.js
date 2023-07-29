export const types = `
  type Stock {
    id: ID!
    productId: ID!
    totalQuantity: Float!
    availableStock: Float!
    ordered: Float!
  }

  type StockData {
    id: ID!
    productId: ID!
    totalQuantity: Float!
    availableStock: Float!
    ordered: Float!
    product: ProductData!
  }
`;
