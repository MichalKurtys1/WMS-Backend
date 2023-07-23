import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Operations from "./operations";
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
    allowNull: false,
  },
  warehouse: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  comments: {
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

Orders.hasMany(Operations, {
  foreignKey: "ordersId",
});
Operations.belongsTo(Orders, {
  foreignKey: "ordersId",
  onDelete: "CASCADE",
});

export default Orders;
