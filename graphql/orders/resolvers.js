import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import { authCheck } from "../../utils/authCheck";

const queries = {
  orders: async (root, args, context) => {
    authCheck(context.token);

    const orders = await Orders.findAll({
      include: [Client],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return orders;
  },
};

const mutations = {
  createOrder: async (root, args, context) => {
    authCheck(context.token);

    const { clientId, expectedDate, warehouse, products, comments } = args;

    const client = await Client.findOne({
      where: {
        name: clientId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!client) {
      throw new ApolloError("INPUT_ERROR");
    }

    const orders = await Orders.create({
      clientId: client.id,
      expectedDate,
      warehouse,
      products,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return orders;
  },
  deleteOrder: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Orders.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateOrder: async (root, args, context) => {
    authCheck(context.token);

    const { id, clientId, date, expectedDate, warehouse, products, comments } =
      args;

    const client = await Client.findOne({
      where: {
        name: clientId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!client) {
      throw new ApolloError("INPUT_ERROR");
    }

    await Orders.update(
      {
        clientId: client.id,
        date,
        expectedDate,
        warehouse,
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

    const order = await Orders.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!order) {
      throw new ApolloError("INPUT_ERROR");
    }

    return order;
  },
  getOrder: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const orders = await Orders.findByPk(id, {
      include: [Client],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!orders) {
      throw new ApolloError("INPUT_ERROR");
    }
    return orders;
  },
};

export const resolvers = { queries, mutations };
