import { ApolloError } from "apollo-server-express";
import Client from "../../models/client";
import { authCheck } from "../../utils/authCheck";

const queries = {
  clients: async (root, args, context) => {
    authCheck(context.token);

    const client = await Client.findAll().catch((err) => {
      throw new ApolloError(error);
    });

    return client;
  },
};

const mutations = {
  createClient: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { name, email, phone, city, street, number, nip } = args;

      const client = await Client.create({
        name: name,
        email: email,
        phone: phone,
        city: city,
        street: street,
        number: number,
        nip: nip,
      });

      return client;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteClient: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

      Client.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  updateClient: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id, name, email, phone, city, street, number, nip } = args;

      await Client.update(
        {
          name: name,
          email: email,
          phone: phone,
          city: city,
          street: street,
          number: number,
          nip: nip,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const client = await Client.findByPk(id);

      if (!client) {
        throw new ApolloError("INPUT_ERROR");
      }

      return client;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  getClient: async (root, args, context) => {
    try {
      authCheck(context.token);
      const id = args.id;

      const client = await Client.findByPk(id);

      if (!client) {
        throw new ApolloError("INPUT_ERROR");
      }

      return client;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
