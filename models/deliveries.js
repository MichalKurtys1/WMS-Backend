import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Operations from "./operations";

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
  state: {
    type: Sequelize.STRING,
    defaultValue: "Zlecone",
    allowNull: true,
  },
  products: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

Deliveries.hasMany(Operations, {
  foreignKey: "deliveriesId",
});
Operations.belongsTo(Deliveries, {
  foreignKey: "deliveriesId",
  onDelete: "CASCADE",
});

export default Deliveries;
