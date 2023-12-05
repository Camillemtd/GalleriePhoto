import { Request, Response } from "express";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, firestore } from "../firebase-config";

export const createPicture = async (req: Request, res: Response) => {
	if (!req.file) {
        return res.status(400).send("Aucun fichier valide n'a été téléchargé ou le type de fichier n'est pas autorisé.");
    }

  if (!req["uid"]) {
    return res.status(403).send("L'opération nécessite une authentification.");
  }

  const { title, description } = req.body;

  try {
    const storageRef = ref(storage, `images/${req.file.filename}`);
    const snapshot = await uploadBytes(storageRef, req.file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = await addDoc(collection(firestore, "photos"), {
      title,
      description,
      imageUrl: downloadURL,
    });

    res
      .status(200)
      .json({ message: "Photo créée avec succès", docId: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors du traitement de la photo.");
  }
};

export const getAllPictures = async (req: Request, res: Response) => {
  try {
    const photoCollection = collection(firestore, "photos");
    const photoSnapshot = await getDocs(photoCollection);
    const photoList = photoSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(photoList);
  } catch (error) {
    console.error("Erreur lors de la récupération des photos: ", error);
    res.status(500).send("Erreur lors de la récupération des photos.");
  }
};

export const deletePicture = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photoDocRef = doc(firestore, "photos", id);
    const photoDoc = await getDoc(photoDocRef);

    if (!photoDoc.exists()) {
      return res.status(404).send("Photo non trouvée.");
    }

    // Récupérer l'URL de l'image depuis Firestore
    const imageUrl = photoDoc.data().imageUrl;

    // Créer une référence à l'image dans Firebase Storage
    const imageRef = ref(storage, imageUrl);

    // Supprimer l'image de Firebase Storage
    await deleteObject(imageRef);

    // Supprimer le document de Firestore
    await deleteDoc(photoDocRef);

    res.status(200).send("Photo supprimée avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo: ", error);
    res.status(500).send("Erreur lors de la suppression de la photo.");
  }
};

export const getPictureById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photoDocRef = doc(firestore, "photos", id);
    const photoDoc = await getDoc(photoDocRef);

    if (photoDoc.exists()) {
      res.status(200).json({ id: photoDoc.id, ...photoDoc.data() });
    } else {
      res.status(404).send("Photo non trouvée.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la photo: ", error);
    res.status(500).send("Erreur lors de la récupération de la photo.");
  }
};

export const updatePicture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const photoDocRef = doc(firestore, "photos", id);
    const photoDoc = await getDoc(photoDocRef);

    if (!photoDoc.exists()) {
      return res.status(404).send("Photo non trouvée.");
    }

    let imageUrl = photoDoc.data().imageUrl;

    // Si une nouvelle image est fournie, remplacez l'ancienne
    if (req.file) {
      // Supprimer l'ancienne image de Firebase Storage
      const oldImageRef = ref(storage, imageUrl);
      await deleteObject(oldImageRef);

      // Télécharger la nouvelle image et obtenir l'URL
      const newImageRef = ref(storage, `images/${req.file.filename}`);
      const snapshot = await uploadBytes(newImageRef, req.file.buffer);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Mettre à jour le document Firestore
    await updateDoc(photoDocRef, {
      title,
      description,
      imageUrl,
    });

    res.status(200).send("Photo mise à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo: ", error);
    res.status(500).send("Erreur lors de la mise à jour de la photo.");
  }
};
