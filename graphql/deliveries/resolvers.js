import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import Deliveries from "../../models/deliveries";

const queries = {
  deliveries: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const deliveries = await Deliveries.findAll({
      include: [Supplier],
    });

    return deliveries;
  },
};

const mutations = {
  createDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { supplierId, date, warehouse, products, comments } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    });

    if (!supplier) {
      throw new ApolloError("SUPPLIER DO NOT EXISTS");
    }

    const deliveries = await Deliveries.create({
      supplierId: supplier.id,
      date,
      warehouse,
      comments,
      products,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return {
      id: deliveries.id,
      supplierId: deliveries.supplierId,
      date: deliveries.date,
      warehouse: deliveries.warehouse,
      comments: deliveries.comments,
      products: deliveries.products,
      state: deliveries.state,
    };
  },
  deleteDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Deliveries.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "DELIVERY DONT EXISTS");
    });
    return true;
  },
  updateDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const { id, supplierId, date, warehouse, products, comments } = args;

    const supplier = await Supplier.findOne({
      where: {
        name: supplierId,
      },
    });

    if (!supplier) {
      throw new ApolloError("SUPPLIER DO NOT EXISTS");
    }

    await Deliveries.update(
      {
        supplierId: supplier.id,
        date,
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
      throw new ApolloError(err, "DELIVERY DONT EXISTS");
    });

    const deliveries = await Deliveries.findByPk(id);

    return {
      id: deliveries.id,
      supplierId: deliveries.supplierId,
      date: deliveries.date,
      warehouse: deliveries.warehouse,
      comments: deliveries.comments,
      products: deliveries.products,
      state: deliveries.state,
    };
  },
  getDelivery: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const deliveries = await Deliveries.findByPk(id, {
      include: [Supplier],
    });
    if (!deliveries) {
      throw new ApolloError(
        "Delivery with that id do not exists ",
        "DELIVERY DONT EXISTS"
      );
    }
    return {
      id: deliveries.id,
      supplierId: deliveries.supplierId,
      date: deliveries.date,
      warehouse: deliveries.warehouse,
      comments: deliveries.comments,
      products: deliveries.products,
      supplier: deliveries.supplier,
      state: deliveries.state,
    };
  },
};

export const resolvers = { queries, mutations };
