import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import { authCheck } from "../../utils/authCheck";

const queries = {
  clients: async (root, args, context) => {
    authCheck(context.token);

    const client = await Client.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return client;
  },
};

const mutations = {
  createClient: async (root, args, context) => {
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
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return client;
  },
  deleteClient: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    Client.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateClient: async (root, args, context) => {
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
    ).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const client = await Client.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!client) {
      throw new ApolloError("INPUT_ERROR");
    }
    return client;
  },
  getClient: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const client = await Client.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!client) {
      throw new ApolloError("INPUT_ERROR");
    }

    return client;
  },
};

export const resolvers = { queries, mutations };
