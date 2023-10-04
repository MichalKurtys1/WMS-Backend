export const mutations = `
  createUser(
    email: String!
    firstname: String!
    lastname: String!
    phone: String!
    position: String!
    adres: String!
  ): UserData!
  login(email: String! password: String!): Auth!
  changePassword(oldPassword: String! newPassword: String! token: String!): Boolean!
  getUser(id: String!): UserData!
  deleteUser(id: String!): Boolean!
  updateUser(
    id: String!     
    email: String!
    firstname: String!
    lastname: String!
    phone: String!
    position: String!
    adres: String!
    ): UserData!
`;
