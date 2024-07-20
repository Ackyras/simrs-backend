import BatchObat from "../models/BatchObatModel.js";
import User from "../models/UserModel.js";
import Supplier from "../models/SupplierModel.js";
import Model from "../models/BatchObatModel.js";
import { Op, Sequelize } from "sequelize";
import { startOfMonth, endOfMonth } from "date-fns";

export const getBatchObats = async (req, res) => {
  try {
    let response;
    if (
      req.role === "admin" ||
      req.role === "perlengkapan" ||
      req.role === "medis"
    ) {
      response = await Model.BatchObats.findAll({
        attributes: [
          "uuid",
          "tanggalBatch",
          "kadaluarsa",
          "noFaktur",
          "kategori",
          "jumlah",
          "harga",
          "keterangan",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Obats,
            attributes: ["nama", "stok", "satuan"],
            include: {
              model: Supplier,
              attributes: ["namaSupplier"],
            },
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBatchObatsMasukThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Obat Masuk for the current month
    const obatMasukCount = await Model.BatchObats.count({
      where: {
        // Add conditions to filter by month, you might need to adjust this based on your data model
        tanggalBatch: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ obatMasukCount });
  } catch (error) {
    console.error("Error getting Obat Masuk data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBatchObatsKeluarThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Obat Keluar for the current month
    const obatKeluarCount = await Model.BatchObatsKeluar.count({
      where: {
        // Add conditions to filter by month, you might need to adjust this based on your data model
        tanggalBatch: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ obatKeluarCount });
  } catch (error) {
    console.error("Error getting Obat Keluar data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getBatchObatById = async (req, res) => {
//   try {
//     const batchObat = await BatchObat.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     console.log(batchObat);
//     if (!batchObat)
//       return res.status(404).json({ msg: "Data tidak ditemukan" });
//     let response;
//     if (req.role === "admin" || req.role === "perlengkapan") {
//       response = await BatchObat.findOne({
//         attributes: [
//           "uuid",
//           "tanggalBatch",
//           "noFaktur",
//           "kategori",
//           "jumlah",
//           "satuan",
//           "keterangan",
//         ],
//         where: {
//           uuid: batchObat.uuid,
//         },
//         include: [
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//           {
//             model: Supplier,
//             attributes: ["nama"],
//           },
//         ],
//       });
//     } else {
//       response = await BatchObat.findOne({
//         attributes: [
//           "uuid",
//           "tanggalBatch",
//           "noFaktur",
//           "kategori",
//           "jumlah",
//           "satuan",
//           "keterangan",
//         ],
//         where: {
//           [Op.and]: [{ id: batchObat.id }, { userId: req.userId }],
//         },
//         include: [
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//           {
//             model: Supplier,
//             attributes: ["nama"],
//           },
//         ],
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const getSupplierByName = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Supplier.findAll({
        attributes: ["uuid", "namaSupplier"],
        where: {
          kategori: "Obat",
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
      response = await Supplier.findAll({
        attributes: ["uuid", "namaSupplier"],
        where: {
          kategori: "Obat",
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

export const getBatchObatByObatId = async (req, res) => {
  try {
    const obat = req.params.obatId;
    let response = [];
    if (
      req.role === "admin" ||
      req.role === "medis" ||
      req.role === "perlengkapan"
    ) {
      const batchObatMasuks = await Model.BatchObats.findAll({
        where: {
          obatId: obat,
        },
        attributes: ["tanggalBatch", "uuid"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Obats,
            attributes: ["nama", "satuan"],
            include: {
              model: Supplier,
              attributes: ["namaSupplier"],
            },
          },
        ],
      });
      for (const batchObatMasuk of batchObatMasuks) {
        const batchObatsKeluars = await Model.BatchObatsKeluar.findAll({
          where: {
            batchObatId: batchObatMasuk.uuid,
          },
          attributes: ["tanggalBatch", "uuid"],
        });
        const masukData = {
          ...batchObatMasuk.toJSON(),
          kategori: "masuk",
        };
        response.push(masukData);
        for (const batchObatKeluar of batchObatsKeluars) {
          const keluarData = {
            ...batchObatKeluar.toJSON(),
            kategori: "keluar",
          };
          response.push(keluarData);
        }
      }
      console.log(obat);
    } else {
      response = await Model.BatchObats.findAll({
        attributes: [
          "uuid",
          "tanggalBatch",
          "kadaluarsa",
          "noFaktur",
          "kategori",
          "jumlah",
          "harga",
          "keterangan",
        ],
        where: {
          obatId: obat,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Obats,
            attributes: ["nama", "satuan"],
            include: {
              model: Supplier,
              attributes: ["namaSupplier"],
            },
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBatchObatById = async (req, res) => {
  try {
    const kategori = req.query.kategori;
    let batchObat = null;
    if (kategori == "masuk") {
      batchObat = await Model.BatchObats.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });
    } else if (kategori == "keluar") {
      batchObat = await Model.BatchObatsKeluar.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });
    }
    console.log(batchObat);
    if (!batchObat)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (
      req.role === "admin" ||
      req.role === "perlengkapan" ||
      req.role === "medis"
    ) {
      if (kategori == "masuk") {
        const batchObatMasuk = await Model.BatchObats.findOne({
          where: {
            uuid: batchObat.uuid,
          },
          include: [
            {
              model: User,
              attributes: ["name", "email"],
            },
            {
              model: Model.Obats,
              include: {
                model: Supplier,
                attributes: ["namaSupplier"],
              },
            },
          ],
        });
        response = {
          tanggalBatch: batchObatMasuk.tanggalBatch,
          obat: batchObatMasuk.obat,
          kadaluarsa: batchObatMasuk.kadaluarsa,
          kategori: kategori,
          noFaktur: batchObatMasuk.noFaktur,
          jumlah: batchObatMasuk.jumlah,
          harga: batchObatMasuk.harga,
          keterangan: batchObatMasuk.keterangan,
        };
      } else if (kategori == "keluar") {
        const batchObatKeluar = await Model.BatchObatsKeluar.findOne({
          where: {
            uuid: batchObat.uuid,
          },
          include: [
            {
              model: Model.BatchObats,
              include: [
                {
                  model: Model.Obats,
                  include: {
                    model: Supplier,
                    attributes: ["namaSupplier"],
                  },
                },
              ],
            },
          ],
        });
        response = {
          tanggalBatch: batchObatKeluar.tanggalBatch,
          obat: batchObatKeluar.batchObat.obat,
          kadaluarsa: null,
          kategori: kategori,
          noFaktur: "-",
          jumlah: batchObatKeluar.jumlah,
          harga: "-",
          keterangan: batchObatKeluar.keterangan,
        };
      }
    } else {
      response = await Model.BatchObats.findOne({
        where: {
          [Op.and]: [{ id: batchObat.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Obats,
            include: {
              model: Supplier,
              attributes: ["namaSupplier"],
            },
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBatchObat = async (req, res) => {
  try {
    const obatBaru = await Model.Obats.create({
      nama: req.body.nama,
      kadaluarsaMax: req.body.kadaluarsa,
      stok: req.body.jumlah,
      satuan: req.body.satuan,
      supplierId: req.body.supplierId,
      userId: req.userId,

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
    console.log(obatBaru);
    await Model.BatchObats.create({
      tanggalBatch: req.body.tanggalBatch,
      kadaluarsa: req.body.kadaluarsa,
      noFaktur: req.body.noFaktur,
      jumlah: req.body.jumlah,
      harga: req.body.harga,
      keterangan: req.body.keterangan,
      obatId: obatBaru.uuid,
      userId: req.userId,

      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: Model.Obats,
          attributes: ["nama", "satuan", "stok", "namaSupplier"],
        },
      ],
    });

    res.status(201).json({ msg: "BatchObat Created Successfuly" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const addBatchObat = async (req, res) => {
  const { obatId, kategori, jumlah } = req.body;
  const obat = await Model.Obats.findOne({
    where: {
      uuid: req.body.obatId,
    },
  });
  if (!obat) {
    return res.status(404).json({ msg: "Obat not found" });
  }
  if (kategori === "Masuk") {
    try {
      // For incoming batches
      await Model.BatchObats.create({
        tanggalBatch: req.body.tanggalBatch,
        kadaluarsa: req.body.kadaluarsa,
        noFaktur: req.body.noFaktur,
        jumlah: req.body.jumlah,
        harga: req.body.harga,
        keterangan: req.body.keterangan,
        obatId: req.body.obatId,
        userId: req.userId,
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Obats,
            attributes: ["nama", "satuan", "stok", "namaSupplier"],
          },
        ],
      });
      let currentExpDate = obat.kadaluarsaMax;
      if (
        new Date(Date.now()) < new Date(req.body.kadaluarsa) &&
        new Date(req.body.kadaluarsa) < new Date(currentExpDate)
      ) {
        currentExpDate = req.body.kadaluarsa;
      }
      // Update the stock of the drug (obat)
      await Model.Obats.update(
        {
          stok: Sequelize.literal(`stok + ${req.body.jumlah}`),
          kadaluarsaMax: currentExpDate,
        },
        { where: { uuid: req.body.obatId } }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: error.message });
    }
  } else if (kategori === "Keluar") {
    try {
      // Step 1: Sort batches by expiry date
      const sortedBatches = await Model.BatchObats.findAll({
        where: { obatId },
        include: [{ model: Model.BatchObatsKeluar, attributes: ["jumlah"] }],
        order: [["kadaluarsa", "ASC"]],
      });
      let remainingQuantity = jumlah;
      let currentExpDate = null;
      // Step 2: Iterate over sorted batches
      for (const batch of sortedBatches) {
        // Deduct the quantity based on outgoing batches
        for (const batchKeluar of batch.batchObatsKeluars) {
          batch.jumlah -= batchKeluar.jumlah;
        }
        // Calculate deduction quantity
        const deductionQuantity = Math.min(remainingQuantity, batch.jumlah);
        if (deductionQuantity !== 0) {
          // Create BatchObatsKeluar record
          await Model.BatchObatsKeluar.create({
            tanggalBatch: req.body.tanggalBatch,
            jumlah: deductionQuantity,
            keterangan: req.body.keterangan,
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
          stok: Sequelize.literal(`stok - ${jumlah}`),
          kadaluarsaMax: currentExpDate,
        },
        { where: { uuid: req.body.obatId } }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: error.message });
    }
  }
  res.status(201).json({ msg: "BatchObat Created Successfully" });
};

// export const addBatchObat = async (req, res) => {
//   console.log(req.body);
//   try {
//     await Model.BatchObats.create({
//       tanggalBatch: req.body.tanggalBatch,
//       kadaluarsa: req.body.kadaluarsa,
//       noFaktur: req.body.noFaktur,
//       kategori: req.body.kategori,
//       jumlah: req.body.jumlah,
//       harga: req.body.harga,
//       keterangan: req.body.keterangan,
//       obatId: req.body.obatId,
//       userId: req.userId,

//       include: [
//         {
//           model: User,
//           attributes: ["name", "email"],
//         },
//         {
//           model: Model.Obats,
//           attributes: ["nama", "satuan", "stok", "namaSupplier"],
//         },
//       ],
//     });

//     if (req.body.kategori === "Masuk") {
//       await Model.Obats.update(
//         { stok: Sequelize.literal(`stok + ${req.body.jumlah}`) },
//         { where: { uuid: req.body.obatId } }
//       );
//     } else if (req.body.kategori === "Keluar") {
//       await Model.Obats.update(
//         { stok: Sequelize.literal(`stok - ${req.body.jumlah}`) },
//         { where: { uuid: req.body.obatId } }
//       );
//     }

// value=8
// obatKeluar=[]
// foreach(obats as obat){
//  if(obat.jumlah <value){
//   obatKeluar=[...ObatKeluar, {
//     id=obat.id,
//     jlh=obat.jlh
//   }]
//  }else{
//   obatKeluar=[...ObatKeluar, {
//     id=obat.id,
//     jlh=value
//   }]
//  }
//  value=value-obat.jlh
// }
// foreach(obatkeluar as obat){
//   batchObat.create()
// }

// const obat = Model.Obats.findOne({ where: { uuid: req.body.obatId } });
// console.log(req.body.kadaluarsa, obat.kadaluarsaMax);
// if (new Date(req.body.kadaluarsa) < new Date(obat.kadaluarsaMax)) {
//   console.log("tssd");
//   await Model.Obats.update(
//     { kadaluarsaMax: req.body.kadaluarsa },
//     { where: { uuid: req.body.obatId } }
//   );
// }

//     res.status(201).json({ msg: "BatchObat Created Successfuly" });
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

// export const updateBatchObat = async (req, res) => {
//   try {
//     const batchObat = await BatchObat.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!batchObat) return res.status(404).json({ msg: "Data tidak ditemukan" });
//     const { nama, stok, supplierId } = req.body;

//     const supplier = await Supplier.findOne({
//       where: {
//         uuid: supplierId,
//       },
//     });

//     if (!supplier) {
//       return res.status(404).json({ msg: "Supplier not found" });
//     }

//     if (req.role === "admin" || req.role === "perlengkapan") {
//       await BatchObat.update(
//         {
//           nama,
//           stok,
//           satuan,
//           supplierNama: supplier.namaSupplier,
//           supplierId,
//           userId: req.userId,
//         },
//         {
//           where: {
//             uuid: batchObat.uuid,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== batchObat.userId)
//         return res.status(403).json({ msg: "Akses terlarang" });
//       await BatchObat.update(
//         {
//           nama,
//           stok,
//           satuan,
//           supplierNama: supplier.namaSupplier,
//           supplierId,
//           userId: req.userId,
//         },
//         {
//           where: {
//             [Op.and]: [{ id: batchObat.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ msg: "BatchObat updated successfuly" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const deleteBatchObat = async (req, res) => {
  try {
    const batchObat = await Model.BatchObats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!batchObat)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin" || req.role === "perlengkapan") {
      await BatchObat.destroy({
        where: {
          uuid: batchObat.uuid,
        },
      });
    } else {
      if (req.userId !== batchObat.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Model.BatchObats.destroy({
        where: {
          [Op.and]: [{ id: batchObat.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "BatchObat deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
