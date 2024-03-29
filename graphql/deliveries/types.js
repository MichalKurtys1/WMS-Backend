export const types = `
scalar JSON

type Delivery {
  id: ID!
  supplierId: ID!
  date: String
  expectedDate: String!
  products: JSON!
  state: String!
  totalPrice: Float!
}

type Supplier {
  id: ID!
  name: String!
  email: String!
  phone: String!
  city: String!
  street: String!
  number: String!
  bank: String!
  accountNumber: String!
  nip: String!
  deliveries: [Delivery]
}


type DeliveryList {
  id: ID!
  supplierId: ID!
  supplier: Supplier!
  date: String
  expectedDate: String!
  products: JSON!
  state: String!
  totalPrice: Float!
}
`;
