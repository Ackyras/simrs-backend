import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Pasiens = db.define(
  "pasiens",
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
    tanggalDaftar: {
      type: DataTypes.DATE,
      allowNull: false,
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
    umur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    goldar: {
      type: DataTypes.ENUM("A", "B", "AB", "O", "-"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    noTelp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 20],
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
    pekerjaan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 90],
      },
    },
    suku: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 30],
      },
    },
    orangtua: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 70],
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

Users.hasMany(Pasiens);
Pasiens.belongsTo(Users, { foreignKey: "userId" });

export default Pasiens;
