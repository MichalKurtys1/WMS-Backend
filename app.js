import express from "express";
import { ApolloError, ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import dotenv from "dotenv";
import { typeDefs, resolvers } from "./graphql";
import User from "./models/user";
import sequelize from "./utils/db";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Supplier from "./models/supplier";
import Client from "./models/client";
import Deliveries from "./models/deliveries";
const { check, validationResult } = require("express-validator");
const path = require("path");

dotenv.config();
const port = process.env.PORT;

const app = express();

process.on("uncaughtException", function (err) {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  legacyHeaders: true,
  message: "Too many requests",
});

app.use(limiter);

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
