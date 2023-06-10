import Sequelize from "sequelize";
import sequelize from "../utils/db";

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  magazine: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  firstLogin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

export default User;
