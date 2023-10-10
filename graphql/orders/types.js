export const types = `
scalar JSON
scalar Upload

type Order {
  id: ID!
  clientId: ID!
  orderID: String
  date: String
  expectedDate: String!
  products: JSON!
  state: String!
  transportType: String!
  totalPrice: Float!
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
  orderID: String
  date: String
  expectedDate: String!
  products: JSON!
  state: String!
  transportType: String!
  totalPrice: Float!
}
`;
