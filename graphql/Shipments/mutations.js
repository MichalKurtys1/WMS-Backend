export const mutations = `
createShipment(
  employee: String!
  registrationNumber: String!
  deliveryDate: String!
  orders: JSON!
  pickingList: JSON!
): Shipment!
deleteShipment(id: String!): Boolean!
updateShipmentState(id: String! state: String!): Shipment!
updateShipmentWaybill(id: String! waybill: JSON!): Shipment!
getFormattedData(id: String!): FormattedData!
`;
