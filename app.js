import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { typeDefs, resolvers } from "./graphql";
import User from "./models/user";
import sequelize from "./utils/db";

dotenv.config();
const port = process.env.PORT;

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

// { force: true }

sequelize.sync().then((res) => {
  apolloServer.start().then((res) => {
    apolloServer.applyMiddleware({ app, path: "/graphql" });
    app.listen({ port }, () => console.log(`Server Running`));
  });
});
