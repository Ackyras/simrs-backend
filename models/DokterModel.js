import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Dokters = db.define(
  "dokters",
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
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 70],
      },
    },

    gender: {
      type: DataTypes.ENUM("Pria", "Wanita"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kontak: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 70],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
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
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 90],
      },
    },
    status: {
      type: DataTypes.ENUM("Aktif", "Nonaktif"),
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

Users.hasMany(Dokters);
Dokters.belongsTo(Users, { foreignKey: "userId" });

export default Dokters;
