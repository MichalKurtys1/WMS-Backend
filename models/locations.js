import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Operations from "./operations";
import Product from "./product";

const Locations = sequelize.define("locations", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  operationId: {
    type: Sequelize.UUID,
    references: {
      model: Operations,
      key: "id",
    },
  },
  productId: {
    type: Sequelize.UUID,
    references: {
      model: Product,
      key: "id",
    },
  },
  numberOfProducts: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  posX: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posY: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

Product.hasMany(Locations, {
  foreignKey: "productId",
});
Locations.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

export default Locations;
