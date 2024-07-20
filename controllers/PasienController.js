import Pasien from "../models/PasienModel.js";
import User from "../models/UserModel.js";
import Rekammedis from "../models/RekamMedisModel.js";
import { Op } from "sequelize";
import { startOfMonth, endOfMonth } from "date-fns";

export const getPasiens = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Pasien.findAll({
        attributes: [
          "id",
          "tanggalDaftar",
          "nama",
          "gender",
          "umur",
          "goldar",
          "noTelp",
          "alamat",
          "pekerjaan",
          "suku",
          "orangtua",
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

export const getPasiensThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Pasien baru for the current month
    const pasienBaruCount = await Pasien.count({
      where: {
        // Add conditions to filter by month, you might need to adjust this based on your data model
        createdAt: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ pasienBaruCount });
  } catch (error) {
    console.error("Error getting Pasien Baru data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPasienById = async (req, res) => {
  try {
    const pasien = await Pasien.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(pasien);
    if (!pasien) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Pasien.findOne({
        attributes: [
          "id",
          "tanggalDaftar",
          "nama",
          "gender",
          "umur",
          "goldar",
          "noTelp",
          "alamat",
          "pekerjaan",
          "suku",
          "orangtua",
        ],
        where: {
          id: pasien.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Pasien.findOne({
        attributes: [
          "id",
          "tanggalDaftar",
          "nama",
          "gender",
          "umur",
          "goldar",
          "noTelp",
          "alamat",
          "pekerjaan",
          "suku",
          "orangtua",
        ],
        where: {
          [Op.and]: [{ id: pasien.id }, { userId: req.userId }],
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

export const createPasien = async (req, res) => {
  const {
    tanggalDaftar,
    nama,
    gender,
    umur,
    goldar,
    noTelp,
    alamat,
    pekerjaan,
    suku,
    orangtua,
  } = req.body;
  try {
    await Pasien.create({
      tanggalDaftar,
      nama,
      gender,
      umur,
      goldar,
      noTelp,
      alamat,
      pekerjaan,
      suku,
      orangtua,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Pasien Created Successfuly" });
  } catch (error) {
    console.error("Error server:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updatePasien = async (req, res) => {
  try {
    const pasien = await Pasien.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!pasien) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      tanggalDaftar,
      nama,
      gender,
      umur,
      goldar,
      noTelp,
      alamat,
      pekerjaan,
      suku,
      orangtua,
    } = req.body;
    if (req.role === "admin" || req.role === "medis") {
      await Pasien.update(
        {
          tanggalDaftar,
          nama,
          gender,
          umur,
          goldar,
          noTelp,
          alamat,
          pekerjaan,
          suku,
          orangtua,
          userId: req.userId,
        },
        {
          where: {
            id: pasien.id,
          },
        }
      );
    } else {
      if (req.userId !== pasien.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Pasien.update(
        {
          tanggalDaftar,
          nama,
          gender,
          umur,
          goldar,
          noTelp,
          alamat,
          pekerjaan,
          suku,
          orangtua,
          userId: req.userId,
        },
        {
          where: {
            [Op.and]: [{ id: pasien.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Pasien updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePasien = async (req, res) => {
  try {
    const pasien = await Pasien.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!pasien) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      tanggalDaftar,
      nama,
      gender,
      umur,
      goldar,
      noTelp,
      alamat,
      pekerjaan,
      suku,
      orangtua,
    } = req.body;
    if (req.role === "admin" || req.role === "medis") {
      await Rekammedis.destroy({
        where: {
          pasienId: pasien.id,
        },
      });
      await Pasien.destroy({
        where: {
          id: pasien.id,
        },
      });
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
    res.status(200).json({ msg: "Pasien deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
