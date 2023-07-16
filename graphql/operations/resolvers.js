import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Operations from "../../models/operations";

const queries = {
  operations: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const operations = await Operations.findAll({
      include: [Deliveries],
    });

    return operations;
  },
};

const mutations = {
  createOperation: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { deliveriesId } = args;

    const operation = await Operations.create({
      deliveriesId: deliveriesId,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    await Deliveries.update(
      {
        state: "W trakcie",
      },
      {
        where: {
          id: deliveriesId,
        },
      }
    ).catch((err) => {
      throw new ApolloError(err, "DELIVERY DONT EXISTS");
    });

    return {
      id: operation.id,
      deliveriesId: operation.deliveriesId,
      stage: operation.stage,
      data: operation.data,
    };
  },
  updateOperation: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { operationId, stage, data } = args;

    if (stage === 3) {
      await Operations.update(
        {
          stage: stage,
          data: data,
        },
        {
          where: {
            id: operationId,
          },
        }
      ).catch((err) => {
        throw new ApolloError(err, "DELIVERY DONT EXISTS");
      });

      const operations = await Operations.findByPk(operationId);

      await Deliveries.update(
        {
          state: "Zakończone",
        },
        {
          where: {
            id: operations.deliveriesId,
          },
        }
      ).catch((err) => {
        throw new ApolloError(err, "DELIVERY DONT EXISTS");
      });
    } else {
      await Operations.update(
        {
          stage: stage,
          data: data,
        },
        {
          where: {
            id: operationId,
          },
        }
      ).catch((err) => {
        throw new ApolloError(err, "DELIVERY DONT EXISTS");
      });
    }

    const operation = await Operations.findByPk(operationId);

    return {
      id: operation.id,
      deliveriesId: operation.deliveriesId,
      stage: operation.stage,
      data: operation.data,
    };
  },
  deleteDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Deliveries.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "DELIVERY DONT EXISTS");
    });
    return true;
  },
  getDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const deliveries = await Deliveries.findByPk(id, {
      include: [Supplier],
    });
    if (!deliveries) {
      throw new ApolloError(
        "Delivery with that id do not exists ",
        "DELIVERY DONT EXISTS"
      );
    }
    return {
      id: deliveries.id,
      supplierId: deliveries.supplierId,
      date: deliveries.date,
      warehouse: deliveries.warehouse,
      comments: deliveries.comments,
      products: deliveries.products,
      supplier: deliveries.supplier,
      state: deliveries.state,
    };
  },
};

export const resolvers = { queries, mutations };
