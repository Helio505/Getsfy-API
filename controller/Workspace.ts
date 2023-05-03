import express from "express";
import { Request, Response } from "express";
import Workspace from "../model/Workspace";
import mongoose from "mongoose";

export async function createWorkspace(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(203).send("Name can't be null.");
  }

  const task = await new Workspace({
    name,
  });

  await task.save();

  return res.status(200).send("Success, workspace created.");
}

export async function getWorkspaceById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  // Validando existência:
  const workspaceById = await Workspace.findOne({ _id: _id }).lean();
  if (!workspaceById) {
    return res.status(203).send("There's no workspace with this id.");
  }

  return res.status(200).json(workspaceById);
}

export async function updateWorkspaceById(req: Request, res: Response) {
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

  // Validando a existência:
  const workspaceById = await Workspace.findById(_id).lean();
  if (!workspaceById) {
    return res.status(203).send("Não existe Workspace com esse ID no BD.");
  }

  // Operação no BD:
  try {
    await Workspace.findByIdAndUpdate(_id, req.body);
    return res.status(200).send("Workspace modificado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel modificar.");
  }
}

export async function deleteWorkspaceById(req: Request, res: Response) {
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

  // Validando a existência:
  const workspaceById = await Workspace.findById(_id).lean();
  if (!workspaceById) {
    return res.status(203).send("Não existe Workspace com esse id.");
  }

  // Operação no BD:
  try {
    await Workspace.findByIdAndDelete(_id);
    return res.status(200).send("Deletado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel deletar.");
  }
}
