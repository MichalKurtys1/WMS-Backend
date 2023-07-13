import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";

const Product = sequelize.define("product", {
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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  capacity: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  unit: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pricePerUnit: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

export default Product;