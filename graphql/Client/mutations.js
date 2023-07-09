export const mutations = `
createClient(
    name: String!
    phone: String!
    email: String!
    city: String!
    street: String!
    number: String!
    nip: String
): Client!
deleteClient(id: String!): Boolean!
updateClient(
  id: String!
  name: String!
  phone: String!
  email: String!
  city: String!
  street: String!
  number: String!
  nip: String
  ): Client!
  getClient(id: String!): Client!
`;
