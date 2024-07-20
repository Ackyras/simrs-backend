// import { Sequelize } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import Obats from "./ObatModel.js";

// const { DataTypes } = Sequelize;

// const LaporanObats = db.define(
//   "laporanObats",
//   {
//     uuid: {
//       type: DataTypes.STRING,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     tanggalRestok: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     kadaluarsa: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     noFaktur: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     kategori: {
//       type: DataTypes.ENUM("Penambahan Obat", "Pengurangan Obat"),
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     jumlah: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     satuan: {
//       type: DataTypes.ENUM(
//         "Strip",
//         "Buah",
//         "Botol",
//         "Box",
//         "Tube",
//         "Tablet",
//         "Dus"
//       ),
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     keterangan: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     obatId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//   },
//   {
//     freezeTableName: true,
//   }
// );

// Users.hasMany(LaporanObats);
// LaporanObats.belongsTo(Users, { foreignKey: "userId" });

// Obats.hasMany(LaporanObats);
// LaporanObats.belongsTo(Obats, { foreignKey: "obatId" });

// export default Obats;
