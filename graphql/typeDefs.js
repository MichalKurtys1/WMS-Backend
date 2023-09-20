import { gql } from "apollo-server-express";
import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Orders } from "./orders";
import { Stock } from "./stock";
import { Shipping } from "./shipping";
import { orderShipments } from "./ordersShipments";
import { Files } from "../graphql/Files/index";
import { Calendar } from "./Calendar";

const typeDefs = gql`
  ${Auth.types}
  ${Client.types}
  ${Supplier.types}
  ${Deliveries.types}
  ${Product.types}
  ${Orders.types}
  ${Stock.types}
  ${Shipping.types}
  ${orderShipments.types}
  ${Files.types}
  ${Calendar.types}
  
  type Query {
    ${Auth.queries}
    ${Client.queries}
    ${Supplier.queries}
    ${Deliveries.queries}
    ${Product.queries}
    ${Orders.queries}
    ${Stock.queries}
    ${Shipping.queries}
    ${orderShipments.queries}
    ${Files.queries}
    ${Calendar.queries}
  }
  
  type Mutation {
    ${Auth.mutations}
    ${Client.mutations}
    ${Supplier.mutations}
    ${Deliveries.mutations}
    ${Product.mutations}
    ${Orders.mutations}
    ${Stock.mutations}
    ${Shipping.mutations}
    ${orderShipments.mutations}
    ${Files.mutations}
    ${Calendar.mutations}
  }
`;

export default typeDefs;
