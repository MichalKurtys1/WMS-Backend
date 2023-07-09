import { gql } from "apollo-server-express";
import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";

const typeDefs = gql`
  ${Auth.types}
  ${Client.types}
  ${Supplier.types}
  
  type Query {
    ${Auth.queries}
    ${Client.queries}
    ${Supplier.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
    ${Client.mutations}
    ${Supplier.mutations}
  }
`;

export default typeDefs;
