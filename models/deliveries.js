import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";

const Deliveries = sequelize.define("deliveries", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: Sequelize.UUID,
    references: {
      model: Supplier,
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
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default Deliveries;
