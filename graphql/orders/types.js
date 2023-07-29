export const types = `
scalar JSON

type Order {
  id: ID!
  clientId: ID!
  date: String
  expectedDate: String!
  warehouse: String!
  products: JSON!
  state: String!
}

type Client {
  id: ID!
  name: String!
  email: String!
  phone: String!
  city: String!
  street: String!
  number: String!
  orders: [Order]
  nip: String!
}


type OrderList {
  id: ID!
  clientId: ID!
  client: Client!
  date: String
  expectedDate: String!
  warehouse: String!
  products: JSON!
  state: String!
}
`;
