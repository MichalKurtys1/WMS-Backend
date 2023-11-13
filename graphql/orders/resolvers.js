import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Files from "../../models/files";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";
import Product from "../../models/product";

const queries = {
  orders: async (root, args, context) => {
    authCheck(context.token);

    const orders = await Orders.findAll({
      include: [Client],
    }).catch((err) => {
      throw new ApolloError(error);
    });

    return orders;
  },
};

const mutations = {
  createOrder: async (root, args, context) => {
    try {
      authCheck(context.token);

      const { clientId, expectedDate, products, comments, totalPrice } = args;

      const client = await Client.findOne({
        where: {
          name: clientId,
        },
      });

      if (!client) {
        throw new ApolloError("INPUT_ERROR");
      }

      const lastOrder = await Orders.findOne({
        order: [["createdAt", "DESC"]],
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
      });

      const stocks = await Stock.findAll({
        include: [Product],
      });

      const parsedProducts = JSON.parse(products);

      for (const item of parsedProducts) {
        const stock = stocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = parseInt(stock.preOrdered) + parseInt(item.quantity);

        if (newValue < 0) {
          throw new ApolloError(error);
        }

        await Stock.update(
          {
            preOrdered: newValue,
          },
          {
            where: {
              id: stock.id,
            },
          }
        );
      }

      return orders;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteOrder: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

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
            let newOrdered =
              parseInt(item.preOrdered) - parseInt(innerItem.quantity);

            await Stock.update(
              {
                preOrdered: newOrdered <= 0 ? 0 : newOrdered,
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

      Orders.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateOrder: async (root, args, context) => {
    try {
      authCheck(context.token);

      const {
        id,
        clientId,
        date,
        expectedDate,
        products,
        comments,
        totalPrice,
      } = args;

      const client = await Client.findOne({
        where: {
          name: clientId,
        },
      });

      if (!client) {
        throw new ApolloError("INPUT_ERROR");
      }

      const orders = await Orders.findByPk(id);
      const stocks = await Stock.findAll({
        include: [Product],
      });

      JSON.parse(JSON.parse(orders.products)).forEach(async (item) => {
        const stock = stocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = parseInt(stock.preOrdered) - parseInt(item.quantity);

        await Stock.update(
          {
            preOrdered: newValue,
          },
          {
            where: {
              id: stock.id,
            },
          }
        );
      });

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
      );

      const newStocks = await Stock.findAll({
        include: [Product],
      });

      JSON.parse(products).forEach(async (item) => {
        const stock = newStocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = parseInt(stock.preOrdered) + parseInt(item.quantity);

        await Stock.update(
          {
            preOrdered: newValue,
          },
          {
            where: {
              id: stock.id,
            },
          }
        );
      });

      const newOrder = await Orders.findByPk(id);

      if (!newOrder) {
        throw new ApolloError("INPUT_ERROR");
      }

      return newOrder;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  getOrder: async (root, args, context) => {
    try {
      authCheck(context.token);

      const id = args.id;
      const orders = await Orders.findByPk(id, {
        include: [Client],
      });

      if (!orders) {
        throw new ApolloError("INPUT_ERROR");
      }
      return orders;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateOrderState: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, state } = args;

      if (state === "Zakończono") {
        const order = await Orders.findByPk(id);
        let products = JSON.parse(JSON.parse(order.products));
        const stock = await Stock.findAll();

        for (const item of stock) {
          const data = await Product.findByPk(item.productId);
          for (const innerItem of products) {
            if (
              innerItem.product.includes(data.name) &&
              innerItem.product.includes(data.type) &&
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
      throw new ApolloError(error);
    }
  },
  updateOrderTrasportType: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, transportType } = args;

      const order = await Orders.findByPk(id);
      let products = JSON.parse(JSON.parse(order.products));
      const stock = await Stock.findAll();

      for (const item of stock) {
        const data = await Product.findByPk(item.productId);
        for (const innerItem of products) {
          if (
            innerItem.product.includes(data.name) &&
            innerItem.product.includes(data.type) &&
            innerItem.product.includes(data.capacity)
          ) {
            if (item.preOrdered > item.availableStock) {
              throw new ApolloError("NOT_ENOUGH_PRODUCTS");
            }
            const newTotalQuantity =
              parseInt(item.preOrdered) - parseInt(innerItem.quantity);
            const newVal =
              parseInt(item.availableStock) - parseInt(innerItem.quantity);

            await Stock.update(
              {
                preOrdered: newTotalQuantity < 0 ? 0 : newTotalQuantity,
                availableStock: newVal < 0 ? 0 : newVal,
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

      await Orders.update(
        {
          state: "Potwierdzono",
          date: new Date(),
          transportType: transportType,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const newOrder = await Orders.findByPk(id);

      if (!newOrder) {
        throw new ApolloError("INPUT_ERROR");
      }

      return newOrder;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
