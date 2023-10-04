export const mutations = `
createOrderShipment(
  employee: String!
  registrationNumber: String!
  deliveryDate: String!
  orders: JSON!
  pickingList: JSON!
): orderShipment!
deleteOrderShipment(id: String!): Boolean!
updateOrderShipmentState(id: String! state: String!): orderShipment!
updateOrderShipmentWaybill(id: String! waybill: JSON!): orderShipment!
`;
