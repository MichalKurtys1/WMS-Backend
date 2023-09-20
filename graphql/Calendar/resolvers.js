import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import dotenv from "dotenv";
import { Storage, File } from "megajs";
import path from "path";
import fs, { createReadStream } from "fs";
import Files from "../../models/files";
import Orders from "../../models/orders";
import Deliveries from "../../models/deliveries";
import OrdersShipments from "../../models/ordersShipments";
import Calendar from "../../models/calendar";

const queries = {
  calendar: async (root, args, context) => {
    authCheck(context.token);

    const calendar = await Calendar.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return calendar;
  },
};

const mutations = {
  createCalendar: async (root, args, context) => {
    authCheck(context.token);
    const { date, time, event } = args;

    await Calendar.create({
      date: date,
      time: time,
      event: event,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return true;
  },
  deleteCalendar: async (root, args, context) => {
    authCheck(context.token);
    const { id } = args;

    await Calendar.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return true;
  },
};

export const resolvers = { queries, mutations };
