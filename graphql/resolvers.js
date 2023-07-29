import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Orders } from "./orders";
import { Stock } from "./stock";
import GraphQLJSON from "graphql-type-json";

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...Auth.resolvers.queries,
    ...Client.resolvers.queries,
    ...Supplier.resolvers.queries,
    ...Deliveries.resolvers.queries,
    ...Product.resolvers.queries,
    ...Orders.resolvers.queries,
    ...Stock.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
    ...Deliveries.resolvers.mutations,
    ...Product.resolvers.mutations,
    ...Orders.resolvers.mutations,
    ...Stock.resolvers.mutations,
  },
};

export default resolvers;
