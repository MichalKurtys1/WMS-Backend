export const types = `
scalar JSON

type Operation {
  id: ID!
  deliveriesId: ID!
  stage: Float!
  data: JSON!
}

type OperationData {
  id: ID!
  deliveriesId: ID!
  stage: Float!
  data: JSON!
  delivery: Delivery
}

`;

// type Supplier {
//   id: ID!
//   name: String!
//   email: String!
//   phone: String!
//   city: String!
//   street: String!
//   number: String!
//   deliveries: [Delivery]
// }

// type DeliveryList {
//   id: ID!
//   supplierId: ID!
//   supplier: Supplier!
//   date: String!
//   warehouse: String!
//   comments: String!
//   products: JSON!
//   state: String!
// }
