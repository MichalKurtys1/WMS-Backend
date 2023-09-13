import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import dotenv from "dotenv";
import { typeDefs, resolvers } from "./graphql";
import User from "./models/user";
import sequelize from "./utils/db";
import cors from "cors";
import Supplier from "./models/supplier";
import Client from "./models/client";
import Deliveries from "./models/deliveries";
const path = require("path");

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(graphqlUploadExpress());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req, res }) => {
    const tokenHeader = req.headers.authorization || "";
    const token = tokenHeader.split(" ")[1];
    return { token };
  },
});

sequelize.sync().then((res) => {
  apolloServer.start().then((res) => {
    apolloServer.applyMiddleware({
      app,
      cors: {
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        credentials: true,
      },
      path: "/graphql",
    });
    app.listen({ port }, () => console.log(`Server Running`));
  });
});
