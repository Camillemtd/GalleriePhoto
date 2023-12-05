// middleware/auth.ts
import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

const serviceAccount = require('../../config/firebase-adminsdk.json')
// Initialisez l'application Admin de Firebase si vous ne l'avez pas déjà fait
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
  // ... autres options de configuration
});

// Middleware pour vérifier l'authentification Firebase
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(403).send('Token d\'authentification manquant.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken) {
      req['uid'] = decodedToken.uid; // Ajoutez l'UID à l'objet de requête pour un usage ultérieur
      next();
    } else {
      throw new Error('Non autorisé');
    }
  } catch (error) {
    console.error('Erreur de vérification du token d\'authentification:', error);
    res.status(403).send('Non autorisé');
  }
};

