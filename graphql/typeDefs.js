import { gql } from "apollo-server-express";
import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Operations } from "./operations";
import { Orders } from "./orders";
import { Locations } from "./locations";

const typeDefs = gql`
  ${Auth.types}
  ${Client.types}
  ${Supplier.types}
  ${Deliveries.types}
  ${Product.types}
  ${Operations.types}
  ${Orders.types}
  ${Locations.types}
  
  type Query {
    ${Auth.queries}
    ${Client.queries}
    ${Supplier.queries}
    ${Deliveries.queries}
    ${Product.queries}
    ${Operations.queries}
    ${Orders.queries}
    ${Locations.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
    ${Client.mutations}
    ${Supplier.mutations}
    ${Deliveries.mutations}
    ${Product.mutations}
    ${Operations.mutations}
    ${Orders.mutations}
    ${Locations.mutations}
  }
`;

export default typeDefs;
