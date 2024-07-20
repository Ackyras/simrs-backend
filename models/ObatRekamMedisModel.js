import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Model from "./BatchObatModel.js";
import RekamMedis from "./RekamMedisModel.js";
// import Obats from "./ObatModel.js";

const { DataTypes } = Sequelize;
console.log("Obat Rekam Medis");

const ObatRekamMedis = db.define(
  "obatrekammedis",
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
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false,
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

Users.hasMany(ObatRekamMedis);
ObatRekamMedis.belongsTo(Users, { foreignKey: "userId" });

Model.Obats.belongsToMany(RekamMedis, {
  through: ObatRekamMedis,
  foreignKey: "obatId",
  otherKey: "rekammedisId",
});
RekamMedis.belongsToMany(Model.Obats, {
  through: ObatRekamMedis,
  foreignKey: "rekammedisId",
  otherKey: "obatId",
});

export default ObatRekamMedis;
