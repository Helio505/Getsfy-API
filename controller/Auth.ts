import express from "express";
import { Request, Response } from "express";
import User from "../model/User";

export async function createUser(req: Request, res: Response) {
  const { name, email, avatar, role } = req.body;

  if (!name) {
    return res.status(203).send("Name can't be null.");
  }

  if (!email) {
    return res.status(203).send("Email can't be null.");
  }

  if (!avatar) {
    return res.status(203).send("Avatar can't be null.");
  }

  if (!role) {
    return res.status(203).send("Role can't be null.");
  }

  const possibleRoles = ["admin", "user"];
  if (!possibleRoles.includes(role)) {
    return res.status(203).send("Invalid role.");
  }

  const user = await new User({
    name,
    email,
    avatar,
    role,
  });

  await user.save();

  return res.status(200).send("Success, user created.");
}

export async function loginUser(req: Request, res: Response) {
  return res.send("Not yet developed.")
}
