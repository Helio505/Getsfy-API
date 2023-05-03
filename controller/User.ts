import express from "express";
import { Request, Response } from "express";
import User from "../model/User";
import mongoose from "mongoose";

export async function getUsersByRole(req: Request, res: Response) {
  const role = req.params.role;

  if (!role) {
    return res.status(203).send("Role parameter is invalid.");
  }

  // Validando role:
  const possibleRoles = ["user", "admin"];
  if (!possibleRoles.includes(role)) {
    return res.status(203).send("Invalid role.");
  }

  // Validando existência do user:
  const usersByRole = await User.find({ role }).lean();
  if (!usersByRole) {
    return res
      .status(203)
      .send("Não existem usuários que se encaixam nesse role.");
  }

  return res.status(200).json(usersByRole);
}

export async function getUserById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando a id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res
      .status(203)
      .send(
        "A ObjectId passada no parametro, não é válida. Insira uma Mongodb ObjectId válida."
      );
  }

  // Validando a existência do user:
  const userById = await User.findOne({ _id: _id }).lean();
  if (!userById) {
    return res.status(203).send("Não existe user com esse ID no BD.");
  }

  return res.status(200).json(userById);
}

export async function updateUserById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando a id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res
      .status(203)
      .send(
        "A ObjectId passada no parametro, não é válida. Insira uma Mongodb ObjectId válida."
      );
  }

  // Validando a existência do user:
  const userById = await User.findById(_id).lean();
  if (!userById) {
    return res.status(203).send("Não existe user com esse ID no BD.");
  }

  // Operação no BD:
  try {
    await User.findByIdAndUpdate(_id, req.body);
    return res.status(200).send("User modificado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel modificar o user.");
  }
}

export async function deleteUserById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando a id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res
      .status(203)
      .send(
        "A ObjectId passada no parametro, não é válida. Insira uma Mongodb ObjectId válida."
      );
  }

  // Validando a existência do user:
  const userById = await User.findById(_id).lean();
  if (!userById) {
    return res.status(203).send("Não existe user com esse id.");
  }

  // Operação no BD:
  try {
    await User.findByIdAndDelete(_id);
    return res.status(200).send("User deletado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel deletar o user.");
  }
}
