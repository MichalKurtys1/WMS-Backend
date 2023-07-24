import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";

const queries = {
  suppliers: async (root, args, context) => {
    authCheck(context.token);

    const supplier = await Supplier.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return supplier;
  },
};

const mutations = {
  createSupplier: async (root, args, context) => {
    authCheck(context.token);

    const {
      name,
      email,
      phone,
      city,
      street,
      number,
      bank,
      accountNumber,
      nip,
    } = args;

    const supplier = await Supplier.create({
      name: name,
      email: email,
      phone: phone,
      city: city,
      street: street,
      number: number,
      bank: bank,
      accountNumber: accountNumber,
      nip: nip,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return supplier;
  },
  deleteSupplier: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Supplier.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateSupplier: async (root, args, context) => {
    authCheck(context.token);

    const {
      id,
      name,
      email,
      phone,
      city,
      street,
      number,
      bank,
      accountNumber,
      nip,
    } = args;

    await Supplier.update(
      {
        name: name,
        email: email,
        phone: phone,
        city: city,
        street: street,
        number: number,
        bank: bank,
        accountNumber: accountNumber,
        nip: nip,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const supplier = await Supplier.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }
    return supplier;
  },
  getSupplier: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const supplier = await Supplier.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!supplier) {
      throw new ApolloError("INPUT_ERROR");
    }

    return supplier;
  },
};

export const resolvers = { queries, mutations };
