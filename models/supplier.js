import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Deliveries from "./deliveries";
import Product from "./product";

const Supplier = sequelize.define("supplier", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bank: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Supplier.hasMany(Deliveries, {
  foreignKey: "supplierId",
});
Deliveries.belongsTo(Supplier, {
  foreignKey: "supplierId",
});

Supplier.hasMany(Product, {
  foreignKey: "supplierId",
});
Product.belongsTo(Supplier, {
  foreignKey: "supplierId",
});

export default Supplier;
