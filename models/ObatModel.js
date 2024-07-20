// import { Sequelize } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import Suppliers from "./SupplierModel.js";
// import BatchObats from "./BatchObatModel.js";

// const { DataTypes } = Sequelize;
// console.log("masuk obat model");
// const Obats = db.define(
//   "obats",
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
//     nama: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//         len: [1, 30],
//       },
//     },
//     stok: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       validate: {
//         notEmpty: false,
//       },
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
//       allowNull: true,
//       validate: {
//         notEmpty: false,
//       },
//     },
//     batchObatId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     supplierId: {
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

// Users.hasMany(Obats);
// Obats.belongsTo(Users, { foreignKey: "userId" });

// Suppliers.hasMany(Obats);
// Obats.belongsTo(Suppliers, { foreignKey: "supplierId" });

// export default Obats;
