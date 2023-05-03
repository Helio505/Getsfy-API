import express from "express";
import { Request, Response } from "express";
import Subtask from "../model/Subtask";
import mongoose from "mongoose";

export async function createSubtask(req: Request, res: Response) {
  const { description, id, status, taskIdBelongsTo } = req.body;

  if (!description) {
    return res.status(203).send("Description can't be null.");
  }
  if (!id) {
    return res.status(203).send("ID can't be null.");
  }
  if (!status) {
    return res.status(203).send("Status can't be null.");
  }
  if (!taskIdBelongsTo) {
    return res.status(203).send("taskIdBelongsTo can't be null.");
  }
  // Validando id:
  const isIdValid = mongoose.Types.ObjectId.isValid(taskIdBelongsTo);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid in 'taskIdBelongsTo'.");
  }

  const subtask = await new Subtask({
    description,
    id,
    status,
    taskIdBelongsTo,
  });

  await subtask.save();

  return res.status(200).send("Success, subtask created.");
}

export async function getSubtaskById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  // Validando existência:
  const subtaskById = await Subtask.findOne({ _id: _id }).lean();
  if (!subtaskById) {
    return res.status(203).send("There's no subtask with this id.");
  }

  return res.status(200).json(subtaskById);
}

export async function updateSubtaskById(req: Request, res: Response) {
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
  const subtaskById = await Subtask.findById(_id).lean();
  if (!subtaskById) {
    return res.status(203).send("Não existe task com esse ID no BD.");
  }

  // Operação no BD:
  try {
    await Subtask.findByIdAndUpdate(_id, req.body);
    return res.status(200).send("Subtask modificada com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel modificar.");
  }
}

export async function deleteSubtaskById(req: Request, res: Response) {
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
  const subtaskById = await Subtask.findById(_id).lean();
  if (!subtaskById) {
    return res.status(203).send("Não existe subtask com esse id.");
  }

  // Operação no BD:
  try {
    await Subtask.findByIdAndDelete(_id);
    return res.status(200).send("Deletado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel deletar.");
  }
}
