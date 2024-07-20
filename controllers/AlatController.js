import Model from "../models/BatchAlatModel.js";
import User from "../models/UserModel.js";
import Supplier from "../models/SupplierModel.js";
import { Op } from "sequelize";

export const getAlats = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.Alats.findAll({
        attributes: ["uuid", "nama", "stok", "satuan", "supplierId"],
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
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const getAlatById = async (req, res) => {
  try {
    const alat = await Model.Alats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    console.log(alat);
    if (!alat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.Alats.findOne({
        attributes: ["uuid", "nama", "satuan", "stok", "supplierId"],
        where: {
          uuid: alat.uuid,
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

export const createAlat = async (req, res) => {
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
    await Model.Alats.create({
      nama,
      stok,
      satuan,
      supplierNama: supplier.namaSupplier,
      supplierId: req.supplierId,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Alat Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAlat = async (req, res) => {
  try {
    const alat = await Model.Alats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!alat) return res.status(404).json({ msg: "Data tidak ditemukan" });
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
      await Model.Alats.update(
        {
          nama,
          satuan,
          supplierId,
          supplierNama: supplier.namaSupplier,
          userId: req.userId,
        },
        {
          where: {
            uuid: alat.uuid,
          },
        }
      );
    }
    res.status(200).json({ msg: "Alat updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAlat = async (req, res) => {
  try {
    const alat = await Model.Alats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!alat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, stok, satuan, supplierId } = req.body;
    if (req.role === "admin" || req.role === "perlengkapan") {
      await Model.BatchAlats.destroy({
        where: {
          alatId: alat.uuid,
        },
      });

      await Model.Alats.destroy({
        where: {
          uuid: alat.uuid,
        },
      });
    }
    res.status(200).json({ msg: "Alat deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
