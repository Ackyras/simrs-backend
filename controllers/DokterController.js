import Dokter from "../models/DokterModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getDokters = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Dokter.findAll({
        attributes: [
          "id",
          "nama",
          "gender",
          "kontak",
          "email",
          "poliklinik",
          "alamat",
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

export const getDoktersCount = async (req, res) => {
  try {
    // Implement your logic to get the count of Dokter count for the current month
    const dokterCount = await Dokter.count();

    res.status(200).json({ dokterCount });
  } catch (error) {
    console.error("Error getting Dokter Count data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDokterById = async (req, res) => {
  try {
    const dokter = await Dokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(dokter);
    if (!dokter) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Dokter.findOne({
        attributes: [
          "id",
          "nama",
          "gender",
          "kontak",
          "email",
          "poliklinik",
          "alamat",
          "status",
        ],
        where: {
          id: dokter.id,
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

export const getDokterByName = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Dokter.findAll({
        attributes: ["id", "nama", "poliklinik"],
        where: {
          status: "Aktif",
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

export const createDokter = async (req, res) => {
  const { nama, gender, kontak, email, poliklinik, alamat, status } = req.body;
  try {
    await Dokter.create({
      nama,
      gender,
      kontak,
      email,
      poliklinik,
      alamat,
      status,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Dokter Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dokter) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, gender, kontak, email, poliklinik, alamat, status } =
      req.body;
    if (req.role === "admin" || req.role === "medis") {
      await Dokter.update(
        {
          nama,
          gender,
          kontak,
          email,
          poliklinik,
          alamat,
          status,
          userId: req.userId,
        },
        {
          where: {
            id: dokter.id,
          },
        }
      );
    }
    res.status(200).json({ msg: "Dokter updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dokter) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, gender, kontak, email, poliklinik, alamat, status } =
      req.body;
    if (req.role === "admin" || req.role === "medis") {
      await Dokter.destroy({
        where: {
          id: dokter.id,
        },
      });
    }
    res.status(200).json({ msg: "Dokter deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
