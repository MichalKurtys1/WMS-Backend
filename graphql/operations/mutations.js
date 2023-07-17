export const mutations = `
createOperation(
    deliveriesId: ID
    ordersId: ID
): Operation!
updateOperation(
    operationId: ID!
    stage: Float!
    data: JSON!
): Operation!
`;

// deleteDelivery(id: String!): Boolean!
// updateDelivery(
// id: ID!
// supplierId: ID!
// date: String!
// warehouse: String!
// comments: String!
// products: JSON!
// ): Delivery!
// getDelivery(id: String!): DeliveryList!
