import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authCheck = (token) => {
  jwt.verify(token, process.env.JWT_CODE, function (err, decoded) {
    if (err) {
      throw new ApolloError("NOT_AUTHENTICATED");
    }
  });
};
