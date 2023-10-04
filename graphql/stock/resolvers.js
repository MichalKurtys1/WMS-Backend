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
      throw new ApolloError("SERVER_ERROR");
    });
    return stocks;
  },
};

const mutations = {
  createStock: async (root, args, context) => {
    authCheck(context.token);

    const { productId, ordered } = args;

    const product = await Product.findByPk(productId).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!product) {
      throw new ApolloError("INPUT_ERROR");
    }

    const stock = await Stock.create({
      productId: product.id,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return stock;
  },
  deleteStock: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Stock.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateStock: async (root, args, context) => {
    authCheck(context.token);

    const { id, productId, totalQuantity, availableStock, ordered } = args;

    if (productId) {
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

      if (!product) {
        throw new ApolloError("INPUT_ERROR");
      }

      await Stock.update(
        {
          productId: product.id,
          totalQuantity,
          availableStock,
          ordered,
        },
        {
          where: {
            id: id,
          },
        }
      ).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    } else {
      if (ordered === 0 || ordered) {
        await Stock.update(
          {
            ordered: ordered ? ordered : 0,
          },
          {
            where: {
              id: id,
            },
          }
        ).catch((err) => {
          throw new ApolloError("SERVER_ERROR");
        });
      } else {
        await Stock.update(
          {
            availableStock: availableStock ? availableStock : 0,
          },
          {
            where: {
              id: id,
            },
          }
        ).catch((err) => {
          throw new ApolloError("SERVER_ERROR");
        });
      }
    }

    const stock = await Stock.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    if (!stock) {
      throw new ApolloError("INPUT_ERROR");
    }
    return stock;
  },
  getStock: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const stock = await Stock.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    if (!stock) {
      throw new ApolloError("INPUT_ERROR");
    }
    return stock;
  },
};

export const resolvers = { queries, mutations };
