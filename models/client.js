import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Orders from "./orders";

const Client = sequelize.define("client", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nip: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Client.hasMany(Orders, {
  foreignKey: "clientId",
});
Orders.belongsTo(Client, {
  foreignKey: "clientId",
  onDelete: "CASCADE",
});

export default Client;
