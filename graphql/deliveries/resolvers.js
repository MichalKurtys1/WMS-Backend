import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";
import Product from "../../models/product";

const queries = {
  deliveries: async (root, args, context) => {
    authCheck(context.token);

    const deliveries = await Deliveries.findAll({
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError(error);
    });

    return deliveries;
  },
};

const mutations = {
  createDelivery: async (root, args, context) => {
    try {
      authCheck(context.token);

      const { supplierId, expectedDate, products, totalPrice } = args;

      const supplier = await Supplier.findOne({
        where: {
          name: supplierId,
        },
      });

      if (!supplier) {
        throw new ApolloError("INPUT_ERROR");
      }

      const deliveries = await Deliveries.create({
        supplierId: supplier.id,
        expectedDate,
        products,
        totalPrice,
      });

      const productList = JSON.parse(products);
      const DBProducts = await Product.findAll();

      productList.forEach(async (item) => {
        const product = DBProducts.find(
          (product) =>
            item.product.includes(product.name) &&
            item.product.includes(product.type) &&
            item.product.includes(product.capacity)
        );

        const exists = await Stock.findOne({
          where: {
            productId: product.id,
          },
        });

        if (exists) {
          let newValue = exists.ordered + parseInt(item.quantity);
          await Stock.update(
            {
              ordered: newValue,
            },
            {
              where: {
                productId: product.id,
              },
            }
          );
        }
      });

      return deliveries;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteDelivery: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;
      const delivery = await Deliveries.findByPk(id);

      let products = JSON.parse(JSON.parse(delivery.products));
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
              parseInt(item.ordered) - parseInt(innerItem.quantity);

            await Stock.update(
              {
                ordered: newOrdered <= 0 ? 0 : newOrdered,
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

      Deliveries.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateDelivery: async (root, args, context) => {
    try {
      authCheck(context.token);

      const {
        id,
        supplierId,
        date,
        expectedDate,
        products,
        comments,
        totalPrice,
      } = args;

      const supplier = await Supplier.findOne({
        where: {
          name: supplierId,
        },
      });

      if (!supplier) {
        throw new ApolloError("INPUT_ERROR");
      }

      const deliveries = await Deliveries.findByPk(id);
      const stocks = await Stock.findAll({
        include: [Product],
      });

      JSON.parse(JSON.parse(deliveries.products)).forEach(async (item) => {
        const stock = stocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = parseInt(stock.ordered) - parseInt(item.quantity);

        await Stock.update(
          {
            ordered: newValue,
          },
          {
            where: {
              id: stock.id,
            },
          }
        );
      });

      await Deliveries.update(
        {
          supplierId: supplier.id,
          date,
          expectedDate,
          comments,
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

        let newValue = parseInt(stock.ordered) + parseInt(item.quantity);

        await Stock.update(
          {
            ordered: newValue,
          },
          {
            where: {
              id: stock.id,
            },
          }
        );
      });

      return deliveries;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  getDelivery: async (root, args, context) => {
    try {
      authCheck(context.token);

      const id = args.id;
      const deliveries = await Deliveries.findByPk(id, {
        include: [Supplier],
      });

      if (!deliveries) {
        throw new ApolloError("INPUT_ERROR");
      }
      return deliveries;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateState: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, state } = args;

      const deliveries = await Deliveries.findByPk(id);

      if (state === "Rozlokowano") {
        let products = JSON.parse(JSON.parse(deliveries.products));
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
                parseInt(item.totalQuantity) +
                parseInt(innerItem.delivered) -
                parseInt(innerItem.damaged);
              const newOrdered =
                parseInt(item.ordered) - parseInt(innerItem.quantity);
              const newAvailableStock =
                parseInt(item.availableStock) +
                parseInt(innerItem.delivered) -
                parseInt(innerItem.damaged);

              await Stock.update(
                {
                  totalQuantity: newTotalQuantity < 0 ? 0 : newTotalQuantity,
                  availableStock: newAvailableStock < 0 ? 0 : newAvailableStock,
                  ordered: newOrdered < 0 ? 0 : newOrdered,
                },
                {
                  where: {
                    id: item.id,
                  },
                }
              );
              await Deliveries.update(
                { state: "Rozlokowano" },
                {
                  where: {
                    id: id,
                  },
                }
              );
            }
          }
        }
      } else if (state === "Odebrano") {
        await Deliveries.update(
          { state, date: new Date() },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        await Deliveries.update(
          { state },
          {
            where: {
              id: id,
            },
          }
        );
      }

      return deliveries;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateValues: async (root, args, context) => {
    try {
      authCheck(context.token);

      const { id, products } = args;

      await Deliveries.update(
        {
          products: products,
          state: "Posortowano",
        },
        {
          where: {
            id: id,
          },
        }
      );

      const deliveries = await Deliveries.findByPk(id);
      return deliveries;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
