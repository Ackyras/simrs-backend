import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Obats from "./ObatModel.js";

const { DataTypes } = Sequelize;

const ObatKeluars = db.define(
  "obatKeluars",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    tanggalBatch: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    obatId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(ObatKeluars);
ObatKeluars.belongsTo(Users, { foreignKey: "userId" });

Obats.hasMany(ObatKeluars);
ObatKeluars.belongsTo(Obats, { foreignKey: "obatId" });

export default ObatKeluars;
