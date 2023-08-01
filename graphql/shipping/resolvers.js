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

const queries = {
  shippings: async (root, args, context) => {
    authCheck(context.token);

    const shippings = await Shipping.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return shippings;
  },
};

const mutations = {
  createShipping: async (root, args, context) => {
    authCheck(context.token);

    const { orderId, totalWeight, palletSize, palletNumber, products } = args;

    const order = await Orders.findOne({
      where: {
        id: orderId,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!order) {
      throw new ApolloError("INPUT_ERROR");
    }

    const shipping = await Shipping.create({
      orderId: order.id,
      totalWeight,
      palletSize,
      palletNumber,
      products,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return shipping;
  },
  deleteShipping: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Shipping.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  // updateSupplier: async (root, args, context) => {
  //   authCheck(context.token);

  //   const {
  //     id,
  //     name,
  //     email,
  //     phone,
  //     city,
  //     street,
  //     number,
  //     bank,
  //     accountNumber,
  //     nip,
  //   } = args;

  //   await Supplier.update(
  //     {
  //       name: name,
  //       email: email,
  //       phone: phone,
  //       city: city,
  //       street: street,
  //       number: number,
  //       bank: bank,
  //       accountNumber: accountNumber,
  //       nip: nip,
  //     },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     }
  //   ).catch((err) => {
  //     throw new ApolloError("SERVER_ERROR");
  //   });

  //   const supplier = await Supplier.findByPk(id).catch((err) => {
  //     throw new ApolloError("SERVER_ERROR");
  //   });

  //   if (!supplier) {
  //     throw new ApolloError("INPUT_ERROR");
  //   }
  //   return supplier;
  // },
  // getSupplier: async (root, args, context) => {
  //   authCheck(context.token);

  //   const id = args.id;
  //   const supplier = await Supplier.findByPk(id).catch((err) => {
  //     throw new ApolloError("SERVER_ERROR");
  //   });

  //   if (!supplier) {
  //     throw new ApolloError("INPUT_ERROR");
  //   }

  //   return supplier;
  // },
};

export const resolvers = { queries, mutations };
