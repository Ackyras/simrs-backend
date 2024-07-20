import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Suppliers from "./SupplierModel.js";

const { DataTypes } = Sequelize;

const Alats = db.define(
  "alats",
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
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 30],
      },
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    satuan: {
      type: DataTypes.ENUM("Set", "Buah", "Unit", "Box", "Tube", "Roll", "Dus"),
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },

    supplierId: {
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

Users.hasMany(Alats);
Alats.belongsTo(Users, { foreignKey: "userId" });

Suppliers.hasMany(Alats, { foreignKey: "supplierId" });
Alats.belongsTo(Suppliers, { foreignKey: "supplierId" });

const BatchAlats = db.define(
  "batchAlats",
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
    noFaktur: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
        len: [0, 70],
      },
    },

    kategori: {
      type: DataTypes.ENUM("Keluar", "Masuk"),
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

    harga: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },

    alatId: {
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

Users.hasMany(BatchAlats);
BatchAlats.belongsTo(Users, { foreignKey: "userId" });

Alats.hasMany(BatchAlats);
BatchAlats.belongsTo(Alats, { foreignKey: "alatId" });

export default { Alats, BatchAlats };
