import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Deliveries from "./deliveries";

const Shipping = sequelize.define("shipping", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: Sequelize.UUID,
    references: {
      model: Deliveries,
      key: "id",
    },
  },
  totalWeight: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  palletSize: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  palletNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default Shipping;
