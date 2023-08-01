export const mutations = `
createShipping(
  orderId: ID!
  totalWeight: String!
  palletSize: String!
  palletNumber: String!
  products: JSON!
): Shipping!
deleteShipping(id: String!): Boolean!
`;

// updateSupplier(
//   id: String!
//   name: String!
//   phone: String!
//   email: String!
//   city: String!
//   street: String!
//   number: String!
//   bank: String!
//   accountNumber: String!
//   nip: String!
//   ): Supplier!
//   getSupplier(id: String!): Supplier!
