export const types = `
type Auth {
  firstname: String!
  lastname: String!
  position: String!
  token: String!
  firstLogin: Boolean!
  expiresIn: String!
}

type UserData {
  id: ID
  email: String!
  firstname: String!
  lastname: String!
  phone: String!
  position: String!
  adres: String!
}

type User {
    id: ID
    email: String!
    password: String!
    firstname: String!
    lastname: String!
    phone: String!
    position: String!
    adres: String!
    token: String
    firstLogin: Boolean
  }
`;
