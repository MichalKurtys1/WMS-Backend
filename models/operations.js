import Sequelize from "sequelize";
import sequelize from "../utils/db";
import Supplier from "./supplier";
import Deliveries from "./deliveries";
import Orders from "./orders";
import Locations from "./locations";

const Operations = sequelize.define("operations", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  deliveriesId: {
    type: Sequelize.UUID,
    references: {
      model: Deliveries,
      key: "id",
    },
  },
  ordersId: {
    type: Sequelize.UUID,
    references: {
      model: Orders,
      key: "id",
    },
  },
  stage: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: "",
  },
});

Operations.hasMany(Locations, {
  foreignKey: "operationId",
});
Locations.belongsTo(Operations, {
  foreignKey: "operationId",
});

export default Operations;
