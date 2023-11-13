import { gql } from "apollo-server-express";
import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Orders } from "./orders";
import { Stock } from "./stock";
import { Shipments } from "./Shipments";
import { Files } from "../graphql/Files/index";
import { Calendar } from "./Calendar";
import { Raports } from "./Raports";

const typeDefs = gql`
  ${Auth.types}
  ${Client.types}
  ${Supplier.types}
  ${Deliveries.types}
  ${Product.types}
  ${Orders.types}
  ${Stock.types}
  ${Shipments.types}
  ${Files.types}
  ${Calendar.types}
  ${Raports.types}
  
  type Query {
    ${Auth.queries}
    ${Client.queries}
    ${Supplier.queries}
    ${Deliveries.queries}
    ${Product.queries}
    ${Orders.queries}
    ${Stock.queries}
    ${Shipments.queries}
    ${Files.queries}
    ${Calendar.queries}
    ${Raports.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
    ${Client.mutations}
    ${Supplier.mutations}
    ${Deliveries.mutations}
    ${Product.mutations}
    ${Orders.mutations}
    ${Stock.mutations}
    ${Shipments.mutations}
    ${Files.mutations}
    ${Calendar.mutations}
    ${Raports.mutations}
  }
`;

export default typeDefs;
