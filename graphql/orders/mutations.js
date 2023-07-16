export const mutations = `
createOrder(
    clientId: ID!
    date: String!
    warehouse: String!
    comments: String!
    products: JSON!
  ): Order
  deleteOrder(id: String!): Boolean!
updateOrder(
  id: ID!
  clientId: ID!
  date: String!
  warehouse: String!
  comments: String!
  products: JSON!
  ): Order!
  getOrder(id: String!): OrderList!
`;
