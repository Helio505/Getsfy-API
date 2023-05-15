import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import User from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = String(process.env.JWT_SECRET);

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(203).send("Insira seu nome");
  }

  if (!email) {
    return res.status(203).send("Insira seu email");
  }

  if (!password) {
    return res.status(203).send("Insira sua senha");
  }

  if (password.length < 8) {
    return res.status(203).send("Insira uma senha maior");
  }

  const role = "user";

  const crypted_password = await bcrypt.hash(password, 10);

  const existsUser = await User.findOne({
    email,
  }).lean();

  if (existsUser) {
    return res.status(203).send("Esse email já foi registrado");
  }

  const user = await new User({
    name,
    email,
    role,
    password: crypted_password,
  });

  await user.save();

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET
  );

  return res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  }).lean();

  if (!user) {
    return res.status(203).send("Credenciais inválidas");
  }

  if (password.length < 8) {
    return res.status(203).send("Credenciais inválidas");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!user || !passwordMatch) {
    return res.status(203).send("Invalid credentials.");
  }

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET
  );

  return res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.name,
    },
    token,
  });
}
