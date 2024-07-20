import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Suppliers from "./SupplierModel.js";
// import Obats from "./ObatModel.js";

const { DataTypes } = Sequelize;
console.log("masuk batch models");

const Obats = db.define(
  "obats",
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
    kadaluarsaMax: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: false,
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
      type: DataTypes.ENUM(
        "Strip",
        "Buah",
        "Botol",
        "Box",
        "Tube",
        "Tablet",
        "Dus"
      ),
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    batchObatId: {
      type: DataTypes.INTEGER,
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

Users.hasMany(Obats);
Obats.belongsTo(Users, { foreignKey: "userId" });

Suppliers.hasMany(Obats);
Obats.belongsTo(Suppliers, { foreignKey: "supplierId" });

const BatchObats = db.define(
  "batchObats",
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
    kadaluarsa: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: false,
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
        len: [0, 70],
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

Users.hasMany(BatchObats);
BatchObats.belongsTo(Users, { foreignKey: "userId" });
console.log("get data obats");
Obats.hasMany(BatchObats, { onDelete: "CASCADE" });
BatchObats.belongsTo(Obats, { foreignKey: "obatId" });

const BatchObatsKeluar = db.define(
  "batchObatsKeluar",
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
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
        len: [0, 70],
      },
    },
    batchObatId: {
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

Users.hasMany(BatchObatsKeluar);
BatchObatsKeluar.belongsTo(Users, { foreignKey: "userId" });
console.log("get data obats");

BatchObats.hasMany(BatchObatsKeluar, { onDelete: "CASCADE" });
BatchObatsKeluar.belongsTo(BatchObats, { foreignKey: "batchObatId" });

export default { Obats, BatchObats, BatchObatsKeluar };
