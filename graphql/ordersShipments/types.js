export const types = `
scalar JSON

type orderShipment {
    id: ID
    employee: String!
    registrationNumber: String!
    deliveryDate: String!
    orders: JSON!
    pickingList: JSON!
    waybill: JSON
    state: String!
  }
`;
