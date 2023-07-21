export const mutations = `
createSupplier(
    name: String!
    phone: String!
    email: String!
    city: String!
    street: String!
    number: String!
    bank: String!
    accountNumber: String!
    nip: String!
): Supplier!
deleteSupplier(id: String!): Boolean!
updateSupplier(
  id: String!
  name: String!
  phone: String!
  email: String!
  city: String!
  street: String!
  number: String!
  bank: String!
  accountNumber: String!
  nip: String!
  ): Supplier!
  getSupplier(id: String!): Supplier!
`;
