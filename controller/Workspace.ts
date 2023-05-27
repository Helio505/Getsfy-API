import express from "express";
import { Request, Response } from "express";
import Workspace from "../model/Workspace";
import User from "../model/User";
import mongoose from "mongoose";
import Task from "../model/Task";

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

export async function getWorkspaceMembersById(req: Request, res: Response) {
  const _id = req.params.id;

  const isIdValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isIdValid) {
    return res.status(203).send("Invalid mongodb objectid.");
  }

  const workspaceById = await Workspace.findById(_id).lean();
  if (!workspaceById) {
    return res.status(203).send("There's no workspace with this id.");
  }

  if (workspaceById.memberIds.length === 0) {
    return res.status(203).send("There's no members in this workspace.");
  }

  return res.status(200).json(workspaceById.memberIds);
}

export async function getWorkspacesByUserId(req: any, res: Response) {
  const userId = req.userId;

  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isUserIdValid) {
    return res.status(203).send("Erro desconhecido");
  }

  try {
    const workspaces = await Workspace.find({
      $or: [
        { creatorId: userId }, // Workspaces em que o usuário é o criador (creatorId)
        { memberIds: userId }, // Workspaces em que o usuário é membro (memberIds)
      ],
    }).lean();

    return res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar os workspaces do usuário.");
  }
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
  console.log("Entrou no deleteAllWorkspaces");
  const workspaces = await Workspace.find();
  const workspaceIds = workspaces.map((workspace: any) => workspace._id);

  await Workspace.deleteMany();
  await Task.deleteMany({ workspaceId: { $in: workspaceIds } });

  return res.send(
    "Todos os workspaces e suas tasks associadas foram deletados."
  );
}

export async function addMemberToWorkspace(req: any, res: Response) {
  const userId = req.userId;
  const memberToAddEmail = req.body.memberEmail;
  const workspaceId = req.params.id;

  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);

  if (!isUserIdValid) {
    return res
      .status(203)
      .send("IDs inválidos de usuário ou membro a ser adicionado.");
  }

  try {
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).send("O workspace não foi encontrado.");
    }

    if (workspace.creatorId.toString() !== userId) {
      return res
        .status(203)
        .send("Apenas o criador do workspace pode enviar convites.");
    }

    const memberToAdd = await User.findOne({ email: memberToAddEmail }).lean();

    if (!memberToAdd) {
      return res
        .status(203)
        .send("O usuário a ser convidado não foi encontrado.");
    }

    // Verifica se o membro já está na lista de membros ou se já existe um convite pendente para esse membro
    if (
      workspace.memberIds.some(
        (memberId: any) => memberId.toString() === memberToAdd._id.toString()
      ) ||
      workspace.pendingInvitations.some(
        (invitation: any) =>
          invitation.userId.toString() === memberToAdd._id.toString()
      )
    ) {
      return res
        .status(203)
        .send("O usuário já é um membro ou já possui um convite pendente.");
    }

    // Cria um novo _id para o convite pendente
    const newInvitationId = new mongoose.Types.ObjectId();

    // Adiciona o convite pendente ao workspace com o novo _id
    workspace.pendingInvitations.push({
      _id: String(newInvitationId),
      userId: memberToAdd._id.toString(),
      invitationStatus: "pending",
    });

    await workspace.save();

    // Adicione a lógica para enviar a notificação push para o membroToAdd._id

    return res.status(200).json("Convite enviado com sucesso.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao enviar convite para o workspace.");
  }
}

export async function getPendingInvitations(req: any, res: Response) {
  const userId = req.userId;

  try {
    const workspaces = await Workspace.find({
      "pendingInvitations.userId": userId,
    });

    const pendingInvitations = workspaces.reduce(
      (invitations: any[], workspace: any) => {
        const workspaceInvitations = workspace.pendingInvitations.filter(
          (invitation: any) => invitation.userId.toString() === userId
        );
        const workspaceName = workspace.name; // Adicione a propriedade correta que representa o nome do workspace
        const invitationsWithWorkspaceName = workspaceInvitations.map(
          (invitation: any) => ({
            _id: invitation._id,
            workspaceId: workspace._id,
            workspaceName: workspaceName,
          })
        );
        invitations.push(...invitationsWithWorkspaceName);
        return invitations;
      },
      []
    );

    console.log(JSON.stringify(pendingInvitations));

    return res.status(200).json(pendingInvitations);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar convites pendentes.");
  }
}

export async function acceptInvitationAndAddMember(req: any, res: Response) {
  console.log(1);

  const userId = req.userId;
  const invitationId = req.params.invitationId;

  // Verifica se os IDs são válidos
  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  const isInvitationIdValid = mongoose.Types.ObjectId.isValid(invitationId);

  console.log(2);
  if (!isUserIdValid || !isInvitationIdValid) {
    return res.status(400).send("IDs inválidos de usuário ou convite.");
  }
  console.log(3);

  try {
    // Encontre o usuário e o convite correspondentes
    const user = await User.findById(userId);
    const workspace = await Workspace.findOne({
      "pendingInvitations._id": invitationId,
    });
    console.log(4);

    if (!user || !workspace) {
      return res.status(404).send("Usuário ou convite não encontrado.");
    }

    // Verifique se o usuário já é um membro ou se o convite está pendente
    if (
      workspace.memberIds.includes(userId) ||
      !workspace.pendingInvitations.some(
        (invitation: any) =>
          invitation._id.toString() === invitationId &&
          invitation.userId.toString() === userId
      )
    ) {
      return res.status(403).send("Usuário já é membro ou convite inválido.");
    }

    // Remova o convite pendente do array "pendingInvitations"
    workspace.pendingInvitations = workspace.pendingInvitations.filter(
      (invitation: any) => invitation._id.toString() !== invitationId
    );

    // Adicione o usuário à lista de membros
    workspace.memberIds.push(userId);

    // Salve as alterações no espaço de trabalho
    await workspace.save();

    return res
      .status(200)
      .send("Convite aceito e membro adicionado com sucesso.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao aceitar convite e adicionar membro.");
  }
}

export async function declineInvitation(req: any, res: Response) {
  const userId = req.userId;
  const workspaceId = req.params.workspaceId;

  try {
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).send("O workspace não foi encontrado.");
    }

    // Verifica se o convite pendente existe para o usuário atual
    const pendingInvitation = workspace.pendingInvitations.find(
      (invitation: any) => invitation.userId.toString() === userId
    );

    if (!pendingInvitation) {
      return res
        .status(404)
        .send("O convite pendente não foi encontrado para o usuário.");
    }

    // Remove o convite pendente do workspace
    workspace.pendingInvitations = workspace.pendingInvitations.filter(
      (invitation: any) => invitation.userId.toString() !== userId
    );

    await workspace.save();

    return res.status(200).send("Convite recusado com sucesso.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao recusar convite.");
  }
}
