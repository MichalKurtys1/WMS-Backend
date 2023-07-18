import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Product from "../../models/product";
import Supplier from "../../models/supplier";

const queries = {
  products: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const products = await Product.findAll({
      include: [Supplier],
    });
    return products;
  },
};

const mutations = {
  createProduct: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { supplierId, name, type, capacity, unit, pricePerUnit } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    });

    if (!supplier) {
      throw new ApolloError("SUPPLIER DO NOT EXISTS");
    }

    const product = await Product.create({
      supplierId: supplier.id,
      name,
      type,
      capacity,
      unit,
      pricePerUnit,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return {
      id: product.id,
      supplierId: product.supplierId,
      name: product.name,
      type: product.type,
      capacity: product.capacity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
    };
  },
  deleteProduct: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Product.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "USER DONT EXISTS");
    });
    return true;
  },
  updateProduct: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { id, supplierId, name, type, capacity, unit, pricePerUnit } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    });

    if (!supplier) {
      throw new ApolloError("SUPPLIER DO NOT EXISTS");
    }

    await Product.update(
      {
        supplierId: supplier.id,
        name,
        type,
        capacity,
        unit,
        pricePerUnit,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError(err, "PRODUCT DONT EXISTS");
    });

    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApolloError(
        "Product with that id do not exists ",
        "PRODUCT DONT EXISTS"
      );
    }
    return {
      id: product.id,
      supplierId: product.supplierId,
      name: product.name,
      type: product.type,
      capacity: product.capacity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
    };
  },
  getProduct: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApolloError(
        "Product with that id do not exists ",
        "PRODUCT DONT EXISTS"
      );
    }
    return {
      id: product.id,
      supplierId: product.supplierId,
      name: product.name,
      type: product.type,
      capacity: product.capacity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
    };
  },
  updateAvailableStock: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { id, availableStock } = args;

    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApolloError(
        "Product with that id do not exists ",
        "PRODUCT DONT EXISTS"
      );
    }

    let newAvailableStock = product.availableStock + availableStock;

    if (newAvailableStock < 0) {
      throw new ApolloError("Not enough of available stock");
    }

    await Product.update(
      {
        availableStock: product.availableStock + availableStock,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError(err, "PRODUCT DONT EXISTS");
    });

    return true;
  },
};

export const resolvers = { queries, mutations };
