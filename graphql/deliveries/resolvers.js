import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import { authCheck } from "../../utils/authCheck";

const queries = {
  deliveries: async (root, args, context) => {
    authCheck(context.token);

    const deliveries = await Deliveries.findAll({
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
};

const mutations = {
  createDelivery: async (root, args, context) => {
    authCheck(context.token);

    const { supplierId, date, warehouse, products, comments } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }

    const deliveries = await Deliveries.create({
      supplierId: supplier.id,
      date,
      warehouse,
      comments,
      products,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
  deleteDelivery: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Deliveries.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return true;
  },
  updateDelivery: async (root, args, context) => {
    authCheck(context.token);

    const { id, supplierId, date, warehouse, products, comments } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }

    await Deliveries.update(
      {
        supplierId: supplier.id,
        date,
        warehouse,
        comments,
        products,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const deliveries = await Deliveries.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
  getDelivery: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const deliveries = await Deliveries.findByPk(id, {
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!deliveries) {
      throw new ApolloError("INPUT_ERROR");
    }
    return deliveries;
  },
};

export const resolvers = { queries, mutations };
