export const types = `
scalar JSON

type orderShipment {
    id: ID
    employee: String!
    registrationNumber: String!
    deliveryDate: String!
    warehouse: String!
    orders: JSON!
    state: String!
  }
`;
