import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import Operations from "../../models/operations";
import Orders from "../../models/orders";
import Transfers from "../../models/transfers";
import Locations from "../../models/locations";
import { authCheck } from "../../utils/authCheck";

const queries = {
  operations: async (root, args, context) => {
    authCheck(context.token);

    const operations = await Operations.findAll({
      include: [Deliveries, Transfers, Orders],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return operations;
  },
};

const mutations = {
  createOperation: async (root, args, context) => {
    authCheck(context.token);

    const { deliveriesId, ordersId, transfersId } = args;

    let operation;

    if (deliveriesId) {
      operation = await Operations.create({
        deliveriesId: deliveriesId,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
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
        throw new ApolloError("SERVER_ERROR");
      });
    } else if (ordersId) {
      operation = await Operations.create({
        ordersId: ordersId,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
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
        throw new ApolloError("SERVER_ERROR");
      });
    } else {
      operation = await Operations.create({
        transfersId: transfersId,
      }).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

      await Transfers.update(
        {
          state: "W trakcie",
        },
        {
          where: {
            id: transfersId,
          },
        }
      ).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    }

    return operation;
  },
  updateOperation: async (root, args, context) => {
    authCheck(context.token);

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
        throw new ApolloError("SERVER_ERROR");
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
          throw new ApolloError("SERVER_ERROR");
        });
      } else if (operations.ordersId) {
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
          throw new ApolloError("SERVER_ERROR");
        });
      } else if (operations.transfersId) {
        const parsedData = JSON.parse(data);

        for (const element of parsedData) {
          if (element.state) {
            if (element.numberOfProducts > element.transferNumber) {
              await Locations.update(
                {
                  numberOfProducts:
                    element.numberOfProducts - element.transferNumber,
                  state: null,
                },
                {
                  where: {
                    id: element.id,
                  },
                }
              ).catch((err) => {
                throw new ApolloError("SERVER_ERROR");
              });
            } else {
              await Locations.destroy({
                where: {
                  id: element.id,
                },
              }).catch((err) => {
                throw new ApolloError("SERVER_ERROR");
              });
            }

            await Locations.create({
              operationId: operationId,
              productId: element.product.id,
              numberOfProducts: element.transferNumber,
              posX: element.newPosX,
              posY: element.newPosY,
            }).catch((err) => {
              throw new ApolloError("SERVER_ERROR");
            });
          }
        }

        await Transfers.update(
          {
            state: "Zakończone",
          },
          {
            where: {
              id: operations.transfersId,
            },
          }
        ).catch((err) => {
          throw new ApolloError("SERVER_ERROR");
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
        throw new ApolloError("SERVER_ERROR");
      });
    }

    const operation = await Operations.findByPk(operationId).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (operation.deliveriesId) {
      return {
        id: operation.id,
        deliveriesId: operation.deliveriesId,
        stage: operation.stage,
        data: operation.data,
      };
    } else if (operation.ordersId) {
      return {
        id: operation.id,
        ordersId: operation.ordersId,
        stage: operation.stage,
        data: operation.data,
      };
    } else {
      return {
        id: operation.id,
        transfersId: operation.ordersId,
        stage: operation.stage,
        data: operation.data,
      };
    }
  },
};

export const resolvers = { queries, mutations };
