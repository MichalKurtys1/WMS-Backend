export const mutations = `
createOrder(
    clientId: ID!
    expectedDate: String!
    warehouse: String!
    products: JSON!
  ): Order
  deleteOrder(id: String!): Boolean!
updateOrder(
  id: ID!
  clientId: ID!
  date: String
  expectedDate: String!
  warehouse: String!
  products: JSON!
  ): Order!
  getOrder(id: String!): OrderList!
`;
