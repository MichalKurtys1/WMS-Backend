import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const queries = {
  users: async (root, args) => {
    const users = await User.findAll();
    return users;
  },
};

const mutations = {
  createUser: async (root, args) => {
    const { email, firstname, lastname, phone, magazine, position } = args;

    const userTaken = await User.findOne({ where: { email: email } }).catch(
      (err) => {
        throw new ApolloError(err, "SERVER_ERROR");
      }
    );

    if (userTaken) {
      throw new ApolloError("Email already taken", "INPUT_ERROR");
    }

    const randomPassword = Math.random().toString(36).slice(-8);

    // wysyłanie hasła na poczte usera
    console.log(randomPassword);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await User.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      magazine: magazine,
      position: position,
      firstLogin: true,
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    return true;
  },
  login: async (root, args) => {
    const { email, password } = args;

    const user = await User.findOne({ where: { email: email } }).catch(
      (err) => {
        throw new ApolloError(err, "SERVER_ERROR");
      }
    );

    if (!user) {
      throw new ApolloError(
        "User with that email do not exists",
        "INPUT_ERROR"
      );
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new ApolloError("Password is incorrect", "INPUT_ERROR");
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
        throw new ApolloError(err, "SERVER_ERROR");
      }
    );
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      token: token,
      firstLogin: user.firstLogin,
    };
  },
  changePassword: async (root, args) => {
    const { oldPassword, newPassword, token } = args;

    const decryptedToken = jwt.verify(token, "TEMPORARY_STRING");

    const user = await User.findOne({
      where: { email: decryptedToken.email },
    }).catch((err) => {
      throw new ApolloError(err, "SERVER_ERROR");
    });

    if (!user) {
      throw new ApolloError(
        "User with that email do not exists",
        "INPUT_ERROR"
      );
    }

    const isEqual = await bcrypt.compare(oldPassword, user.password);

    if (!isEqual) {
      throw new ApolloError("Password is incorrect", "INPUT_ERROR");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user
      .update({ password: hashedPassword, firstLogin: false })
      .catch((err) => {
        throw new ApolloError(err, "SERVER_ERROR");
      });
    return true;
  },
};

export const resolvers = { queries, mutations };
