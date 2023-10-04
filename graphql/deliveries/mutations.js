export const mutations = `
createDelivery(
    supplierId: ID!
    expectedDate: String!
    products: JSON!
  ): Delivery
  deleteDelivery(id: String!): Boolean!
updateDelivery(
  id: ID!
  supplierId: ID!
  date: String
  expectedDate: String!
  products: JSON!
  ): Delivery!
  getDelivery(id: String!): DeliveryList!
  updateState(id: String! state: String!): Delivery!
  updateValues(id: String! products: JSON!): Delivery!
`;
