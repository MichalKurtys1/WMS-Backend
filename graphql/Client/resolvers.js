import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";

const queries = {
  clients: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const client = await Client.findAll();
    return client;
  },
};

const mutations = {
  createClient: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

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
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      city: client.city,
      street: client.street,
      number: client.number,
      nip: client.nip,
    };
  },
  deleteClient: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    Client.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError(err, "USER DONT EXISTS");
    });
    return true;
  },
  updateClient: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

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
      throw new ApolloError(err, "USER DONT EXISTS");
    });

    const client = await Client.findByPk(id);
    if (!client) {
      throw new ApolloError(
        "Client with that id do not exists ",
        "CLIENT DONT EXISTS"
      );
    }
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      city: client.city,
      street: client.street,
      number: client.number,
      nip: client.nip,
    };
  },
  getClient: async (root, args, context) => {
    const decodedToken = jwt.decode(context.token, "TEMPORARY_STRING");
    if (!decodedToken) {
      throw new ApolloError("GIVEN TOKEN DO NOT EXISTS ", "NOT AUTHENTICATED");
    }

    const id = args.id;
    const client = await Client.findByPk(id);
    if (!client) {
      throw new ApolloError(
        "Client with that id do not exists ",
        "CLIENT DONT EXISTS"
      );
    }
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      city: client.city,
      street: client.street,
      number: client.number,
      nip: client.nip,
    };
  },
};

export const resolvers = { queries, mutations };
