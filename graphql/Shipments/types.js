export const types = `
scalar JSON

type Shipment {
    id: ID
    employee: String!
    registrationNumber: String!
    deliveryDate: String!
    orders: JSON!
    pickingList: JSON!
    waybill: JSON
    state: String!
  }

  type FormattedData {
    shipment: JSON!
    orders: JSON!
    products: JSON!
  }
`;
