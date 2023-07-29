import Sequelize from "sequelize";
import sequelize from "../utils/db";

const Transfers = sequelize.define("transfers", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  employee: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: "",
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: "Zlecone",
    allowNull: true,
  },
});

export default Transfers;
