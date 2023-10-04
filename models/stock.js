import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Product from "./product";

const Stock = sequelize.define("stock", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: Sequelize.UUID,
    references: {
      model: Product,
      key: "id",
    },
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  totalQuantity: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  availableStock: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  ordered: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
});

export default Stock;
