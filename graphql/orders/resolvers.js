import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";

const queries = {
  orders: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const orders = await Orders.findAll({
      include: [Client],
    });

    return orders;
  },
};

const mutations = {
  createOrder: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { clientId, date, warehouse, products, comments } = args;

    const client = await Client.findOne({
      where: {
        name: clientId,
      },
    });

    if (!client) {
      throw new ApolloError("CLIENT DO NOT EXISTS");
    }

    const orders = await Orders.create({
      clientId: client.id,
      date,
      warehouse,
      comments,
      products,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return {
      id: orders.id,
      clientId: orders.clientId,
      date: orders.date,
      warehouse: orders.warehouse,
      comments: orders.comments,
      products: orders.products,
      state: orders.state,
    };
  },
  deleteOrder: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Orders.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "ORDER DONT EXISTS");
    });
    return true;
  },
  updateOrder: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { id, clientId, date, warehouse, products, comments } = args;

    const client = await Client.findOne({
      where: {
        name: clientId,
      },
    });

    if (!client) {
      throw new ApolloError("SUPPLIER DO NOT EXISTS");
    }

    await Orders.update(
      {
        clientId: client.id,
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
      throw new ApolloError(err, "ORDER DONT EXISTS");
    });

    const order = await Orders.findByPk(id);

    return {
      id: order.id,
      clientId: order.clientId,
      date: order.date,
      warehouse: order.warehouse,
      comments: order.comments,
      products: order.products,
      state: order.state,
    };
  },
  getOrder: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const orders = await Orders.findByPk(id, {
      include: [Client],
    });
    if (!orders) {
      throw new ApolloError(
        "Order with that id do not exists ",
        "ORDER DONT EXISTS"
      );
    }
    return {
      id: orders.id,
      clientId: orders.clientId,
      date: orders.date,
      warehouse: orders.warehouse,
      comments: orders.comments,
      products: orders.products,
      client: orders.client,
      state: orders.state,
    };
  },
};

export const resolvers = { queries, mutations };
