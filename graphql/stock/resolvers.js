import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Product from "../../models/product";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";

const queries = {
  stocks: async (root, args, context) => {
    authCheck(context.token);

    const stocks = await Stock.findAll({
      include: {
        model: Product,
        include: Supplier,
      },
    }).catch((err) => {
      throw new ApolloError(error);
    });
    return stocks;
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
