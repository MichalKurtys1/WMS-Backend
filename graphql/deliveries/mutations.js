export const mutations = `
createDelivery(
    supplierId: ID!
    date: String!
    warehouse: String!
    comments: String!
    products: JSON!
  ): Delivery
  deleteDelivery(id: String!): Boolean!
updateDelivery(
  id: ID!
  supplierId: ID!
  date: String!
  warehouse: String!
  comments: String!
  products: JSON!
  ): Delivery!
  getDelivery(id: String!): DeliveryList!
`;
