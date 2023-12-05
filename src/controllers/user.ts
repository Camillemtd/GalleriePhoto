// userController.ts
import { Request, Response } from "express";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-config';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Utilisateur connecté :", user.uid);

    const token = await user.getIdToken();
    console.log("Token ID :", token);

    res.status(200).json({ token: token, message: "Connexion réussie" });
  } catch (error) {
    console.error("Erreur de connexion :", error);
    res.status(500).send("Erreur de connexion");
  }
};