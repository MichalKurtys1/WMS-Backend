export const types = `
  type Product {
    id: ID!
    supplierId: ID!
    name: String!
    type: String!
    capacity: String!
    unit: String!
    pricePerUnit: Float!
  }

  type ProductData {
    id: ID!
    supplierId: ID!
    name: String!
    type: String!
    capacity: String!
    unit: String!
    pricePerUnit: Float!
    supplier: Supplier!
  }
`;
