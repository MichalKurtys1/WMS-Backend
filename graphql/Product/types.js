export const types = `
  type Product {
    id: ID!
    supplierId: ID!
    name: String!
    type: String!
    capacity: String!
    unit: String!
    pricePerUnit: Float!
    availableStock: Float!
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
    availableStock: Float!
  }
`;
