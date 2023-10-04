import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { authCheck } from "../../utils/authCheck";

const sendgridTransport = require("nodemailer-sendgrid-transport");

const transoprter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const queries = {
  users: async (root, args, context) => {
    authCheck(context.token);

    const users = await User.findAll().catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return users;
  },
};

const mutations = {
  createUser: async (root, args, context) => {
    authCheck(context.token);

    const { email, firstname, lastname, phone, position, adres } = args;

    const userTaken = await User.findOne({ where: { email: email } }).catch(
      (err) => {
        throw new ApolloError("SERVER_ERROR");
      }
    );

    if (userTaken) {
      throw new ApolloError("EMAIL_TAKEN");
    }

    const randomPassword = Math.random().toString(36).slice(-8);

    transoprter
      .sendMail({
        to: email,
        from: "atak2001@wp.pl",
        subject: "Hasło do twojego konta",
        html: `<h1>${randomPassword}</h1>`,
      })
      .then((result) => {
        console.log("Wysłono na email");
      })
      .catch((err) => {
        throw new ApolloError("EMAIL_SEND_ERROR");
      });

    // tymczasowe
    console.log(randomPassword);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await User.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      position: position,
      adres: adres,
      firstLogin: true,
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    return user;
  },
  login: async (root, args) => {
    const { email, password } = args;

    const user = await User.findOne({ where: { email: email } }).catch(
      (err) => {
        throw new ApolloError("SERVER_ERROR");
      }
    );

    if (!user) {
      throw new ApolloError("INPUT_ERROR");
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new ApolloError("INPUT_ERROR");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "TEMPORARY_STRING",
      { expiresIn: "2h" }
    );

    await User.update({ token: token }, { where: { id: user.id } }).catch(
      (err) => {
        throw new ApolloError("SERVER_ERROR");
      }
    );
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      position: user.position,
      token: token,
      firstLogin: user.firstLogin,
      expiresIn: "2h",
    };
  },
  changePassword: async (root, args) => {
    const { oldPassword, newPassword, token } = args;

    const decryptedToken = jwt.verify(token, "TEMPORARY_STRING");

    const user = await User.findOne({
      where: { email: decryptedToken.email },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!user) {
      throw new ApolloError("INPUT_ERROR");
    }

    const isEqual = await bcrypt.compare(oldPassword, user.password);

    if (!isEqual) {
      throw new ApolloError("INPUT_ERROR");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user
      .update({ password: hashedPassword, firstLogin: false })
      .catch((err) => {
        throw new ApolloError("SERVER_ERROR");
      });
    return true;
  },
  getUser: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApolloError("INPUT_ERROR");
    }
    return user;
  },
  deleteUser: async (root, args, context) => {
    authCheck(context.token);

    const id = args.id;
    User.destroy({
      where: {
        id: id,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    return true;
  },
  updateUser: async (root, args, context) => {
    authCheck(context.token);

    const { id, email, firstname, lastname, phone, position, adres } = args;

    await User.update(
      {
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        position: position,
        adres: adres,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    const user = await User.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (!user) {
      throw new ApolloError("INPUT_ERROR");
    }
    return user;
  },
};

export const resolvers = { queries, mutations };
