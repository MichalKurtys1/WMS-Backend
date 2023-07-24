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
import { authCheck } from "../../utils/authCheck";

const queries = {
  transfers: async (root, args, context) => {
    authCheck(context.token);

    const transfers = await Transfers.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return transfers;
  },
};

const mutations = {
  createTransfer: async (root, args, context) => {
    authCheck(context.token);

    const { employee, date, data } = args;

    const transfer = await Transfers.create({
      employee,
      date,
      data,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
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
      ).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    }

    return transfer;
  },
  deleteTransfer: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;

    await Transfers.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return true;
  },
  updateTransfer: async (root, args, context) => {
    authCheck(context.token);

    const { id, clientId, date, warehouse, products, comments } = args;

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

    const order = await Orders.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return order;
  },
  getTransfer: async (root, args, context) => {
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
