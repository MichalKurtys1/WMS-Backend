export const mutations = `
createTransfer(
  employee: String!
  date: String!
  data: JSON!
  ): Transfer
  deleteTransfer(id: String!): Boolean!
updateTransfer(
  id: ID!
  employee: String!
  date: String!
  data: JSON!
  state: String!
  ): Transfer!
  getTransfer(id: String!): Transfer!
`;
