import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;

const sequelize = new Sequelize("myDB", "root", "", {
  dialect: "mysql",
  host: url,
});

export default sequelize;
