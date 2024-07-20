import User from "../models/UserModel.js";
import Supplier from "../models/SupplierModel.js";
import Model from "../models/BatchAlatModel.js";
import { Op, Sequelize } from "sequelize";
import { startOfMonth, endOfMonth } from "date-fns";

export const getBatchAlats = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.BatchAlats.findAll({
        attributes: [
          "uuid",
          "tanggalBatch",
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
            model: Model.Alats,
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

export const getBatchAlatsMasukThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Alat Masuk for the current month
    const alatMasukCount = await Model.BatchAlats.count({
      where: {
        kategori: "Masuk",
        // Add conditions to filter by month, you might need to adjust this based on your data model
        tanggalBatch: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ alatMasukCount });
  } catch (error) {
    console.error("Error getting Alat Masuk data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBatchAlatsKeluarThisMonth = async (req, res) => {
  try {
    // Implement your logic to get the count of Alat Keluar for the current month
    const alatKeluarCount = await Model.BatchAlats.count({
      where: {
        kategori: "Keluar",
        // Add conditions to filter by month, you might need to adjust this based on your data model
        tanggalBatch: {
          [Op.gte]: startOfMonth(new Date()),
          [Op.lt]: endOfMonth(new Date()),
        },
        // Add other conditions as needed
      },
    });

    res.status(200).json({ alatKeluarCount });
  } catch (error) {
    console.error("Error getting Alat Keluar data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBatchAlatByAlatId = async (req, res) => {
  try {
    const alat = req.params.alatId;
    console.log(alat);
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.BatchAlats.findAll({
        where: {
          alatId: alat,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Alats,
            attributes: ["nama", "satuan"],
            include: {
              model: Supplier,
              attributes: ["namaSupplier"],
            },
          },
        ],
      });
      console.log(alat);
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const getBatchAlatById = async (req, res) => {
  try {
    const batchAlat = await Model.BatchAlats.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    console.log(batchAlat);
    if (!batchAlat)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Model.BatchAlats.findOne({
        where: {
          uuid: batchAlat.uuid,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: Model.Alats,
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

export const createBatchAlat = async (req, res) => {
  try {
    const alatBaru = await Model.Alats.create({
      nama: req.body.nama,
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
    console.log(alatBaru);
    await Model.BatchAlats.create({
      tanggalBatch: req.body.tanggalBatch,
      noFaktur: req.body.noFaktur,
      kategori: req.body.kategori,
      jumlah: req.body.jumlah,
      harga: req.body.harga,
      keterangan: req.body.keterangan,
      alatId: alatBaru.uuid,
      userId: req.userId,
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: Model.Alats,
          attributes: ["nama", "satuan", "stok", "namaSupplier"],
        },
      ],
    });
    res.status(201).json({ msg: "BatchAlat Created Successfuly" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const addBatchAlat = async (req, res) => {
  try {
    const alatLama = await Model.BatchAlats.create({
      tanggalBatch: req.body.tanggalBatch,
      noFaktur: req.body.noFaktur,
      kategori: req.body.kategori,
      jumlah: req.body.jumlah,
      harga: req.body.harga,
      keterangan: req.body.keterangan,
      alatId: req.body.alatId,
      userId: req.userId,
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: Model.Alats,
          attributes: ["nama", "satuan", "stok", "namaSupplier"],
        },
      ],
    });
    if (req.body.kategori === "Masuk") {
      await Model.Alats.update(
        { stok: Sequelize.literal(`stok + ${req.body.jumlah}`) },
        { where: { uuid: req.body.alatId } }
      );
    } else if (req.body.kategori === "Keluar") {
      await Model.Alats.update(
        { stok: Sequelize.literal(`stok - ${req.body.jumlah}`) },
        { where: { uuid: req.body.alatId } }
      );
    }
    res.status(201).json({ msg: "BatchAlat Created Successfuly" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getSupplierByName = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "perlengkapan") {
      response = await Supplier.findAll({
        attributes: ["uuid", "namaSupplier"],
        where: {
          kategori: "Peralatan Medis",
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
          kategori: "Peralatan Medis",
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

// export const updateBatchAlat = async (req, res) => {
//   try {
//     const batchAlat = await BatchAlat.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!batchAlat) return res.status(404).json({ msg: "Data tidak ditemukan" });
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
//       await BatchAlat.update(
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
//             uuid: batchAlat.uuid,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== batchAlat.userId)
//         return res.status(403).json({ msg: "Akses terlarang" });
//       await BatchAlat.update(
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
//             [Op.and]: [{ id: batchAlat.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ msg: "BatchAlat updated successfuly" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const deleteBatchAlat = async (req, res) => {
  try {
    const batchAlat = await Model.BatchAlats.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!batchAlat)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin" || req.role === "perlengkapan") {
      await Model.BatchAlats.destroy({
        where: {
          uuid: batchAlat.uuid,
        },
      });
    } else {
      if (req.userId !== batchAlat.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Model.BatchAlats.destroy({
        where: {
          [Op.and]: [{ id: batchAlat.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "BatchAlat deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
