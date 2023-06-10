import { gql } from "apollo-server-express";
import { Auth } from "./Auth";

const typeDefs = gql`
  ${Auth.types}
  
  type Query {
    ${Auth.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
  }
`;

export default typeDefs;
