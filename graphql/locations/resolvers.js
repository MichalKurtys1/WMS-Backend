import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Locations from "../../models/locations";
import Product from "../../models/product";
import { authCheck } from "../../utils/authCheck";

const queries = {
  locations: async (root, args, context) => {
    authCheck(context.token);

    const locations = await Locations.findAll({
      include: [Product],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return locations;
  },
};

const mutations = {
  createLocation: async (root, args, context) => {
    authCheck(context.token);

    const { operationId, productId, numberOfProducts, posX, posY } = args;

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

    let location = await Locations.findOne({
      where: {
        operationId,
        productId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (location) {
      location = await Locations.update({
        numberOfProducts,
        posX,
        posY,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    } else {
      location = await Locations.create({
        operationId,
        productId,
        numberOfProducts,
        posX,
        posY,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    }

    return {
      id: location.id,
      productId: location.productId,
      product: product,
      numberOfProducts: location.numberOfProducts,
      posX: location.posX,
      posY: location.posY,
      state: location.state,
    };
  },
};

export const resolvers = { queries, mutations };
