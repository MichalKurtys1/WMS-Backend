import { ApolloError } from "apollo-server-express";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";

const queries = {
  suppliers: async (root, args, context) => {
    authCheck(context.token);

    const supplier = await Supplier.findAll().catch((err) => {
      throw new ApolloError(error);
    });

    return supplier;
  },
};

const mutations = {
  createSupplier: async (root, args, context) => {
    try {
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
      });

      return supplier;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteSupplier: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

      Supplier.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateSupplier: async (root, args, context) => {
    try {
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
      );

      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        throw new ApolloError("INPUT_ERROR");
      }
      return supplier;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  getSupplier: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        throw new ApolloError("INPUT_ERROR");
      }

      return supplier;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
