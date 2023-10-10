import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Files from "../../models/files";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import OrdersShipments from "../../models/ordersShipments";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";
import Product from "../../models/product";
import ordersShipments from "../../models/ordersShipments";

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

    const { clientId, expectedDate, products, comments, totalPrice } = args;

    const client = await Client.findOne({
      where: {
        name: clientId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    console.log(clientId);
    if (!client) {
      throw new ApolloError("INPUT_ERROR");
    }

    const lastOrder = await Orders.findOne({
      order: [["createdAt", "DESC"]],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    let newCode;
    if (lastOrder) {
      const lastCodeNumber = parseInt(lastOrder.orderID.slice(3), 10);
      const newNumber = lastCodeNumber + 1;
      newCode = `OUT${newNumber.toString().padStart(5, "0")}`;
    } else {
      newCode = "OUT00001";
    }

    const orders = await Orders.create({
      clientId: client.id,
      expectedDate,
      products,
      orderID: newCode,
      totalPrice,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return orders;
  },
  deleteOrder: async (root, args, context) => {
    authCheck(context.token);
    const id = args.id;

    const order = await Orders.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
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
          const newOrdered =
            parseInt(item.availableStock) + parseInt(innerItem.quantity);

          if (newOrdered <= 0) {
            await Stock.update(
              {
                availableStock: 0,
              },
              {
                where: {
                  id: item.id,
                },
              }
            ).catch((err) => {
              throw new ApolloError("SERVER_ERROR");
            });
          } else {
            await Stock.update(
              {
                availableStock: newOrdered,
              },
              {
                where: {
                  id: item.id,
                },
              }
            ).catch((err) => {
              throw new ApolloError("SERVER_ERROR");
            });
          }
        }
      }
    }

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

    const { id, clientId, date, expectedDate, products, comments, totalPrice } =
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
        products,
        totalPrice,
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
    console.log(id);
    if (!orders) {
      throw new ApolloError("INPUT_ERROR");
    }
    return orders;
  },
  updateOrderState: async (root, args, context) => {
    authCheck(context.token);
    const { id, state } = args;
    try {
      if (state === "Zakończono") {
        const order = await Orders.findByPk(id);
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
              await Orders.update(
                { state },
                {
                  where: {
                    id: id,
                  },
                }
              );
            }
          }
        }
      } else if (state === "Potwierdzono") {
        await Orders.update(
          { state, date: new Date() },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        await Orders.update(
          { state },
          {
            where: {
              id: id,
            },
          }
        );
      }

      const orders = await Orders.findByPk(id);

      return orders;
    } catch (error) {
      if (error.name === "SequelizeDatabaseError") {
        throw new ApolloError("DATABASE_ERROR");
      } else {
        throw new ApolloError("SERVER_ERROR");
      }
    }
  },
  updateOrderProducts: async (root, args, context) => {
    authCheck(context.token);
    const { id, products } = args;

    await Orders.update(
      { products },
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
  updateOrderTrasportType: async (root, args, context) => {
    authCheck(context.token);
    const { id, transportType } = args;

    await Orders.update(
      { transportType },
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
};

export const resolvers = { queries, mutations };
