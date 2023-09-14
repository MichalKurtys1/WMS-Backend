export const mutations = `
createOrderShipment(
  employee: String!
  registrationNumber: String!
  deliveryDate: String!
  warehouse: String!
  orders: JSON!
): orderShipment!
deleteOrderShipment(id: String!): Boolean!
updateOrderShipmentState(id: String! state: String!): orderShipment!
`;
