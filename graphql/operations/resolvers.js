import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Operations from "../../models/operations";
import Orders from "../../models/orders";

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

    const { deliveriesId, ordersId } = args;

    let operation;

    if (deliveriesId) {
      operation = await Operations.create({
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
    } else {
      operation = await Operations.create({
        ordersId: ordersId,
      }).catch((err) => {
        throw new ApolloError(err, "SERVER_ERROR");
      });

      await Orders.update(
        {
          state: "W trakcie",
        },
        {
          where: {
            id: ordersId,
          },
        }
      ).catch((err) => {
        throw new ApolloError(err, "ORDER DONT EXISTS");
      });
    }

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
        throw new ApolloError(err, "OPERATION DONT EXISTS");
      });

      const operations = await Operations.findByPk(operationId);

      if (operations.deliveriesId) {
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
        await Orders.update(
          {
            state: "Zakończone",
          },
          {
            where: {
              id: operations.ordersId,
            },
          }
        ).catch((err) => {
          throw new ApolloError(err, "ORDER DONT EXISTS");
        });
      }
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
        throw new ApolloError(err, "OPERATION DONT EXISTS");
      });
    }

    const operation = await Operations.findByPk(operationId);

    if (operation.deliveriesId) {
      return {
        id: operation.id,
        deliveriesId: operation.deliveriesId,
        stage: operation.stage,
        data: operation.data,
      };
    } else {
      return {
        id: operation.id,
        ordersId: operation.ordersId,
        stage: operation.stage,
        data: operation.data,
      };
    }
  },
};

export const resolvers = { queries, mutations };
