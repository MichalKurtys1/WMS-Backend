import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./Deliveries";
import { Product } from "./Product";
import { Orders } from "./Orders";
import { Stock } from "./Stock";
import { Shipments } from "./Shipments";
import GraphQLJSON from "graphql-type-json";
import { GraphQLUpload } from "graphql-upload-minimal";
import { Files } from "../graphql/Files/index";
import { Calendar } from "./Calendar";
import { Raports } from "./Raports";

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
    ...Shipments.resolvers.queries,
    ...Files.resolvers.queries,
    ...Calendar.resolvers.queries,
    ...Raports.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
    ...Deliveries.resolvers.mutations,
    ...Product.resolvers.mutations,
    ...Orders.resolvers.mutations,
    ...Stock.resolvers.mutations,
    ...Shipments.resolvers.mutations,
    ...Files.resolvers.mutations,
    ...Calendar.resolvers.mutations,
    ...Raports.resolvers.mutations,
  },
};

export default resolvers;
