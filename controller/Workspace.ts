import express from "express";
import { Request, Response } from "express";
import Workspace from "../model/Workspace";
import User from "../model/User";
import mongoose from "mongoose";

export async function createWorkspace(req: any, res: Response) {
  const { name } = req.body;

  const userId = req.userId;

  console.log(userId);

  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isUserIdValid) {
    return res.status(203).send("Erro desconhecido");
  }

  if (!name) {
    return res.status(203).send("Name can't be null.");
  }

  const workspace = await new Workspace({
    name,
    creatorId: userId,
  });

  await workspace.save();

  return res.status(200).json(workspace);
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

export async function getWorkspacesByUserId(req: any, res: Response) {
  const userId = req.userId;

  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isUserIdValid) {
    return res.status(203).send("Erro desconhecido");
  }

  // Validando id:
  // const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  // if (!isIdValid) {
  // return res.status(203).send("Invalid mongodb objectid.");
  // }

  // Validando existência:
  const workspaceById = await Workspace.find({ creatorId: userId }).lean();
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

export async function deleteAllWorkspaces(req: any, res: any) {
  console.log("oi");
  await Workspace.deleteMany();
  return res.send("Todos worksapces foram deletados.");
}

export async function addMemberToWorkspace(req: any, res: Response) {
  const userId = req.userId;
  const memberToAddId = req.body.memberId;

  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  const isMemberToAddIdValid = mongoose.Types.ObjectId.isValid(memberToAddId);

  if (!isUserIdValid || !isMemberToAddIdValid) {
    return res
      .status(203)
      .send("IDs inválidos de usuário ou membro a ser adicionado.");
  }

  try {
    const workspace = await Workspace.findOne({ _id: req.params.workspaceId });

    if (!workspace) {
      return res.status(404).send("O workspace não foi encontrado.");
    }

    if (workspace.creatorId.toString() !== userId) {
      return res
        .status(203)
        .send("Apenas o criador do workspace pode enviar convites.");
    }

    const memberToAdd = await User.findById(memberToAddId).lean();

    if (!memberToAdd) {
      return res
        .status(203)
        .send("O usuário a ser convidado não foi encontrado.");
    }

    // Verifica se o membro já está na lista de membros ou se já existe um convite pendente para esse membro
    if (
      workspace.memberIds.includes(memberToAddId) ||
      workspace.pendingInvitations.some(
        (invitation) => invitation.userId.toString() === memberToAddId
      )
    ) {
      return res
        .status(203)
        .send("O usuário já é um membro ou já possui um convite pendente.");
    }

    // Adiciona o convite pendente ao workspace
    memberToAddId &&
      workspace.pendingInvitations.push({
        userId: memberToAddId,
        invitationStatus: "pending",
      });

    await workspace.save();

    // Adicionar a lógica para enviar a notificação push para o membroToAddId

    return res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao enviar convite para o workspace.");
  }
}
