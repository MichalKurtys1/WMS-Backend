import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import Deliveries from "../../models/deliveries";
import Orders from "../../models/orders";
import Stock from "../../models/stock";
import Product from "../../models/product";
import shipments from "../../models/shipments";

const queries = {
  shipments: async (root, args, context) => {
    authCheck(context.token);

    const Shipments = await shipments.findAll().catch((err) => {
      throw new ApolloError(error);
    });

    return Shipments;
  },
};

const mutations = {
  createShipment: async (root, args, context) => {
    try {
      authCheck(context.token);
      const {
        employee,
        registrationNumber,
        deliveryDate,
        orders,
        pickingList,
      } = args;

      const shipment = await shipments.create({
        employee,
        registrationNumber,
        deliveryDate,
        orders,
        pickingList,
      });

      return shipment;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteShipment: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

      const orderShipment = await shipments.findByPk(id);
      const orders = JSON.parse(JSON.parse(orderShipment.orders));

      orders.forEach(async (item) => {
        await Orders.update(
          { state: "Potwierdzono" },
          {
            where: {
              id: item.id,
            },
          }
        );
      });

      await shipments.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateShipmentState: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, state } = args;

      const orderShipment = await shipments.findByPk(id).catch((err) => {
        throw new ApolloError(error);
      });

      const orders = JSON.parse(JSON.parse(orderShipment.orders));

      for (const item of orders) {
        if (state === "Zakończono") {
          const order = await Orders.findByPk(item.id);
          let products = JSON.parse(JSON.parse(order.products));
          const stock = await Stock.findAll();

          for (const stockItem of stock) {
            const data = await Product.findByPk(stockItem.productId);
            for (const innerItem of products) {
              if (
                innerItem.product.includes(data.name) &&
                innerItem.product.includes(data.type) &&
                innerItem.product.includes(data.capacity)
              ) {
                const newTotalQuantity =
                  parseInt(stockItem.totalQuantity) -
                  parseInt(innerItem.quantity);

                await Stock.update(
                  {
                    totalQuantity: newTotalQuantity < 0 ? 0 : newTotalQuantity,
                  },
                  {
                    where: {
                      id: stockItem.id,
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
        );
      }

      await shipments.update(
        { state },
        {
          where: {
            id: id,
          },
        }
      );

      const shipment = await shipments.findByPk(id);

      return shipment;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateShipmentWaybill: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, waybill } = args;

      const orderShipment = await shipments.findByPk(id);

      const orders = JSON.parse(JSON.parse(orderShipment.orders));

      orders.forEach(async (item) => {
        await Orders.update(
          { state: "Wysłano" },
          {
            where: {
              id: item.id,
            },
          }
        );
      });

      await shipments.update(
        { waybill, state: "Wysłano" },
        {
          where: {
            id: id,
          },
        }
      );

      const shipment = await shipments.findByPk(id);

      return shipment;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  getFormattedData: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id } = args;

      const shipment = await shipments.findByPk(id);
      const data = [];
      const products = [];
      let index = 0;

      const orders = JSON.parse(JSON.parse(shipment.orders));
      const orderPromises = [];

      for (const item of orders) {
        const orderPromise = Orders.findByPk(item.id).then((order) => {
          data.push(order);
          JSON.parse(JSON.parse(order.products)).map((product) => {
            products.push({
              orderId: order.id,
              id: index,
              product: product.product,
              unit: product.unit,
              quantity: product.quantity,
              delivered: 0,
              damaged: 0,
            });
            index++;
          });
        });
        orderPromises.push(orderPromise);
      }

      await Promise.all(orderPromises);

      return {
        shipment: shipment,
        orders: data,
        products: products,
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
