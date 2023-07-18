export const mutations = `
createProduct(
    supplierId: ID!
    name: String!
    type: String!
    capacity: String!
    unit: String!
    pricePerUnit: Float!
): Product!
deleteProduct(id: String!): Boolean!
updateProduct(
  id: String!
  supplierId: ID!
  name: String!
  type: String!
  capacity: String!
  unit: String!
  pricePerUnit: Float!
  ): Product!
  getProduct(id: String!): Product!
  updateAvailableStock(id: String! availableStock: Float!): Boolean!
`;
