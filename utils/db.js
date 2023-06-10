import { Sequelize } from "sequelize";

const sequelize = new Sequelize("myDB", "admin", "michal2001", {
  dialect: "mysql",
  host: "inzynierka.cf6kiymaoxvp.eu-central-1.rds.amazonaws.com",
});

export default sequelize;
