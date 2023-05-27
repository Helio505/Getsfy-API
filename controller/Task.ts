import express from "express";
import { Request, Response } from "express";
import Task from "../model/Task";
import mongoose from "mongoose";

export async function createTask(req: any, res: Response) {
  const { description, priority, workspaceId } = req.body;

  const userId = req.userId;

  if (!description) {
    return res.status(203).send("Description can't be null.");
  }

  if (!priority) {
    return res.status(203).send("Priority can't be null.");
  }

  if (!workspaceId) {
    return res.status(203).send("WorkspaceId can't be null.");
  }

  const task = await new Task({
    description,
    priority,
    status: "To Do",
    workspaceId,
    creatorId: userId,
  });

  await task.save();

  return res.status(200).json(task);
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

export async function getTaskByWorkspaceId(req: Request, res: Response) {
  const workspaceId = req.params.workspaceId;

  const isIdValid = mongoose.Types.ObjectId.isValid(workspaceId);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  const tasksByWorkspaceId = await Task.find({ workspaceId }).lean();
  if (!tasksByWorkspaceId) {
    return res.status(203).send("There's no task with this id.");
  }

  return res.status(200).json(tasksByWorkspaceId);
}

export async function getTaskByUserId(req: any, res: Response) {
  const userId = req.userId;

  const isIdValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  const tasksByWorkspaceId = await Task.find({ creatorId: userId }).lean();
  if (!tasksByWorkspaceId) {
    return res.status(203).send("There's no task with this id.");
  }

  return res.status(200).json(tasksByWorkspaceId);
}

export async function updateTaskById(req: Request, res: Response) {
  const _id = req.params.id;

  // Validando a id:
  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res
      .status(203)
      .send(
        "A ObjectId passada no parâmetro não é válida. Insira uma ObjectId válida do MongoDB."
      );
  }

  // Validando a existência:
  const taskById = await Task.findById(_id).lean();
  if (!taskById) {
    return res
      .status(203)
      .send("Não existe uma tarefa com esse ID no banco de dados.");
  }

  // Verificando parâmetros no corpo da requisição:
  const {
    createdAt,
    name,
    description,
    creatorId,
    workspaceId,
    priority,
    status,
    dueDate,
    assignee,
    tags,
  } = req.body;

  // Atualizando apenas os campos fornecidos no corpo da requisição:
  const updateData: any = {};
  if (createdAt) {
    updateData.createdAt = createdAt;
  }
  if (name) {
    updateData.name = name;
  }
  if (description) {
    updateData.description = description;
  }
  if (creatorId) {
    updateData.creatorId = creatorId;
  }
  if (workspaceId) {
    updateData.workspaceId = workspaceId;
  }
  if (priority) {
    updateData.priority = priority;
  }
  if (status) {
    updateData.status = status;
  }
  if (dueDate) {
    updateData.dueDate = dueDate;
  }
  if (assignee) {
    updateData.assignee = assignee;
  }
  if (tags) {
    updateData.tags = tags;
  }

  // Operação no banco de dados:
  try {
    const task = await Task.findByIdAndUpdate(_id, updateData).lean();
    return res.status(200).json(task);
  } catch (e) {
    console.error(e);
    return res.status(203).send("Não foi possível modificar a tarefa.");
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
