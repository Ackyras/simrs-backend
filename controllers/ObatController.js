import Model from "../models/BatchObatModel.js";
import User from "../models/UserModel.js";
import Supplier from "../models/SupplierModel.js";
import { Op, Sequelize } from "sequelize";

export const getObats = async (req, res) => {
  try {
    let response;
    if (
      req.role === "admin" ||
      req.role === "perlengkapan" ||
      req.role === "medis"
    ) {
      response = await Model.Obats.findAll({
        attributes: [
          "uuid",
          "nama",
          "stok",
          "satuan",
          "kadaluarsaMax",
          "supplierId",
          "batchObatId",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Supplier,
            attributes: ["namaSupplier"],
          },
          {
            model: Model.BatchObats,
            attributes: [
              [
                Sequelize.fn("MIN", Sequelize.col("kadaluarsa")),
                "kadaluarsaMax",
              ],
            ],
            group: ["obatId"], // Group by obatId to get the minimum kadaluarsa for each Obat
          },
        ],
        group: ["uuid"],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getObatById = async (req, res) => {
  try {
    const obat = await Model.Obats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    console.log(obat);
    if (!obat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.Obats.findOne({
        attributes: ["uuid", "nama", "stok", "satuan", "supplierId"],
        where: {
          uuid: obat.uuid,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Supplier,
            attributes: ["namaSupplier"],
          },
        ],
      });
    } else {
      response = await Model.Obats.findOne({
        attributes: ["uuid", "nama", "stok", "satuan", "supplierId"],
        where: {
          [Op.and]: [{ id: obat.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Supplier,
            attributes: ["namaSupplier"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getObatByName = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Model.Obats.findAll({
        attributes: ["uuid", "nama"],
        where: {
          stok: { [Op.gt]: 0 },
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.log(error.message);
  }
};

export const createObat = async (req, res) => {
  const { nama, stok, satuan, supplierId } = req.body;

  try {
    const supplier = await Supplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }

    await Obat.create({
      nama,
      stok,
      satuan,
      supplierNama: supplier.namaSupplier,
      supplierId: req.supplierId,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Obat Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateObat = async (req, res) => {
  try {
    const obat = await Model.Obats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!obat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, satuan, supplierId } = req.body;

    const supplier = await Supplier.findOne({
      where: {
        uuid: supplierId,
      },
    });

    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }

    if (req.role === "admin" || req.role === "perlengkapan") {
      await Model.Obats.update(
        {
          nama,
          satuan,
          supplierId,
          supplierNama: supplier.namaSupplier,
          userId: req.userId,
        },
        {
          where: {
            uuid: obat.uuid,
          },
        }
      );
    } else {
      if (req.userId !== obat.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Model.Obats.update(
        {
          nama,
          stok,
          satuan,
          supplierId,
          supplierNama: supplier.namaSupplier,
          userId: req.userId,
        },
        {
          where: {
            [Op.and]: [{ id: obat.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Obat updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteObat = async (req, res) => {
  try {
    const obat = await Model.Obats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!obat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, stok, satuan, supplierId } = req.body;
    if (req.role === "admin" || req.role === "perlengkapan") {
      const batchObats = await Model.BatchObats.findAll({
        where: {
          obatId: obat.uuid,
        },
      });
      for (const batchObat of batchObats) {
        await Model.BatchObatsKeluar.destroy({
          where: {
            batchObatId: batchObat.uuid,
          },
        });
        batchObat.destroy();
      }

      await Model.Obats.destroy({
        where: {
          uuid: obat.uuid,
        },
      });
    }
    res.status(200).json({ msg: "Obat deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
