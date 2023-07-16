import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";
import { Deliveries } from "./deliveries";
import { Product } from "./Product";
import { Operations } from "./operations";
import GraphQLJSON from "graphql-type-json";

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...Auth.resolvers.queries,
    ...Client.resolvers.queries,
    ...Supplier.resolvers.queries,
    ...Deliveries.resolvers.queries,
    ...Product.resolvers.queries,
    ...Operations.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
    ...Deliveries.resolvers.mutations,
    ...Product.resolvers.mutations,
    ...Operations.resolvers.mutations,
  },
};

export default resolvers;
