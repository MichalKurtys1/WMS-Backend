import Sequelize from "sequelize";
import sequelize from "../utils/db";

const Files = sequelize.define("files", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  subcategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Files;
