import Sequelize from "sequelize";
import sequelize from "../utils/db";

const Calendar = sequelize.define("calendar", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  event: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Calendar;
