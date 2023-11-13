import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Deliveries from "./deliveries";

const shipments = sequelize.define("shipments", {
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
  orders: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  pickingList: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  waybill: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: "-",
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Zlecone",
  },
});

export default shipments;
