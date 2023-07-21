import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";

const queries = {
  suppliers: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const supplier = await Supplier.findAll();
    console.log(supplier);
    return supplier;
  },
};

const mutations = {
  createSupplier: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

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
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      city: supplier.city,
      street: supplier.street,
      number: supplier.number,
      bank: supplier.bank,
      accountNumber: supplier.accountNumber,
      nip: supplier.nip,
    };
  },
  deleteSupplier: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Supplier.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "SUPPLIER DONT EXISTS");
    });
    return true;
  },
  updateSupplier: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

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
      throw new ApolloError(err, "USER DONT EXISTS");
    });

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new ApolloError(
        "Supplier with that id do not exists ",
        "SUPPLIER DONT EXISTS"
      );
    }
    return {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      city: supplier.city,
      street: supplier.street,
      number: supplier.number,
      bank: supplier.bank,
      accountNumber: supplier.accountNumber,
      nip: supplier.nip,
    };
  },
  getSupplier: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new ApolloError(
        "Supplier with that id do not exists ",
        "SUPPLIER DONT EXISTS"
      );
    }
    console.log(supplier);
    return {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      city: supplier.city,
      street: supplier.street,
      number: supplier.number,
      bank: supplier.bank,
      accountNumber: supplier.accountNumber,
      nip: supplier.nip,
    };
  },
};

export const resolvers = { queries, mutations };
