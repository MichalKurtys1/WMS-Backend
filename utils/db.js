import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;
const schema = process.env.DB_SCHEMA;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(schema, user, password, {
  dialect: "mysql",
  host: url,
});

export default sequelize;
