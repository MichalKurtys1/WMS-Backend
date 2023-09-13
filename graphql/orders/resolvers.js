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
    console.log(client);
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
  updateOrderState: async (root, args, context) => {
    authCheck(context.token);
    const { id, state } = args;

    try {
      await Orders.update(
        { state },
        {
          where: {
            id: id,
          },
        }
      );

      const orders = await Orders.findByPk(id);

      // if (state === "Rozlokowano") {
      //   let products = JSON.parse(JSON.parse(orders.products));

      //   const stock = await Stock.findAll();

      //   for (const item of stock) {
      //     const data = await Product.findByPk(item.productId);

      //     for (const innerItem of products) {
      //       if (
      //         innerItem.product.includes(data.name) ||
      //         innerItem.product.includes(data.type) ||
      //         innerItem.product.includes(data.capacity)
      //       ) {
      //         const newTotalQuantity =
      //           parseInt(item.totalQuantity) + parseInt(innerItem.delivered);
      //         const newOrdered =
      //           parseInt(item.ordered) - parseInt(innerItem.quantity);
      //         const newAvailableStock =
      //           parseInt(item.availableStock) + parseInt(innerItem.quantity);
      //         await Stock.update(
      //           {
      //             totalQuantity: newTotalQuantity,
      //             availableStock: newAvailableStock,
      //             ordered: newOrdered,
      //           },
      //           {
      //             where: {
      //               id: item.id,
      //             },
      //           }
      //         );
      //       }
      //     }
      //   }
      // }

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
};

export const resolvers = { queries, mutations };
