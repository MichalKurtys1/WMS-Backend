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
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  totalPrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

export default Deliveries;
