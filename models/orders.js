import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Client from "./client";
import Shipping from "./shipping";

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
  orderID: {
    type: Sequelize.STRING,
    allowNull: false,
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
  state: {
    type: Sequelize.STRING,
    defaultValue: "Zamówiono",
    allowNull: true,
  },
  transportType: {
    type: Sequelize.STRING,
    defaultValue: "-",
    allowNull: true,
  },
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  totalPrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

Orders.hasMany(Shipping, {
  foreignKey: "orderId",
});
Shipping.belongsTo(Orders, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

export default Orders;
