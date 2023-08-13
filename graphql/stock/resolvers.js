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

    const exists = await Stock.findOne({
      where: {
        productId: product.id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR2");
    });

    if (exists) {
      let newValue = exists.ordered + ordered;
      await Stock.update(
        {
          ordered: newValue,
        },
        {
          where: {
            productId: product.id,
          },
        }
      ).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

      const stock = await Stock.findOne({
        where: {
          productId: product.id,
        },
      });

      return stock;
    } else {
      const stock = await Stock.create({
        productId: product.id,
        ordered,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
      return stock;
    }
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
            ordered: ordered,
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
            availableStock,
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
  getProduct: async (root, args, context) => {
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
