import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";

export const authCheck = (token) => {
  jwt.verify(token, "TEMPORARY_STRING", function (err, decoded) {
    if (err) {
      throw new ApolloError("NOT_AUTHENTICATED");
    }
  });
};
