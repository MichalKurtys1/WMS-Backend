import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Orders } from "./orders";
import { Stock } from "./stock";
import { Shipping } from "./shipping";
import { orderShipments } from "./ordersShipments";
import GraphQLJSON from "graphql-type-json";
import { GraphQLUpload } from "graphql-upload-minimal";
import { Files } from "../graphql/Files/index";
import { Calendar } from "./Calendar";

const resolvers = {
  JSON: GraphQLJSON,
  Upload: GraphQLUpload,
  Query: {
    ...Auth.resolvers.queries,
    ...Client.resolvers.queries,
    ...Supplier.resolvers.queries,
    ...Deliveries.resolvers.queries,
    ...Product.resolvers.queries,
    ...Orders.resolvers.queries,
    ...Stock.resolvers.queries,
    ...Shipping.resolvers.queries,
    ...orderShipments.resolvers.queries,
    ...Files.resolvers.queries,
    ...Calendar.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
    ...Deliveries.resolvers.mutations,
    ...Product.resolvers.mutations,
    ...Orders.resolvers.mutations,
    ...Stock.resolvers.mutations,
    ...Shipping.resolvers.mutations,
    ...orderShipments.resolvers.mutations,
    ...Files.resolvers.mutations,
    ...Calendar.resolvers.mutations,
  },
};

export default resolvers;
