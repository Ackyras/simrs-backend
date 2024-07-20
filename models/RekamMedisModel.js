import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Pasiens from "./PasienModel.js";
import Model from "./BatchObatModel.js";
import Dokters from "./DokterModel.js";

const { DataTypes } = Sequelize;

const RekamMedis = db.define(
  "rekamMedis",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    keluhan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 70],
      },
    },
    diagnosa: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 70],
      },
    },
    pemeriksaan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 30],
      },
    },
    tindakan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 30],
      },
    },
    status: {
      type: DataTypes.ENUM("Baru", "Kontrol"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    caraMasuk: {
      type: DataTypes.ENUM("UGD", "Poliklinik"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    poliklinik: {
      type: DataTypes.ENUM(
        "Penyakit Dalam",
        "Anak",
        "Bedah",
        "Syaraf",
        "THT",
        "Mata",
        "Kulit dan Kelamin",
        "Kandungan Kehamilan",
        "-"
      ),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pasienId: {
      type: DataTypes.INTEGER,
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
    dokterId: {
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

Users.hasMany(RekamMedis);
RekamMedis.belongsTo(Users, { foreignKey: "userId" });

Dokters.hasMany(RekamMedis);
RekamMedis.belongsTo(Dokters, { foreignKey: "dokterId" });

Pasiens.hasMany(RekamMedis);
RekamMedis.belongsTo(Pasiens, { foreignKey: "pasienId" });

RekamMedis.hasMany(Model.Obats);
Model.Obats.belongsTo(RekamMedis, { foreignKey: "rekamMedisId" });
export default RekamMedis;
