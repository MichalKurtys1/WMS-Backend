import { ApolloError } from "apollo-server-express";
import { authCheck } from "../../utils/authCheck";
import Calendar from "../../models/calendar";
import Orders from "../../models/orders";
import Deliveries from "../../models/deliveries";
import Shipments from "../../models/shipments";
import Client from "../../models/client";
import Supplier from "../../models/supplier";

const calendarDataStandard = async (data) => {
  let results = [];
  let deli = data.deliveries
    .map((item) => {
      if (item.state !== "Zakończono") {
        return {
          date: +item.expectedDate - 24 * 60 * 60 * 1000,
          time: "--:--",
          event: "Dostawa " + item.supplier.name,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null && Object.keys(item).length !== 0);
  let orde = data.orders
    .map((item) => {
      if (item.state !== "Zakończono") {
        return {
          date: +item.expectedDate - 24 * 60 * 60 * 1000,
          time: "--:--",
          event: "Zamówienie " + item.client.name,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null && Object.keys(item).length !== 0);
  let ship = data.shipments
    .map((item) => {
      if (item.state !== "Zakończono") {
        return {
          date: (
            new Date(item.deliveryDate).getTime() -
            24 * 60 * 60 * 1000
          ).toString(),
          time: "--:--",
          event: "Wysyłka " + item.employee,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null && Object.keys(item).length !== 0);
  let cale = data.calendar;
  results = cale.concat(orde, deli, ship);
  return results;
};

const calendarDataCarrier = async (data) => {
  let results = [];
  let ship = data.shipments.map((item) => {
    return {
      date: (
        new Date(item.deliveryDate).getTime() -
        24 * 60 * 60 * 1000
      ).toString(),
      time: "--:--",
      event: "Wysyłka " + item.employee,
    };
  });
  let cale = data.calendar;
  results = cale.concat(ship);
  return results;
};

const queries = {
  calendar: async (root, args, context) => {
    authCheck(context.token);

    const calendar = await Calendar.findAll().catch((err) => {
      throw new ApolloError(error);
    });

    return calendar;
  },
  formatedCalendar: async (root, args, context) => {
    try {
      authCheck(context.token);

      const calendar = await Calendar.findAll();
      const orders = await Orders.findAll({
        include: Client,
      });
      const deliveries = await Deliveries.findAll({
        include: Supplier,
      });
      const shipments = await Shipments.findAll();
      const data = {
        calendar: calendar,
        orders: orders,
        deliveries: deliveries,
        shipments: shipments,
      };

      const standardData = calendarDataStandard(data);
      const carrierData = calendarDataCarrier(data);

      return {
        standardData: standardData,
        carrierData: carrierData,
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

const mutations = {
  createCalendar: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { date, time, event } = args;

      await Calendar.create({
        date: date,
        time: time,
        event: event,
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deleteCalendar: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { id } = args;

      await Calendar.destroy({
        where: {
          id: id,
        },
      });

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
