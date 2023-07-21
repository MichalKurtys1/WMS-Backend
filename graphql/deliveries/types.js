export const types = `
scalar JSON

type Delivery {
  id: ID!
  supplierId: ID!
  date: String!
  warehouse: String!
  comments: String!
  products: JSON!
  state: String!
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
  date: String!
  warehouse: String!
  comments: String!
  products: JSON!
  state: String!
}
`;
