export const mutations = `
createStock(
  productId: ID!
  ordered: Float
): Stock!
deleteStock(id: String!): Boolean!
updateStock(
  id: String!
  productId: ID
  totalQuantity: Float
  availableStock: Float
  ordered: Float
  ): Stock!
  getStock(id: String!): Stock!
`;
