import RekamMedis from "../models/RekamMedisModel.js";
import User from "../models/UserModel.js";
import Pasien from "../models/PasienModel.js";
import Model from "../models/BatchObatModel.js";
import Dokter from "../models/DokterModel.js";
import { Op, Sequelize } from "sequelize";
import { startOfMonth, endOfMonth } from "date-fns";
import ObatRekamMedis from "../models/ObatRekamMedisModel.js";

export const getRekamMedis = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await RekamMedis.findAll({
        attributes: [
          "id",
          "tanggal",
          "keluhan",
          "diagnosa",
          "pemeriksaan",
          "tindakan",
          "dokter",
          "status",
          "caraMasuk",
          "poliklinik",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
        ],
      });
    } else {
      response = await RekamMedis.findAll({
        attributes: [
          "id",
          "tanggal",
          "keluhan",
          "diagnosa",
          "pemeriksaan",
          "tindakan",
          "dokter",
          "status",
          "caraMasuk",
          "poliklinik",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRekamMedisThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Rekam Medis baru for the current month
    const rekamMedisBaruCount = await RekamMedis.count({
      where: {
        // Add conditions to filter by month, you might need to adjust this based on your data model
        tanggal: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ rekamMedisBaruCount });
  } catch (error) {
    console.error("Error getting Rekam Medis Baru data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRekamMedisByPasienId = async (req, res) => {
  try {
    const pasien = req.params.pasienId;
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await RekamMedis.findAll({
        where: {
          pasienId: pasien,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
          {
            model: Dokter,
            attributes: ["id", "nama"],
          },
          {
            model: Model.Obats,
          },
        ],
      });
      console.log(pasien);
    } else {
      response = await RekamMedis.findAll({
        attributes: [
          "id",
          "tanggal",
          "keluhan",
          "diagnosa",
          "pemeriksaan",
          "tindakan",
          "dokter",
          "status",
          "caraMasuk",
          "poliklinik",
        ],
        where: {
          pasienId: pasien,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
          {
            model: Dokter,
            attributes: ["id", "nama"],
          },
          {
            model: Model.Obats,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRekamMedisById = async (req, res) => {
  try {
    const rekamMedis = await RekamMedis.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(rekamMedis);
    if (!rekamMedis)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await RekamMedis.findOne({
        where: {
          id: rekamMedis.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
          {
            model: Dokter,
            attributes: ["id", "nama"],
          },
          {
            model: Model.Obats,
          },
        ],
      });
    } else {
      response = await RekamMedis.findOne({
        where: {
          [Op.and]: [{ id: rekamMedis.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Pasien,
            attributes: ["id", "nama"],
          },
          {
            model: Dokter,
            attributes: ["id", "nama"],
          },
          {
            model: Model.Obats,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createRekamMedis = async (req, res) => {
  console.log(req.body);

  try {
    const rekamMedisBaru = await RekamMedis.create({
      tanggal: req.body.tanggal,
      keluhan: req.body.keluhan,
      diagnosa: req.body.diagnosa,
      pemeriksaan: req.body.pemeriksaan,
      tindakan: req.body.tindakan,
      dokterId: req.body.dokterId,
      status: req.body.status,
      caraMasuk: req.body.caraMasuk,
      poliklinik: req.body.poliklinik,
      pasienId: req.body.pasienId,
      userId: req.userId,

      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: Dokter,
          attributes: ["id", "nama"],
        },
        {
          model: Pasien,
          attributes: ["id", "nama"],
        },
      ],
    });
    const pasien = await Pasien.findOne({
      where: {
        id: req.body.pasienId,
      },
    });
    if (!pasien) {
      return res.status(404).json({ msg: "Pasien not found" });
    }
    if (req.body.selectedObat) {
      req.body.selectedObat.forEach(async (element) => {
        const obat = await Model.Obats.findOne({
          where: {
            uuid: element.obatId,
          },
        });
        console.log(obat);
        try {
          const obatrekammedis = await ObatRekamMedis.create({
            rekammedisId: rekamMedisBaru.id,
            obatId: element.obatId,
            userId: req.userId,
            jumlah: element.jumlah,
          });
          if (obatrekammedis) {
            // await addBatchObat({
            //   body: {
            //     obatId: element.obatId,
            //     kategori: "Keluar",
            //     jumlah: element.jumlah,
            //     tanggalBatch: req.body.tanggal, // Atau tanggal batch sesuai kebutuhan
            //     keterangan: `Rekam Medis ID: ${rekamMedisBaru.id}`,
            //   },
            //   userId: req.userId,
            // });
            // Step 1: Sort batches by expiry date
            const sortedBatches = await Model.BatchObats.findAll({
              where: { obatId: element.obatId },
              include: [
                { model: Model.BatchObatsKeluar, attributes: ["jumlah"] },
              ],
              order: [["kadaluarsa", "ASC"]],
            });
            let remainingQuantity = element.jumlah;
            let currentExpDate = null;
            // Step 2: Iterate over sorted batches
            for (const batch of sortedBatches) {
              // Deduct the quantity based on outgoing batches
              for (const batchKeluar of batch.batchObatsKeluars) {
                batch.jumlah -= batchKeluar.jumlah;
              }
              // Calculate deduction quantity
              const deductionQuantity = Math.min(
                remainingQuantity,
                batch.jumlah
              );
              if (deductionQuantity !== 0) {
                // Create BatchObatsKeluar record
                await Model.BatchObatsKeluar.create({
                  tanggalBatch: req.body.tanggal,
                  jumlah: deductionQuantity,
                  keterangan: `Rekam Medis ID: ${rekamMedisBaru.id}`,
                  batchObatId: batch.uuid,
                  userId: req.userId,
                });
                // Deduct from remaining quantity
                remainingQuantity -= deductionQuantity;
                batch.jumlah -= deductionQuantity;
              }
              if (batch.jumlah > 0 && currentExpDate == null) {
                currentExpDate = batch.kadaluarsa;
              }
            }
            // Update Obats record
            await Model.Obats.update(
              {
                stok: Sequelize.literal(`stok - ${element.jumlah}`),
                kadaluarsaMax: currentExpDate,
              },
              { where: { uuid: element.obatId } }
            );
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: error.message });
        }
      });
    }
    res.status(201).json({ msg: "RekamMedis Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDokterByName = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "medis") {
      response = await Dokter.findAll({
        attributes: ["uuid", "nama", "poliklinik"],
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
    } else {
      response = await Dokter.findAll({
        attributes: ["uuid", "nama", "poliklinik"],
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

// export const getObatByName = async (req, res) => {
//   try {
//     let response;
//     if (req.role === "admin" || req.role === "perlengkapan") {
//       response = await Model.Obats.findAll({
//         attributes: ["uuid", "nama"],
//         where: {
//           stok: { [Op.gt]: 0 },
//         },
//         include: [
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//         ],
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//     console.log(error.message);
//   }
// };

// export const updateRekamMedis = async (req, res) => {
//   try {
//     const rekamMedis = await RekamMedis.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!rekamMedis)
//       return res.status(404).json({ msg: "Data tidak ditemukan" });
//     const {
//       tanggalPelayanan,
//       keluhan,
//       diagnosa,
//       pemeriksaan,
//       dokter,
//       status,
//       caraMasuk,
//       poliklinik,
//       pasienId,
//     } = req.body;

//     const pasien = await Pasien.findOne({
//       where: {
//         id: pasienId,
//       },
//     });

//     if (!pasien) {
//       return res.status(404).json({ msg: "Pasien not found" });
//     }

//     if (req.role === "admin" || req.role === "medis") {
//       await RekamMedis.update(
//         {
//           tanggalPelayanan,
//           pasienNama: pasien.nama,
//           keluhan,
//           diagnosa,
//           pemeriksaan,
//           dokter,
//           status,
//           caraMasuk,
//           poliklinik,
//           pasienId,
//           userId: req.userId,
//         },
//         {
//           where: {
//             id: rekamMedis.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== rekamMedis.userId)
//         return res.status(403).json({ msg: "Akses terlarang" });
//       await RekamMedis.update(
//         {
//           tanggalPelayanan,
//           pasienNama: pasien.nama,
//           keluhan,
//           diagnosa,
//           pemeriksaan,
//           dokter,
//           status,
//           caraMasuk,
//           poliklinik,
//           pasienId,
//           userId: req.userId,
//         },
//         {
//           where: {
//             [Op.and]: [{ id: rekamMedis.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ msg: "RekamMedis updated successfuly" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const deleteRekamMedis = async (req, res) => {
  try {
    const rekamMedis = await RekamMedis.findOne({
      where: {
        id: req.params.id,
      },
    });
    const obat = await Model.Obats.findOne({
      where: {
        id: obatId,
      },
    });
    if (!rekamMedis)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      tanggal,
      pasienNama,
      keluhan,
      diagnosa,
      pemeriksaan,
      tindakan,
      dokter,
      status,
      caraMasuk,
      poliklinik,
      pasienId,
      obatId,
      jumlahObat,
    } = req.body;
    if (req.role === "admin" || req.role === "medis") {
      await RekamMedis.destroy({
        where: {
          id: rekamMedis.id,
        },
      });
      obat.update({
        stok: obat.stok + jumlahObat,
      });
    } else {
      if (req.userId !== rekamMedis.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await RekamMedis.destroy({
        where: {
          [Op.and]: [{ id: rekamMedis.id }, { userId: req.userId }],
        },
      });
      obat.update({
        stok: obat.stok + jumlahObat,
      });
    }
    res.status(200).json({ msg: "RekamMedis deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
