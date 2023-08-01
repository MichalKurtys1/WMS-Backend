import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Deliveries from "./deliveries";

const ordersShipments = sequelize.define("ordersShipments", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  employee: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  registrationNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  deliveryDate: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  warehouse: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orders: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default ordersShipments;
