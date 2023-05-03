import express from "express";
import { Request, Response } from "express";
import Task from "../model/Task";
import mongoose from "mongoose";

export async function createTask(req: Request, res: Response) {
  const {
    description,
    type,
    id,
    priority,
    team,
    status,
    dueDate,
    assignee,
    workspace,
    project,
    tags,
  } = req.body;

  if (!description) {
    return res.status(203).send("Description can't be null.");
  }
  if (!type) {
    return res.status(203).send("Type can't be null.");
  }
  if (!id) {
    return res.status(203).send("ID can't be null.");
  }
  if (!priority) {
    return res.status(203).send("Priority can't be null.");
  }
  if (!team) {
    return res.status(203).send("Team can't be null.");
  }
  if (!status) {
    return res.status(203).send("Status can't be null.");
  }
  if (!dueDate) {
    return res.status(203).send("Due date can't be null.");
  }
  if (!assignee) {
    return res.status(203).send("Assignee can't be null.");
  }
  if (!workspace) {
    return res.status(203).send("Workspace can't be null.");
  }
  if (!project) {
    return res.status(203).send("Project can't be null.");
  }
  if (!tags) {
    return res.status(203).send("Tags can't be null.");
  }

  // Validando type:
  const possible = ["Project", "Task"];
  if (!possible.includes(type)) {
    return res.status(203).send("Invalid type.");
  }

  const task = await new Task({
    description,
    type,
    id,
    priority,
    team,
    status,
    dueDate,
    assignee,
    workspace,
    project,
    tags,
  });

  await task.save();

  return res.status(200).send("Success, task created.");
}

export async function getTaskById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  // Validando existência:
  const taskById = await Task.findOne({ _id: _id }).lean();
  if (!taskById) {
    return res.status(203).send("There's no task with this id.");
  }

  return res.status(200).json(taskById);
}

export async function updateTaskById(req: Request, res: Response) {
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
  const taskById = await Task.findById(_id).lean();
  if (!taskById) {
    return res.status(203).send("Não existe task com esse ID no BD.");
  }

  // Operação no BD:
  try {
    await Task.findByIdAndUpdate(_id, req.body);
    return res.status(200).send("Task modificada com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel modificar.");
  }
}

export async function deleteTaskById(req: Request, res: Response) {
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
  const taskById = await Task.findById(_id).lean();
  if (!taskById) {
    return res.status(203).send("Não existe task com esse id.");
  }

  // Operação no BD:
  try {
    await Task.findByIdAndDelete(_id);
    return res.status(200).send("Deletado com sucesso.");
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possivel deletar.");
  }
}
