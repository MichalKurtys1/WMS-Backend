export const mutations = `
createOrder(
    clientId: ID!
    expectedDate: String!
    products: JSON!
    totalPrice: Float!
  ): Order
  deleteOrder(id: String!): Boolean!
updateOrder(
  id: ID!
  clientId: ID!
  date: String
  expectedDate: String!
  products: JSON!
  totalPrice: Float!
  ): Order!
  getOrder(id: String!): OrderList!
  updateOrderState(id: String! state: String!): Order!
  updateOrderTrasportType(id: String! transportType: String!): Order!
`;
