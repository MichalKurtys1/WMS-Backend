import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import GraphQLJSON from "graphql-type-json";

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...Auth.resolvers.queries,
    ...Client.resolvers.queries,
    ...Supplier.resolvers.queries,
    ...Deliveries.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
    ...Deliveries.resolvers.mutations,
  },
};

export default resolvers;
