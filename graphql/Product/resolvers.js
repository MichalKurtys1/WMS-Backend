import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Product from "../../models/product";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";

const queries = {
  products: async (root, args, context) => {
    authCheck(context.token);

    const products = await Product.findAll({
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return products;
  },
};

const mutations = {
  createProduct: async (root, args, context) => {
    authCheck(context.token);

    const { supplierId, name, type, capacity, unit, pricePerUnit } = args;

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

    const product = await Product.create({
      supplierId: supplier.id,
      name,
      type,
      capacity,
      unit,
      pricePerUnit,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const lastStock = await Stock.findOne({
      order: [["createdAt", "DESC"]],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    let newCode;
    if (lastStock) {
      const lastCodeNumber = parseInt(lastStock.code.slice(1), 10);
      const newNumber = lastCodeNumber + 1;
      newCode = `A${newNumber.toString().padStart(5, "0")}`;
    } else {
      newCode = "A00001";
    }

    const stock = await Stock.create({
      productId: product.id,
      code: newCode,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return product;
  },
  deleteProduct: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Product.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateProduct: async (root, args, context) => {
    authCheck(context.token);

    const { id, supplierId, name, type, capacity, unit, pricePerUnit } = args;

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
      throw new ApolloError("SERVER_ERROR");
    });

    const product = await Product.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    if (!product) {
      throw new ApolloError("INPUT_ERROR");
    }
    return product;
  },
  getProduct: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const product = await Product.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    if (!product) {
      throw new ApolloError("INPUT_ERROR");
    }
    return product;
  },
};

export const resolvers = { queries, mutations };
