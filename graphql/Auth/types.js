export const types = `
type Auth {
  firstname: String!
  lastname: String!
  token: String!
  firstLogin: Boolean!
}  

type User {
    id: ID
    email: String!
    password: String!
    firstname: String!
    lastname: String!
    phone: String!
    magazine: String!
    position: String!
    token: String
    firstLogin: Boolean
  }
`;
