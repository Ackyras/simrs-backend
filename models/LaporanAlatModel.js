// import { Sequelize } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import Alats from "./AlatModel.js";

// const { DataTypes } = Sequelize;

// const LaporanAlats = db.define(
//   "laporanAlats",
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
//     noFaktur: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       validate: {
//         notEmpty: false,
//       },
//     },

//     kategori: {
//       type: DataTypes.ENUM("Penambahan Alat", "Pengurangan Alat"),
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
//       type: DataTypes.ENUM("Set", "Buah", "Unit", "Box", "Tube", "Roll", "Dus"),
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     keterangan: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     alatId: {
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

// Users.hasMany(LaporanAlats);
// LaporanAlats.belongsTo(Users, { foreignKey: "userId" });

// Alats.hasMany(LaporanAlats);
// LaporanAlats.belongsTo(Alats, { foreignKey: "alatId" });

// export default LaporanAlats;
