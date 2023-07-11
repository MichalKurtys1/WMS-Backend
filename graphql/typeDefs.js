import { gql } from "apollo-server-express";
import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";

const typeDefs = gql`
  ${Auth.types}
  ${Client.types}
  ${Supplier.types}
  ${Deliveries.types}
  
  type Query {
    ${Auth.queries}
    ${Client.queries}
    ${Supplier.queries}
    ${Deliveries.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
    ${Client.mutations}
    ${Supplier.mutations}
    ${Deliveries.mutations}
  }
`;

export default typeDefs;
