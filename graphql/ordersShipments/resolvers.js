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
import Stock from "../../models/stock";
import Product from "../../models/product";

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

    const { employee, registrationNumber, deliveryDate, orders, pickingList } =
      args;

    const shipment = await ordersShipments
      .create({
        employee,
        registrationNumber,
        deliveryDate,
        orders,
        pickingList,
      })
      .catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

    return shipment;
  },
  deleteOrderShipment: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;

    const orderShipment = await ordersShipments.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const orders = JSON.parse(JSON.parse(orderShipment.orders));

    orders.forEach(async (item) => {
      await Orders.update(
        { state: "Potwierdzono" },
        {
          where: {
            id: item.id,
          },
        }
      ).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    });

    await ordersShipments
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
      const orderShipment = await ordersShipments.findByPk(id).catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });

      const orders = JSON.parse(JSON.parse(orderShipment.orders));

      orders.forEach(async (item) => {
        if (state === "Dostarczono") {
          const order = await Orders.findByPk(item.id);
          let products = JSON.parse(JSON.parse(order.products));
          const stock = await Stock.findAll();

          for (const item of stock) {
            const data = await Product.findByPk(item.productId);
            for (const innerItem of products) {
              if (
                innerItem.product.includes(data.name) ||
                innerItem.product.includes(data.type) ||
                innerItem.product.includes(data.capacity)
              ) {
                const newTotalQuantity =
                  parseInt(item.totalQuantity) - parseInt(innerItem.quantity);
                console.log(newTotalQuantity);
                await Stock.update(
                  {
                    totalQuantity: newTotalQuantity < 0 ? 0 : newTotalQuantity,
                  },
                  {
                    where: {
                      id: item.id,
                    },
                  }
                );
              }
            }
          }
        }
        await Orders.update(
          { state: state },
          {
            where: {
              id: item.id,
            },
          }
        ).catch((err) => {
          throw new ApolloError("SERVER_ERROR");
        });
      });

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
  updateOrderShipmentWaybill: async (root, args, context) => {
    authCheck(context.token);
    const { id, waybill } = args;

    try {
      await ordersShipments.update(
        { waybill },
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
