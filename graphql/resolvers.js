import { Auth } from "./Auth";
import { Client } from "./Client";
import { Supplier } from "./Suppliers";

const resolvers = {
  Query: {
    ...Auth.resolvers.queries,
    ...Client.resolvers.queries,
    ...Supplier.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
    ...Client.resolvers.mutations,
    ...Supplier.resolvers.mutations,
  },
};

export default resolvers;
