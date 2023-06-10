import { Auth } from "./Auth";

const resolvers = {
  Query: {
    ...Auth.resolvers.queries,
  },
  Mutation: {
    ...Auth.resolvers.mutations,
  },
};

export default resolvers;
