import Supplier from "../models/SupplierModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getSuppliers = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Supplier.findAll({
        attributes: [
          "uuid",
          "tanggalMasuk",
          "namaSupplier",
          "kontak",
          "alamat",
          "kategori",
          "status",
        ],
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
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    console.log(supplier);
    if (!supplier) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Supplier.findOne({
        attributes: [
          "uuid",
          "tanggalMasuk",
          "namaSupplier",
          "kontak",
          "alamat",
          "kategori",
          "status",
        ],
        where: {
          uuid: supplier.uuid,
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
  }
};

export const createSupplier = async (req, res) => {
  const { tanggalMasuk, namaSupplier, kontak, alamat, kategori, status } =
    req.body;
  try {
    await Supplier.create({
      tanggalMasuk,
      namaSupplier,
      kontak,
      alamat,
      kategori,
      status,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Supplier Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!supplier) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { tanggalMasuk, namaSupplier, kontak, alamat, kategori, status } =
      req.body;
    if (req.role === "admin" || req.role === "perlengkapan") {
      await Supplier.update(
        {
          tanggalMasuk,
          namaSupplier,
          kontak,
          alamat,
          kategori,
          status,
          userId: req.userId,
        },
        {
          where: {
            uuid: supplier.uuid,
          },
        }
      );
    }
    res.status(200).json({ msg: "Supplier updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!supplier) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { tanggalMasuk, namaSupplier, kontak, alamat, kategori, status } =
      req.body;
    if (req.role === "admin" || req.role === "perlengkapan") {
      await Supplier.destroy({
        where: {
          uuid: supplier.uuid,
        },
      });
    }
    res.status(200).json({ msg: "Supplier deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
