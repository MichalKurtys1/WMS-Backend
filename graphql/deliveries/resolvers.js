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
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
};

const mutations = {
  createDelivery: async (root, args, context) => {
    authCheck(context.token);

    const { supplierId, expectedDate, warehouse, products } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }

    const deliveries = await Deliveries.create({
      supplierId: supplier.id,
      expectedDate,
      warehouse,
      products,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
  deleteDelivery: async (root, args, context) => {
    authCheck(context.token);
    const id = args.id;
    const delivery = await Deliveries.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
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
          console.log(
            item.ordered +
              "----" +
              innerItem.quantity +
              "-----------" +
              newOrdered
          );
          if (newOrdered <= 0) {
            await Stock.update(
              {
                ordered: 0,
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
                ordered: newOrdered,
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

    Deliveries.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return true;
  },
  updateDelivery: async (root, args, context) => {
    authCheck(context.token);

    const {
      id,
      supplierId,
      date,
      expectedDate,
      warehouse,
      products,
      comments,
    } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }

    await Deliveries.update(
      {
        supplierId: supplier.id,
        date,
        expectedDate,
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

    const deliveries = await Deliveries.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
  getDelivery: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const deliveries = await Deliveries.findByPk(id, {
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!deliveries) {
      throw new ApolloError("INPUT_ERROR");
    }
    return deliveries;
  },
  updateState: async (root, args, context) => {
    authCheck(context.token);
    const { id, state } = args;

    try {
      await Deliveries.update(
        { state },
        {
          where: {
            id: id,
          },
        }
      );

      const deliveries = await Deliveries.findByPk(id);

      if (state === "Rozlokowano") {
        let products = JSON.parse(JSON.parse(deliveries.products));

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
                parseInt(item.totalQuantity) + parseInt(innerItem.delivered);
              const newOrdered =
                parseInt(item.ordered) - parseInt(innerItem.quantity);
              const newAvailableStock =
                parseInt(item.availableStock) + parseInt(innerItem.quantity);
              await Stock.update(
                {
                  totalQuantity: newTotalQuantity,
                  availableStock: newAvailableStock,
                  ordered: newOrdered,
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

      return deliveries;
    } catch (error) {
      if (error.name === "SequelizeDatabaseError") {
        throw new ApolloError("DATABASE_ERROR");
      } else {
        throw new ApolloError("SERVER_ERROR");
      }
    }
  },

  updateValues: async (root, args, context) => {
    authCheck(context.token);

    const { id, products } = args;

    await Deliveries.update(
      {
        products: products,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const deliveries = await Deliveries.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return deliveries;
  },
};

export const resolvers = { queries, mutations };
