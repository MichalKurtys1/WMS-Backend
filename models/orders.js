import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Client from "./client";

const Orders = sequelize.define("orders", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  clientId: {
    type: Sequelize.UUID,
    references: {
      model: Client,
      key: "id",
    },
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: null,
  },
  expectedDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  warehouse: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: "Zlecone",
    allowNull: true,
  },
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default Orders;
