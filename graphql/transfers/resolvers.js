import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import Transfers from "../../models/transfers";
import Locations from "../../models/locations";

const queries = {
  transfers: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const transfers = await Transfers.findAll();

    return transfers;
  },
};

const mutations = {
  createTransfer: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { employee, date, data } = args;

    const transfer = await Transfers.create({
      employee,
      date,
      data,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    const parsedData = JSON.parse(data);

    for (const element of parsedData) {
      await Locations.update(
        {
          state: "Transferring",
        },
        {
          where: {
            id: element.id,
          },
        }
      );
    }

    return transfer;
  },
  deleteTransfer: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;

    await Transfers.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "TRANSFER DONT EXISTS");
    });

    return true;
  },
  updateTransfer: async (root, args, context) => {
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
  getTransfer: async (root, args, context) => {
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
