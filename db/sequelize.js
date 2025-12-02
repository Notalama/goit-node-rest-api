import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;
