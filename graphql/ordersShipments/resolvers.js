import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import Shipping from "../../models/shipping";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import ordersShipments from "../../models/ordersShipments";

const queries = {
  orderShipments: async (root, args, context) => {
    authCheck(context.token);

    const orderShipments = await ordersShipments.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return orderShipments;
  },
};

const mutations = {
  createOrderShipment: async (root, args, context) => {
    authCheck(context.token);

    const { employee, registrationNumber, deliveryDate, warehouse, orders } =
      args;

    const shipment = await ordersShipments
      .create({
        employee,
        registrationNumber,
        deliveryDate,
        warehouse,
        orders,
      })
      .catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

    return shipment;
  },
  deleteOrderShipment: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    ordersShipments
      .destroy({
        where: {
          id: id,
        },
      })
      .catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    return true;
  },
  updateOrderShipmentState: async (root, args, context) => {
    authCheck(context.token);
    const { id, state } = args;

    try {
      await ordersShipments.update(
        { state },
        {
          where: {
            id: id,
          },
        }
      );

      const shipment = await ordersShipments.findByPk(id);

      return shipment;
    } catch (error) {
      throw new ApolloError("SERVER_ERROR");
    }
  },
};

export const resolvers = { queries, mutations };
