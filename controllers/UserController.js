import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["id", "uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password berbeda" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error.message);
  }
};

export const checkOldPassword = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.body.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  try {
    const isMatch = await argon2.verify(user.password, req.body.oldPassword);
    res.status(200).json({ match: isMatch });
  } catch (error) {
    console.error("Error memeriksa password lama", error);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password berbeda" });

  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );
    res.status(200).json({ msg: "Data User telah diubah" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        uuid: user.uuid,
      },
    });
    res.status(200).json({ msg: "User telah dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};
