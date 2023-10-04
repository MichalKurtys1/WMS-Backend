export const mutations = `
createOrder(
    clientId: ID!
    expectedDate: String!
    products: JSON!
  ): Order
  deleteOrder(id: String!): Boolean!
updateOrder(
  id: ID!
  clientId: ID!
  date: String
  expectedDate: String!
  products: JSON!
  ): Order!
  getOrder(id: String!): OrderList!
  updateOrderState(id: String! state: String!): Order!
  updateOrderProducts(id: String! products: JSON!): Order!
  updateOrderTrasportType(id: String! transportType: String!): Order!
`;
