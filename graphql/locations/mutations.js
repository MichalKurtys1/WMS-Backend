export const mutations = `
createLocation(
  operationId: ID!
  productId: ID!
  numberOfProducts: Float!
  posX: String!
  posY: String!
  ): Location
`;

// deleteDelivery(id: String!): Boolean!
// updateDelivery(
//   id: ID!
//   supplierId: ID!
//   date: String!
//   warehouse: String!
//   comments: String!
//   products: JSON!
//   ): Delivery!
//   getDelivery(id: String!): DeliveryList!
