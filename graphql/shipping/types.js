export const types = `
scalar JSON

type Shipping {
    id: ID
    orderId: ID!
    totalWeight: String!
    palletSize: String!
    palletNumber: String!
    products: JSON!
  }
`;
