export const mutations = `
  createUser(
    email: String!
    firstname: String!
    lastname: String!
    phone: String!
    magazine: String!
    position: String!
  ): Boolean!
  login(email: String! password: String!): Auth!
  changePassword(oldPassword: String! newPassword: String! token: String!): Boolean!
`;
