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
  }
`;

export default typeDefs;
